// --__--__-- SETUP & GLOBALS --__--__--
const canvas = document.getElementById("mainCanvas");
const canHolder = document.getElementById("canvasHolder");
const ctx = canvas.getContext("2d");
const styles = getComputedStyle(document.documentElement);

const palette = {
  gridDots: styles.getPropertyValue("--canvas-dots").trim(),
  node: styles.getPropertyValue("--node").trim(),
  nodeBorder: styles.getPropertyValue("--node-border").trim(),
  nodeRope: styles.getPropertyValue("--node-rope").trim(),
};

let canvasPosition = { x: 0, y: 0 };
let canvasZoom = 1;
let mousePosition = { x: 0, y: 0 };
let lastMousePos = null;

let mouseDownDesk = false;
let nodeSelected = null;
let hookSelected_1 = null;
let tempRope = null;

const gridSize = 30;
const gridDot = 2;

const allNodes = [];
const allRopes = [];

// --__--__-- CANVAS & GRID RENDERING --__--__--
function resizeCanvas() {
  const rect = canHolder.getBoundingClientRect();

  canvas.width = rect.width;
  canvas.height = rect.height;
}

function drawGrid() {
  const offset = {
    x: Math.floor(canvasPosition.x / gridSize) + 1,
    y: Math.floor(canvasPosition.y / gridSize) + 1,
  };

  let sX = offset.x * -gridSize;
  let sY = offset.y * -gridSize;

  let cX = sX;
  let cY = sY;

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

function refreshCanvas() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.translate(canvasPosition.x, canvasPosition.y);
  ctx.scale(canvasZoom, canvasZoom);

  drawGrid();

  for (let i = 0; i < allRopes.length; i++) {
    allRopes[i].update();
    allRopes[i].draw();
  }

  if (tempRope) {
    tempRope.end = {
      x: mousePosition.x - canvasPosition.x,
      y: mousePosition.y - canvasPosition.y,
    };

    tempRope.draw();
  }

  for (let i = 0; i < allNodes.length; i++) {
    allNodes[i].draw();
  }
}

// --__--__-- EVENT LISTENERS --__--__--
window.addEventListener("pointerdown", (e) => {
  lastMousePos = {
    x: mousePosition.x,
    y: mousePosition.y,
  };

  mouseDownDesk = true;

  for (let i = 0; i < allNodes.length; i++) {
    const hook = allNodes[i].checkHookPoints();

    if (hook && hook.side == "left" && allNodes[i].leftHooked) {
      const ropeIndex = allRopes.findIndex(
        (r) => r.endNode === allNodes[i] && r.endSide === "left",
      );

      if (ropeIndex !== -1) {
        const rope = allRopes[ropeIndex];

        hookSelected_1 = {
          node: rope.startNode,
          side: rope.startSide,
          point: rope.start,
        };
        nodeSelected = rope.startNode;

        tempRope = new Rope(rope.start, {
          x: mousePosition.x - canvasPosition.x,
          y: mousePosition.y - canvasPosition.y,
        });

        rope.startNode[rope.startSide + "Hooked"] = false;
        rope.endNode[rope.endSide + "Hooked"] = false;
        allRopes.splice(ropeIndex, 1);

        mouseDownDesk = false;
        break;
      }
    }

    if (hook && hook.side == "right") {
      hookSelected_1 = hook;

      tempRope = new Rope(hook.point, {
        x: mousePosition.x - canvasPosition.x,
        y: mousePosition.y - canvasPosition.y,
      });

      nodeSelected = allNodes[i];

      mouseDownDesk = false;

      break;
    }

    if (allNodes[i].checkClick()) {
      nodeSelected = allNodes[i];

      mouseDownDesk = false;

      break;
    }
  }
});

window.addEventListener("pointerup", () => {
  if (hookSelected_1 && nodeSelected) {
    for (let i = 0; i < allNodes.length; i++) {
      const targetNode = allNodes[i];

      if (targetNode === nodeSelected) {
        continue;
      }

      const targetHook = targetNode.checkHookPoints();

      if (targetHook && targetHook.side === "left" && !targetNode.leftHooked) {
        const rope = new Rope(hookSelected_1.point, targetHook.point);

        rope.startNode = nodeSelected;
        rope.startSide = hookSelected_1.side;

        rope.endNode = targetNode;
        rope.endSide = targetHook.side;

        allRopes.push(rope);

        nodeSelected[hookSelected_1.side + "Hooked"] = true;
        targetNode[targetHook.side + "Hooked"] = true;

        break;
      }
    }
  }

  mouseDownDesk = false;

  nodeSelected = null;
  hookSelected_1 = null;
  tempRope = null;

  refreshCanvas();
});

window.addEventListener("pointermove", (event) => {
  const rect = canvas.getBoundingClientRect();

  mousePosition = {
    x: (event.clientX - rect.left) * (canvas.width / rect.width),
    y: (event.clientY - rect.top) * (canvas.height / rect.height),
  };

  mouseDrag();
});

// --__--__-- INTERACTION & COLLISION --__--__--
function mouseDrag() {
  if (mouseDownDesk) {
    const distX = mousePosition.x - lastMousePos.x;
    const distY = mousePosition.y - lastMousePos.y;

    canvasPosition.x += distX;
    canvasPosition.y += distY;
  }

  if (nodeSelected && !hookSelected_1) {
    const distX = mousePosition.x - lastMousePos.x;
    const distY = mousePosition.y - lastMousePos.y;

    nodeSelected.x += distX / canvasZoom;
    nodeSelected.y += distY / canvasZoom;
  }

  lastMousePos = {
    x: mousePosition.x,
    y: mousePosition.y,
  };

  refreshCanvas();
}

function boxCollision(cord, box) {
  const x = cord[0] - canvasPosition.x;
  const y = cord[1] - canvasPosition.y;

  const sx = box[0];
  const sy = box[1];

  const ex = box[2] + sx;
  const ey = box[3] + sy;

  return x > sx && x < ex && y > sy && y < ey;
}

function circleCollision(cord, circle) {
  const x = cord[0] - canvasPosition.x;
  const y = cord[1] - canvasPosition.y;

  const cx = circle[0];
  const cy = circle[1];

  const radius = circle[2];

  const dx = x - cx;
  const dy = y - cy;

  return dx * dx + dy * dy <= radius * radius;
}

// --__--__-- CLASSES --__--__--
class Rope {
  constructor(start, end) {
    this.start = start;
    this.end = end;

    this.startNode = null;
    this.endNode = null;

    this.startSide = null;
    this.endSide = null;
  }

  update() {
    if (this.startNode && this.startSide) {
      this.start = {
        x:
          this.startNode.x +
          (this.startSide === "right" ? this.startNode.width : 0),
        y: this.startNode.y,
      };
    }

    if (this.endNode && this.endSide) {
      this.end = {
        x: this.endNode.x + (this.endSide === "right" ? this.endNode.width : 0),
        y: this.endNode.y,
      };
    }
  }

  draw() {
    ctx.strokeStyle = palette.nodeRope;
    ctx.lineWidth = 6;

    ctx.beginPath();
    ctx.moveTo(this.start.x, this.start.y);
    ctx.lineTo(this.end.x, this.end.y);
    ctx.stroke();
    ctx.closePath();
  }
}

class TextNode {
  constructor(x, y, text) {
    this.x = x;
    this.y = y;

    this.text = text;

    this.hookRadius = 6;
    this.fontSize = 15;

    ctx.font = `${this.fontSize}px monospace`;

    this.width = ctx.measureText(this.text).width + this.fontSize * 2;

    if (this.width < 50) {
      this.width = 50;
    }

    this.height = this.fontSize * 3;

    this.leftHooked = false;
    this.rightHooked = false;
  }

  draw() {
    const textX =
      this.x + this.width / 2 - ctx.measureText(this.text).width / 2;
    const textY = this.y + 5;

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

    let leftColor = this.leftHooked ? palette.nodeRope : palette.nodeBorder;

    ctx.beginPath();
    ctx.fillStyle = leftColor;
    ctx.arc(this.x, this.y, this.hookRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = palette.node;
    ctx.arc(this.x, this.y, this.hookRadius / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    let rightColor = this.rightHooked ? palette.nodeRope : palette.nodeBorder;

    ctx.beginPath();
    ctx.fillStyle = rightColor;
    ctx.arc(this.x + this.width, this.y, this.hookRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = palette.node;
    ctx.arc(this.x + this.width, this.y, this.hookRadius / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

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

  checkHookPoints() {
    if (
      circleCollision(
        [mousePosition.x, mousePosition.y],
        [this.x, this.y, this.hookRadius],
      )
    ) {
      return {
        node: this,
        side: "left",
        point: { x: this.x, y: this.y },
      };
    }

    if (
      circleCollision(
        [mousePosition.x, mousePosition.y],
        [this.x + this.width, this.y, this.hookRadius],
      )
    ) {
      return {
        node: this,
        side: "right",
        point: { x: this.x + this.width, y: this.y },
      };
    }

    return null;
  }
}

// --__--__-- INITIALIZATION --__--__--
resizeCanvas();

allNodes.push(new TextNode(350, 350, "hello notes"));
allNodes.push(new TextNode(450, 200, "I can be fast"));
allNodes.push(new TextNode(400, 250, "I can be super slow bro"));

refreshCanvas();
