const canvas = document.getElementById("mainCanvas");
const canHolder = document.getElementById("canvasHolder");
const ctx = canvas.getContext("2d");
const styles = getComputedStyle(document.documentElement);

const palette = {
  gridDots: styles.getPropertyValue("--canvas-dots").trim(),
  node: styles.getPropertyValue("--node").trim(),
  nodeBorder: styles.getPropertyValue("--node-border").trim(),
};

function resizeCanvas() {
  const rect = canHolder.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
}
resizeCanvas();

let canvasPosition = {
  x: 0,
  y: 0,
};

let canvasZoom = 1;

const gridSize = 30;
const gridDot = 2;

function drawGrid() {
  const offset = {
    x: Math.floor(canvasPosition.x / gridSize) + 1,
    y: Math.floor(canvasPosition.y / gridSize) + 1,
  };

  sX = offset.x * -gridSize;
  sY = offset.y * -gridSize;

  cX = sX;
  cY = sY;

  const rowLength = Math.floor(canvas.width / gridSize);
  const columnLength = Math.floor(canvas.height / gridSize);

  for (let i = 0; i < rowLength; i++) {
    cX += gridSize;
    cY = sY;
    for (let j = 0; j < columnLength; j++) {
      cY += gridSize;
      ctx.fillStyle = palette.gridDots;

      ctx.beginPath();

      ctx.arc(cX, cY, gridDot, 0, Math.PI * 2);

      ctx.fill();
    }
  }
}

const allNodes = [];
function refreshCanvas() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.translate(canvasPosition.x, canvasPosition.y);

  ctx.scale(canvasZoom, canvasZoom);

  drawGrid();

  for (let i = 0; i < allNodes.length; i++) {
    allNodes[i].draw();
  }
}

let lastMousePos = null;

let mouseDownDesk = false;
let nodeSelected = null;

window.addEventListener("pointerdown", (e) => {
  const rect = canvas.getBoundingClientRect();

  lastMousePos = {
    x: mousePosition.x,
    y: mousePosition.y,
  };

  nodeSelected = null;
  for (let i = 0; i < allNodes.length; i++) {
    if (allNodes[i].checkClick()) {
      nodeSelected = allNodes[i];
      break;
    }
  }
  if (!nodeSelected) mouseDownDesk = true;
});

window.addEventListener("pointerup", () => {
  mouseDownDesk = false;
  nodeSelected = null;
});

//Global listener
window.addEventListener("pointermove", (event) => {
  const rect = canvas.getBoundingClientRect();
  const pos = {
    x: (event.clientX - rect.left) * (canvas.width / rect.width),
    y: (event.clientY - rect.top) * (canvas.height / rect.height),
  };
  mousePosition = pos;
  mouseDrag();
});

function mouseDrag() {
  if (mouseDownDesk) {
    const distX = mousePosition.x - lastMousePos.x;

    const distY = mousePosition.y - lastMousePos.y;

    canvasPosition.x += distX;
    canvasPosition.y += distY;
  }

  if (nodeSelected) {
    const distX = mousePosition.x - lastMousePos.x;

    const distY = mousePosition.y - lastMousePos.y;
    nodeSelected.x += distX;
    nodeSelected.y += distY;
  }

  lastMousePos = {
    x: mousePosition.x,
    y: mousePosition.y,
  };

  refreshCanvas();
}

function boxCollision(cord, box) {
  x = cord[0] - canvasPosition.x;
  y = cord[1] - canvasPosition.y;

  sx = box[0];
  sy = box[1];
  ex = box[2] + sx;
  ey = box[3] + sy;
  return x > sx && x < ex && y > sy && y < ey;
}

class TextNode {
  constructor(x, y, text) {
    this.x = x;
    this.y = y;
    this.text = text;

    this.fontSize = 15;
    ctx.font = `${this.fontSize}px monospace`;
    this.width = ctx.measureText(this.text).width + this.fontSize * 2;
    if (this.width < 50) this.width = 50;
    this.height = this.fontSize * 3;
  }

  draw() {
    const textX =
      this.x + this.width / 2 - ctx.measureText(this.text).width / 2;
    const textY = this.y + 5;

    //Main BLock
    ctx.fillStyle = palette.node;
    ctx.beginPath();
    ctx.roundRect(
      this.x,
      this.y - this.height / 2,
      this.width,
      this.height,
      10,
    );
    ctx.strokeStyle = palette.nodeBorder;
    ctx.lineWidth = 4;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    //Left Hook
    ctx.beginPath();
    ctx.fillStyle = palette.nodeBorder;
    ctx.arc(this.x, this.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.fillStyle = palette.node;
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    //Right Hook
    ctx.beginPath();
    ctx.fillStyle = palette.nodeBorder;
    ctx.arc(this.x + this.width, this.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.fillStyle = palette.node;
    ctx.arc(this.x + this.width, this.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    //Text
    ctx.fillStyle = "white";
    ctx.font = `${this.fontSize}px monospace`;
    ctx.fillText(this.text, textX, textY);
  }

  checkClick() {
    return boxCollision(
      [mousePosition.x, mousePosition.y],
      [this.x, this.y - this.height / 2, this.width, this.height],
    );
  }
}

allNodes.push(new TextNode(350, 350, "hello notes"));

// allNodes.push(new TextNode(450, 200, "I can be fast"));

refreshCanvas();
