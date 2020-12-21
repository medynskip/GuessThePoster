import { data } from "./movies.js";
import { Controls } from "./controls.js";
import { Scoreboard } from "./scoreboard.js";
import { Gameboard } from "./gameboard.js";

const controls = new Controls();
const scoreboard = new Scoreboard();
const gameboard = new Gameboard();

const movies = [...data];

const rand = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const loading = () => {
  let loader = document.createElement("div");
  loader.innerHTML = '<img src="/images/spinner.svg" alt="spinner" />';
  loader.id = "loader";
  document.getElementById("game").appendChild(loader);
};

const unloading = () => {
  var el = document.getElementById("loader");
  el.remove();
};

const mouseDownHandle = (e) => {
  gameboard.drawing = true;
  gameboard.drawCanvas(e.offsetX, e.offsetY);
  // countPoints(ctxCalc);
};

const mouseMoveHandle = (e) => {
  if (gameboard.drawing == true) {
    gameboard.drawCanvas(e.offsetX, e.offsetY);
  }
};

const mouseUpHandle = (e) => {
  gameboard.drawing = false;
  scoreboard.updateCurrent(gameboard.countPoints());
};

// const createCanvasFill = (currentImage) => {
//   const tempCanvas = document.createElement("canvas");
//   const tempCtx = tempCanvas.getContext("2d");
//   tempCanvas.width = pw;
//   tempCanvas.height = ph;
//   tempCtx.drawImage(currentImage, 0, 0, pw, ph);
//   gameboard.ctx.fillStyle = ctx.createPattern(tempCanvas, "no-repeat");
//   gameboard.ctxPointCanvas.fillStyle = "red";
// };

const generateImage = (file_path) => {
  const strDataURI = `https://image.tmdb.org/t/p/w1280${file_path}`;
  gameboard.image.src = strDataURI;
  gameboard.image.onload = () => {
    unloading();
    gameboard.createFill();
    gameboard.addMouseHandlers(mouseDownHandle, mouseMoveHandle, mouseUpHandle);
  };
};

const fetchImage = (id) => {
  const url = `https://api.themoviedb.org/3/movie/${id}/images?api_key=a7a279b94f7be340c3155d4b7df30384&language=null`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const index = rand(0, data.backdrops.length - 1);
      const imgPath = data.backdrops[index].file_path;
      generateImage(imgPath);
    });
};

const newQuestion = () => {
  let index = rand(0, movies.length);
  controls.createInputs(movies[index]);
  controls.fieldFocus();
  controls.enable();
  gameboard.clearCanvases();
  fetchImage(movies[index].id);
};

const nextBtnEvents = () => {
  scoreboard.resetCurrent();
  gameboard.clearMouseHandlers(mouseDownHandle, mouseMoveHandle, mouseUpHandle);
  nextTurn();
};

const revealBtnEvents = () => {
  gameboard.clearMouseHandlers(mouseDownHandle, mouseMoveHandle, mouseUpHandle);
  gameboard.ctx.drawImage(gameboard.image, 0, 0, gameboard.pw, gameboard.ph);
};

const submitBtnEvents = () => {
  gameboard.clearMouseHandlers(mouseDownHandle, mouseMoveHandle, mouseUpHandle);
  gameboard.ctx.drawImage(gameboard.image, 0, 0, gameboard.pw, gameboard.ph);
  scoreboard.updateTotal();
};

const newBtnEvents = () => {
  newGame();
};

const nextTurn = () => {
  scoreboard.slideUp();
  if (scoreboard.slide <= 10) {
    loading();
    newQuestion();
    scoreboard.slide == 10
      ? (controls.next.innerText = "Summary")
      : (controls.next.innerText = "Next");
  } else {
    controls.disable();
    alert(`Gratulacje, zdobyles ${scoreboard.total} punktów`);
  }
};

const newGame = () => {
  scoreboard.slide = 0;
  scoreboard.resetTotal();
  controls.subscribe({
    nextBtnEvents,
    revealBtnEvents,
    submitBtnEvents,
    newBtnEvents,
  });
  nextTurn();
};

window.onload = function () {
  gameboard.register(newGame);
};
