const canvas = document.getElementById("mainCanvas");
const canHolder = document.getElementById("canvasHolder");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  const rect = canHolder.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
}
resizeCanvas();

const lightTheme = {
  gridDots: "rgb(74, 38, 4)",
};

const palette = lightTheme;

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

function refreshCanvas() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.translate(canvasPosition.x, canvasPosition.y);

  ctx.scale(canvasZoom, canvasZoom);

  ctx.fillStyle = "white";

  drawGrid();
}

let lastMousePos = null;

let mouseDown = false;

window.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();

  lastMousePos = {
    x: mousePosition.x,
    y: mousePosition.y,
  };

  mouseDown = true;
});

window.addEventListener("mouseup", () => {
  mouseDown = false;
});

function mouseDrag() {
  const rect = canvas.getBoundingClientRect();

  if (!mouseDown) return;

  const distX = mousePosition.x - lastMousePos.x;

  const distY = mousePosition.y - lastMousePos.y;

  canvasPosition.x += distX;
  canvasPosition.y += distY;

  lastMousePos = {
    x: mousePosition.x,
    y: mousePosition.y,
  };

  refreshCanvas();
}

refreshCanvas();
