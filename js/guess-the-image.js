import {
    data
} from './movies.js';

const canvas = document.getElementById('poster');
const calculate = document.getElementById('calculate');
const ctx = canvas.getContext('2d');
const ctxCalc = calculate.getContext('2d');

const pw = document.documentElement.clientWidth < 1200 ? (document.documentElement.clientWidth - 100) : 1100;
const ph = Math.round(pw / 1.77);

canvas.width = pw;
canvas.height = ph;
calculate.width = pw;
calculate.height = ph;


const img = new Image;
const scratch = new Image;

const box = 32;
let answerString = "";
let currentPoints = 0;
let totalPoints = 0;
let slide = 0;
let draw = false;
// let loading = false;
const movies = [...data];

const answer = document.getElementById("answer");
const scoreCurrent = document.getElementById('score-current');
const scoreTotal = document.getElementById('score-total');
const submitBtn = document.getElementById("submit");
const nextBtn = document.getElementById("skip");
const revealBtn = document.getElementById("reveal");
const newBtn = document.getElementById("new");

const allowed = `ABCDEFGHIJKLMNOPQRSTUWVXYZabcdefghijklmnopqrstuwvxyz0123456789`;

const rand = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const loading = () => {
    let loader = document.createElement('div');
    loader.innerHTML = '<img src="/images/spinner.svg" alt="spinner" />';
    loader.id = 'loader';
    document.getElementById("game").appendChild(loader);
}

const unloading = () => {
    var el = document.getElementById('loader');
    el.remove();
}

const checkButton = (key, position, fields) => {
    if (key == 'Backspace' && position > 0) {
        fields[position - 1].focus();
    } else if (key == 'Backspace' && position == 0) {
        fields[position].focus();
    } else if (position == fields.length - 1) {
        document.getElementById('submit').focus();
    } else {
        fields[position + 1].focus();
    }
}

const fieldFocus = () => {
    const fields = document.querySelectorAll('input');
    fields.forEach((el, i) => {
        el.addEventListener('keyup', (e) => {
            checkButton(e.code, i, fields)
        })
    })
}

const drawCanvas = (canvas, x, y) => {
    canvas.forEach((e) => {
        e.beginPath();
        e.arc(x + 12, y + 12, box, 0, 2 * Math.PI);
        e.fill();
    })
}

const countPoints = (canvas) => {
    let revealed = 0;
    const colorData = canvas.getImageData(0, 0, pw, ph);
    for (let i = 0; i < colorData.data.length; i += 4) {
        colorData.data[i] > 0 ? revealed += 1 : revealed;
    }
    currentPoints = 1000 - (Math.round(1000 * (revealed / (ph * pw))));
    scoreCurrent.innerText = currentPoints;
}

const mouseDownHandle = (e) => {
    draw = true;
    drawCanvas([ctx, ctxCalc], e.offsetX, e.offsetY);
    countPoints(ctxCalc);
}

const mouseMoveHandle = (e) => {
    if (draw == true) {
        drawCanvas([ctx, ctxCalc], e.offsetX, e.offsetY);
        countPoints(ctxCalc);
    }
}

const mouseUpHandle = (e) => {
    draw = false;
}

const clearMouseHandlers = () => {
    canvas.removeEventListener("mousedown", mouseDownHandle);
    canvas.removeEventListener("mousemove", mouseMoveHandle);
    canvas.removeEventListener("mouseup", mouseUpHandle);
}

const initiateCanvases = (currentImage) => {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = pw;
    tempCanvas.height = ph;
    tempCtx.drawImage(currentImage, 0, 0, pw, ph);
    ctx.fillStyle = ctx.createPattern(tempCanvas, "no-repeat");
    ctxCalc.fillStyle = 'red';
}

const generateImage = (file_path) => {

    const strDataURI = `https://image.tmdb.org/t/p/w1280${file_path}`;
    console.log(strDataURI);
    // const strDataURI = `http://image.tmdb.org/t/p/w1920_and_h800_multi_faces${file_path}`;
    img.src = strDataURI;
    scratch.src = "../images/scratch.jpg";

    img.onload = () => {
        unloading();
        initiateCanvases(img)
        canvas.addEventListener("mousedown", mouseDownHandle);
        canvas.addEventListener("mousemove", mouseMoveHandle);
        canvas.addEventListener("mouseup", mouseUpHandle);
    };
}

const fetchImage = (id) => {
    const url = `https://api.themoviedb.org/3/movie/${id}/images?api_key=a7a279b94f7be340c3155d4b7df30384&language=null`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            const index = rand(0, data.backdrops.length)
            const imgPath = data.backdrops[index].file_path;
            generateImage(imgPath);
        })
}

const posterReveal = (item) => {
    submitBtn.disabled = false;
    revealBtn.disabled = false;

    scratch.onload = () => {
        ctx.drawImage(scratch, 0, 0, pw, ph);
        ctxCalc.clearRect(0, 0, calculate.width, calculate.height)
    }

    fetchImage(movies[item].id);

    // const strDataURI = `http://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${movies[item].img}`;
    // img.src = strDataURI;
    // scratch.src = "../images/scratch.jpg";

    // img.onload = () => {
    //     unloading();
    //     initiateCanvases(img)
    //     canvas.addEventListener("mousedown", mouseDownHandle);
    //     canvas.addEventListener("mousemove", mouseMoveHandle);
    //     canvas.addEventListener("mouseup", mouseUpHandle);
    // };
}

const createInputs = (item) => {
    for (let i = 0; i < movies[item].title.length; i++) {
        if (movies[item].title[i] == " ") {
            answer.innerHTML += `<span> </span></br>`;
        } else if (allowed.indexOf(movies[item].title[i]) == -1) {
            answer.innerHTML += `<span> ${movies[item].title[i]} </span>`
        } else {
            answerString += movies[item].title[i];
            answer.innerHTML += `<input type="text" name="${i}" required minlength="1" maxlength="1" size="1">`;
        }
    }
}

const newMovie = () => {
    let index = rand(0, movies.length);
    answer.innerHTML = "";
    answerString = "";
    posterReveal(index);
    createInputs(index);
    fieldFocus();
}


nextBtn.addEventListener("click", () => {
    clearMouseHandlers();
    document.getElementById('text').innerText = ""
    getRecords();
    scoreCurrent.innerText = 1000;
})

revealBtn.addEventListener("click", () => {
    clearMouseHandlers();
    ctx.drawImage(img, 0, 0, pw, ph);
    submitBtn.disabled = true;
    revealBtn.disabled = true;
    const fields = document.querySelectorAll('input');
    fields.forEach((el, i) => {
        el.value = answerString[i];
    })
})

submitBtn.addEventListener("click", () => {
    const fields = document.querySelectorAll('input');
    let response = "";
    fields.forEach((el, i) => {
        response += el.value;
    })
    if (response.toLowerCase() == answerString.toLowerCase()) {
        clearMouseHandlers();
        document.getElementById('text').innerText = "BRAWO!";
        ctx.drawImage(img, 0, 0, pw, ph);
        totalPoints += currentPoints;
        scoreTotal.innerText = totalPoints;
        submitBtn.disabled = true;
        revealBtn.disabled = true;
        nextBtn.focus();
    } else {
        document.getElementById('text').innerText = "ŹLE"
    }
})

newBtn.addEventListener("click", () => {
    slide = 0;
    totalPoints = 0;
    getRecords();
})

const getRecords = () => {
    // const urls = [];
    // const url2 = `https://api.themoviedb.org/3/discover/movie?api_key=a7a279b94f7be340c3155d4b7df30384&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&vote_count.gte=5000&page=`;
    // const url2 = `https://api.themoviedb.org/3/discover/movie?api_key=a7a279b94f7be340c3155d4b7df30384&language=en-US&sort_by=popularity.desc&include_adult=false&with_genres=16&include_video=false&vote_count.gte=5000&page=`;
    // for (let i = 1; i <= 8; i++) {
    //     urls.push(fetch(url2 + i));
    // }
    // Promise.all(urls)
    //     .then(function (responses) {
    //         return Promise.all(responses.map(function (response) {
    //             return response.json();
    //         }));
    //     }).then(function (data) {
    //         for (let x = 0; x < data.length; x++) {
    //             movies.push(...data[x].results)
    //         }
    //         newMovie();
    //         console.log(movies);
    //         let htmlCode = '';
    //         movies.map((el) => {
    //             // var text = document.createTextNode("Tutorix is the best e-learning platform");
    //             // tag.appendChild(text);
    //             htmlCode += `{<br />
    //                     id: ${el.id},<br / >
    //                     img: '${el.backdrop_path}',<br / >
    //                     title: '${el.title}'<br / >
    //                     },`
    //         });
    //         var tag = document.createElement("p");
    //         tag.innerHTML = htmlCode;
    //         document.getElementById("json").appendChild(tag);
    //     })
    // console.log(movies);
    slide += 1;
    if (slide <= 10) {
        loading();
        document.getElementById("slide-number").innerText = slide;
        newMovie();
        slide == 10 ? nextBtn.innerText = "Summary" : null;
    } else {
        alert(`Gratulacje, zdobyles ${totalPoints} punktów`)
    }
}

window.onload = function () {
    getRecords();
};