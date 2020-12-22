import { dataSeries } from "./data-series.js";
import { dataMovies } from "./data-movies.js";
import { dataPeople } from "./data-people.js";
import { Controls } from "./controls.js";
import { Scoreboard } from "./scoreboard.js";
import { Gameboard } from "./gameboard.js";

const controls = new Controls();
const scoreboard = new Scoreboard();
const gameboard = new Gameboard();

let records = "";

const getRecords = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const type = urlParams.get("guess");
  switch (type) {
    case "movies":
      return {
        type: "movie",
        data: [...dataMovies],
      };
    case "kids":
      return {
        type: "movie",
        data: [...dataMovies],
      };
    case "actors":
      return {
        type: "person",
        data: [...dataPeople],
      };
    case "tv":
      return {
        type: "tv",
        data: [...dataSeries],
      };
  }
};

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
  // const url = `https://api.themoviedb.org/3/movie/${id}/images?api_key=a7a279b94f7be340c3155d4b7df30384&language=null`;
  const url = `https://api.themoviedb.org/3/${records.type}/${id}/images?api_key=a7a279b94f7be340c3155d4b7df30384`;
  console.log(url);
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const path =
        records.type == "person" ? [...data.profiles] : [...data.backdrops];
      const index = rand(0, path.length - 1);
      const imgPath = path[index].file_path;
      generateImage(imgPath);
    });
};

const newQuestion = () => {
  let index = rand(0, records.data.length);
  controls.createInputs(records.data[index]);
  controls.fieldFocus();
  controls.enable();
  gameboard.clearCanvases();
  fetchImage(records.data[index].id);
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

// const getResults = () => {
//   const dataset = [];
//   const urls = [];
//   // People
//   // const url = `https://api.themoviedb.org/3/person/popular?api_key=a7a279b94f7be340c3155d4b7df30384&page=`;
//   // TV Series
//   const url = `https://api.themoviedb.org/3/discover/tv?language=en-US&sort_by=popularity.desc&vote_count.gte=1000&api_key=a7a279b94f7be340c3155d4b7df30384&page=`;
//   for (let i = 1; i <= 10; i++) {
//     urls.push(fetch(url + i));
//   }
//   Promise.all(urls)
//     .then(function (responses) {
//       return Promise.all(
//         responses.map(function (response) {
//           return response.json();
//         })
//       );
//     })
//     .then(function (data) {
//       for (let x = 0; x < data.length; x++) {
//         dataset.push(...data[x].results);
//       }
//       let result = ``;
//       dataset.map((el) => {
//         result += `
//         {<br />
//     id: ${el.id},<br />
//     img: '${el.backdrop_path}',<br />
//     title: '${el.name}'<br />
// },

//         `;
//       });
//       document.getElementById("text").innerHTML = result;

//       console.log(dataset);
//     });
// };

window.onload = function () {
  // getResults();
  records = getRecords();
  gameboard.register(newGame);
};
