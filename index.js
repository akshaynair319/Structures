//import necessary clases and functions
import {
  changeColor,
  changePenWidth,
  clearCanvas,
  resetCanvas,
  undoCanvas,
  toggleModal,
  createNewArray,
  moveArray,
  drawStart,
  continueDraw,
  endDraw,
} from "./utils.js";

//setting up canvas
const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let context = canvas.getContext("2d");

const devicePixelRatio = 1.5;
// get current size of the canvas
const rect = canvas.getBoundingClientRect();

// increase the actual size of our canvas
canvas.width = rect.width * devicePixelRatio;
canvas.height = rect.height * devicePixelRatio;

// ensure all drawing operations are scaled
context.scale(devicePixelRatio, devicePixelRatio);

// scale everything down using CSS
canvas.style.width = rect.width + "px";
canvas.style.height = rect.height + "px";

//making a canvas environment object
const canvasEnv = {
  pointX: (canvas.width / devicePixelRatio) * 0.75,
  pointY: (canvas.height / devicePixelRatio) * 0.75,
  moveable: false,
  selectedArray: -1,
  isModalOpen: false,
  isDrawing: false,
  color: "red",
  cellSize: 50,
  penWidth: 5,
  lineWidth: 2,
  drawnArrays: [],
  storedImages: [],
  devicePixelRatio: devicePixelRatio,
  canvas: canvas,
  context: context,
};

//disabling right click
document.addEventListener("contextmenu", (event) => event.preventDefault());
//submitting form
const form = document.getElementById("arrayForm");
form.addEventListener("submit", (e) => createNewArray(e, canvasEnv));

//adding event listeners to buttons
document
  .getElementById("toggle-modal")
  .addEventListener("click", () => toggleModal(canvasEnv));
document
  .getElementById("clear-canvas")
  .addEventListener("click", () => resetCanvas(canvasEnv));
document
  .getElementById("undo-canvas")
  .addEventListener("click", () => undoCanvas(canvasEnv));

//adding event listeners to 4 color-change div
const primary_colors = document.getElementsByClassName("color-change");

Array.from(primary_colors).forEach((element) => {
  element.addEventListener("click", (e) => changeColor(e, canvasEnv));
});

//adding event listener to color-picker
const color_picker = document.getElementById("selectedColor");
color_picker.addEventListener("input", (e) => {
  canvasEnv.color = e.target.value;
});

//adding event listener to slider
const slider = document.getElementsByClassName("slider")[0];
slider.addEventListener("change", (e) => changePenWidth(e, canvasEnv));

//adding event listeners for moving lst created array on canvas
window.addEventListener("mousemove", (e) => moveArray(e, canvasEnv));
window.addEventListener("mousedown", (e) => moveArray(e, canvasEnv));
window.addEventListener("mouseup", (e) => moveArray(e, canvasEnv));

//adding event listeners for drawing on canvas
canvas.addEventListener("mousedown", (e) => drawStart(e, canvasEnv));
canvas.addEventListener("mousemove", (e) => continueDraw(e, canvasEnv));
canvas.addEventListener("mouseup", (e) => endDraw(e, canvasEnv));
canvas.addEventListener("mouseout", (e) => endDraw(e, canvasEnv));
