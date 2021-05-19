import Point from "./Point.js";
import MyArray from "./MyArray.js";

//returns distance between 2 points
const getDistance = (point1, point2) => {
  return Math.sqrt(
    Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
  );
};

//takes a screenshot when called, also stores the action-type:
//if action === -1. last action was doodle, else it was an array-based event.
//We would also be storing the previous locations of the arrays and if
//the arrays were sorted or not
const takeImage = (canvasEnv, index, sorted) => {
  console.log(index, sorted);
  canvasEnv.storedImages.push({
    image: canvasEnv.context.getImageData(
      0,
      0,
      canvasEnv.canvas.width,
      canvasEnv.canvas.height
    ),
    action: index,
    sorted: sorted,
  });
};
export const changeColor = (event, canvasEnv) => {
  canvasEnv.color = event.target.style.background;
};

export const changePenWidth = (event, canvasEnv) => {
  canvasEnv.penWidth = event.target.value;
};

export const resetCanvas = (canvasEnv) => {
  clearCanvas(canvasEnv);
  canvasEnv.drawnArrays = [];
  canvasEnv.storedImages = [];
};
export const clearCanvas = (canvasEnv) => {
  canvasEnv.context.fillStyle = "white";
  canvasEnv.context.clearRect(0, 0, canvas.width, canvas.height);
  // takeImage(canvasEnv,-1);
};
export const undoCanvas = (canvasEnv) => {
  if (canvasEnv.storedImages.length > 0) {
    const index =
      canvasEnv.storedImages[canvasEnv.storedImages.length - 1].action;
    const sorted =
      canvasEnv.storedImages[canvasEnv.storedImages.length - 1].sorted;
    // console.log(canvasEnv.storedImages.length, index, sorted);
    canvasEnv.storedImages.pop();
    if (index !== -1) {
      //previous actions was array based
      if (sorted) {
        canvasEnv.drawnArrays[index].sorted = false;
      } else {
        const done = canvasEnv.drawnArrays[index].undoLastAction();
        if (!done) {
          canvasEnv.drawnArrays.filter((array, idx) => idx !== index);
        }
      }
    }

    if (canvasEnv.storedImages.length === 0) {
      resetCanvas(canvasEnv);
      return;
    }
    canvasEnv.context.putImageData(
      canvasEnv.storedImages[canvasEnv.storedImages.length - 1].image,
      0,
      0
    );
  }
};

export const toggleModal = (canvasEnv) => {
  const modal = document.getElementById("modal");
  const modalButton = document.getElementById("toggle-modal");
  if (canvasEnv.isModalOpen) {
    modal.style.display = "none";
    modalButton.innerText = "Add Array";
    canvasEnv.isModalOpen = false;
    return;
  }

  modal.style.display = "block";
  modalButton.innerText = "Close Modal";
  canvasEnv.isModalOpen = true;
};

export const createNewArray = (e, canvasEnv) => {
  e.preventDefault();
  const arrayName = document
    .getElementById("ArrayName")
    .value.replace(/\s+/g, " ")
    .trim();
  const arrayValues = document
    .getElementById("ArrayInput")
    .value.replace(/\s+/g, " ")
    .trim();
  const nums = arrayValues.split(" ");
  toggleModal(canvasEnv);
  drawArray(arrayName, nums, canvasEnv);
};

export const drawArray = (name, nums, canvasEnv) => {
  const newArray = new MyArray(
    new Point(canvasEnv.pointX, canvasEnv.pointY),
    nums,
    canvasEnv.cellSize,
    canvasEnv.color,
    canvasEnv.lineWidth,
    name
  );
  newArray.drawArray(canvasEnv.context);
  canvasEnv.drawnArrays.push(newArray);
  takeImage(canvasEnv, canvasEnv.drawnArrays.length - 1);
};

const drawAllArrays = (canvasEnv) => {
  for (let i = 0; i < canvasEnv.drawnArrays.length; i++) {
    canvasEnv.drawnArrays[i].drawArray(canvasEnv.context);
  }
};

export const moveArray = (event, canvasEnv) => {
  if (canvasEnv.drawnArrays.length === 0) {
    return;
  }
  // mouseCoordinates wrt canvas
  const mouseX = event.clientX - canvas.offsetLeft;
  const mouseY = event.clientY - canvas.offsetTop;

  if (canvasEnv.moveable) {
    clearCanvas(canvasEnv);
    canvasEnv.drawnArrays[canvasEnv.selectedArray].startPoint.x = mouseX;
    canvasEnv.drawnArrays[canvasEnv.selectedArray].startPoint.y = mouseY;
    drawAllArrays(canvasEnv);
  } else {
    canvasEnv.selectedArray = -1;
    for (let i = 0; i < canvasEnv.drawnArrays.length; i++) {
      const dist = getDistance(
        new Point(mouseX, mouseY),
        new Point(
          canvasEnv.drawnArrays[i].startPoint.x,
          canvasEnv.drawnArrays[i].startPoint.y
        )
      );
      if (dist < 10) {
        canvasEnv.selectedArray = i;
        break;
      }
    }
  }

  if (canvasEnv.selectedArray === -1) {
    canvasEnv.moveable = false;
    document.body.style.cursor = "default";
    return;
  }

  if (event.type === "mousedown" && event.button === 2) {
    sortArray(canvasEnv, canvasEnv.selectedArray);
    clearCanvas(canvasEnv);
    drawAllArrays(canvasEnv);
    takeImage(canvasEnv, canvasEnv.selectedArray, true);
    return;
  }
  if (event.type === "mouseup" && event.button !== 2) {
    canvasEnv.drawnArrays[canvasEnv.selectedArray].addPosition(
      new Point(mouseX, mouseY)
    );
    takeImage(canvasEnv, canvasEnv.selectedArray);
    canvasEnv.moveable = false;
    canvasEnv.selectedArray = -1;
    return;
  }
  if (!canvasEnv.moveable && event.type === "mousemove") {
    document.body.style.cursor = "all-scroll";
    return;
  }
  if (event.type === "mousedown") {
    canvasEnv.moveable = true;
    canvasEnv.isDrawing = false;
    return;
  }
};

export const drawStart = (event, canvasEnv) => {
  //not drawing while an array is moving
  if (canvasEnv.moveable || event.button === 2) {
    return;
  }
  canvasEnv.isDrawing = true;
  canvasEnv.context.strokeStyle = canvasEnv.color;
  canvasEnv.context.lineWidth = canvasEnv.penWidth;
  canvasEnv.context.lineCap = "round";
  canvasEnv.context.lineJoin = "round";
  canvasEnv.context.beginPath();
  canvasEnv.context.moveTo(
    event.clientX - canvasEnv.canvas.offsetLeft,
    event.clientY - canvasEnv.canvas.offsetTop
  );
  event.preventDefault();
};
export const continueDraw = (event, canvasEnv) => {
  if (canvasEnv.isDrawing) {
    canvasEnv.context.lineTo(
      event.clientX - canvasEnv.canvas.offsetLeft,
      event.clientY - canvasEnv.canvas.offsetTop
    );
    canvasEnv.context.stroke();
  }
  event.preventDefault();
};
export const endDraw = (event, canvasEnv) => {
  if (canvasEnv.isDrawing) {
    canvasEnv.isDrawing = false;
    canvasEnv.context.closePath();
    takeImage(canvasEnv, -1);
    // storedImages.push(context.getImageData(0, 0, canvas.width, canvas.height));
  }
  event.preventDefault();
};

const sortArray = (canvasEnv, index) => {
  canvasEnv.drawnArrays[index].sorted = true;
};
