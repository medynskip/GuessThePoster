import { data } from "./movies.js";
import { Controls } from "./controls.js";

const canvas = document.getElementById("poster");
const calculate = document.getElementById("calculate");
const ctx = canvas.getContext("2d");
const ctxCalc = calculate.getContext("2d");

const pw =
  document.documentElement.clientWidth < 1200
    ? document.documentElement.clientWidth - 100
    : 1100;
const ph = Math.round(pw / 1.77);

canvas.width = pw;
canvas.height = ph;
calculate.width = pw;
calculate.height = ph;

const img = new Image();
const scratch = new Image();

const box = 32;
let answerString = "";
let currentPoints = 0;
let totalPoints = 0;
let slide = 0;
let draw = false;
const movies = [...data];

const answer = document.getElementById("answer");
const scoreCurrent = document.getElementById("score-current");
const scoreTotal = document.getElementById("score-total");

const controls = new Controls();

const allowed = `ABCDEFGHIJKLMNOPQRSTUWVXYZabcdefghijklmnopqrstuwvxyz0123456789`;

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

const checkButton = (key, position, fields) => {
  if (key == "Backspace" && position > 0) {
    fields[position - 1].select();
  } else if (key == "Backspace" && position == 0) {
    fields[position].focus();
  } else if (position == fields.length - 1) {
    document.getElementById("submit").focus();
  } else {
    fields[position + 1].select();
  }
};

const fieldFocus = () => {
  const fields = document.querySelectorAll("input");
  fields.forEach((el, i) => {
    el.addEventListener("keyup", (e) => {
      checkButton(e.code, i, fields);
    });
  });
};

const drawCanvas = (canvas, x, y) => {
  canvas.forEach((e) => {
    e.beginPath();
    e.arc(x + 12, y + 12, box, 0, 2 * Math.PI);
    e.fill();
  });
};

const countPoints = (canvas) => {
  let revealed = 0;
  const colorData = canvas.getImageData(0, 0, pw, ph);
  for (let i = 0; i < colorData.data.length; i += 4) {
    colorData.data[i] > 0 ? (revealed += 1) : revealed;
  }
  currentPoints = 1000 - Math.round(1000 * (revealed / (ph * pw)));
  scoreCurrent.innerText = currentPoints;
};

const mouseDownHandle = (e) => {
  draw = true;
  drawCanvas([ctx, ctxCalc], e.offsetX, e.offsetY);
  countPoints(ctxCalc);
};

const mouseMoveHandle = (e) => {
  if (draw == true) {
    drawCanvas([ctx, ctxCalc], e.offsetX, e.offsetY);
    countPoints(ctxCalc);
  }
};

const mouseUpHandle = (e) => {
  draw = false;
};

const clearMouseHandlers = () => {
  canvas.removeEventListener("mousedown", mouseDownHandle);
  canvas.removeEventListener("mousemove", mouseMoveHandle);
  canvas.removeEventListener("mouseup", mouseUpHandle);
};

const initiateCanvases = (currentImage) => {
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  tempCanvas.width = pw;
  tempCanvas.height = ph;
  tempCtx.drawImage(currentImage, 0, 0, pw, ph);
  ctx.fillStyle = ctx.createPattern(tempCanvas, "no-repeat");
  ctxCalc.fillStyle = "red";
};

const generateImage = (file_path) => {
  const strDataURI = `https://image.tmdb.org/t/p/w1280${file_path}`;
  img.src = strDataURI;
  scratch.src = "../images/scratch.jpg";
  img.onload = () => {
    unloading();
    initiateCanvases(img);
    canvas.addEventListener("mousedown", mouseDownHandle);
    canvas.addEventListener("mousemove", mouseMoveHandle);
    canvas.addEventListener("mouseup", mouseUpHandle);
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

const posterReveal = (item) => {
  controls.enable();
  scratch.onload = () => {
    ctx.drawImage(scratch, 0, 0, pw, ph);
    ctxCalc.clearRect(0, 0, calculate.width, calculate.height);
  };
  fetchImage(movies[item].id);
};

const createInputs = (item) => {
  const words = movies[item].title.split(" ");
  let generated = ``;
  for (let i = 0; i < words.length; i++) {
    generated += `<span>`;
    for (let j = 0; j < words[i].length; j++) {
      if (allowed.indexOf(words[i][j]) == -1) {
        generated += `<span> ${words[i][j]} </span>`;
      } else {
        answerString += words[i][j];
        generated += `<input type="text" name="${
          (i, j)
        }" required minlength="1" maxlength="1" size="1">`;
      }
    }
    generated += `</span>`;
  }
  answer.innerHTML = generated;
};

const newMovie = () => {
  let index = rand(0, movies.length);
  answer.innerHTML = "";
  answerString = "";
  posterReveal(index);
  createInputs(index);
  fieldFocus();
};

const nextBtnEvents = () => {
  scoreCurrent.innerText = 1000;
  clearMouseHandlers();
  getRecords();
};

const revealBtnEvents = () => {
  clearMouseHandlers();
  ctx.drawImage(img, 0, 0, pw, ph);
  const fields = document.querySelectorAll("input");
  fields.forEach((el, i) => {
    el.value = answerString[i];
  });
};

const checkAnswer = (response) => {
  return response.toLowerCase() == answerString.toLowerCase();
};

const submitBtnEvents = () => {
  clearMouseHandlers();
  ctx.drawImage(img, 0, 0, pw, ph);
  totalPoints += currentPoints;
  scoreTotal.innerText = totalPoints;
};

const newBtnEvents = () => {
  slide = 0;
  totalPoints = 0;
  scoreTotal.innerText = totalPoints;
  getRecords();
};

const getRecords = () => {
  slide += 1;
  if (slide <= 10) {
    loading();
    document.getElementById("slide-number").innerText = slide;
    newMovie();
    slide == 10
      ? (controls.next.innerText = "Summary")
      : (controls.next.innerText = "Next");
  } else {
    nextBtn.disabled = true;
    submitBtn.disabled = true;
    revealBtn.disabled = true;
    alert(`Gratulacje, zdobyles ${totalPoints} punktów`);
  }
};

window.onload = function () {
  controls.register();
  controls.subscribe({
    nextBtnEvents,
    revealBtnEvents,
    submitBtnEvents,
    newBtnEvents,
    checkAnswer,
  });
  getRecords();
};
