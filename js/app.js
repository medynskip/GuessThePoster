const pw = 600;
const ph = 900;
const box = 12;
let answerString = "";
let response = "";
let points = 0;

const canvas = document.getElementById('poster');
const calculate = document.getElementById('calculate');
const ctx = canvas.getContext('2d');
const ctxCalc = calculate.getContext('2d');
const img = new Image;
const scratch = new Image;

const answer = document.getElementById("answer");
const scoreCurrent = document.getElementById('score-current')
const scoreTotal = document.getElementById('score-total')

const allowed = `ABCDEFGHIJKLMNOPQRSTUWVXYZabcdefghijklmnopqrstuwvxyz0123456789`;

const rand = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const fieldFocus = () => {
    const fields = document.querySelectorAll('input');
    fields.forEach((el, i) => {
        el.addEventListener('keyup', (e) => {
            const key = e.code;
            if (key == 'Backspace' && i > 0) {
                fields[i - 1].focus();
            } else if (key == 'Backspace' && i == 0) {
                fields[i].focus();
            } else if (i == fields.length - 1) {
                document.getElementById('submit').focus();
            } else {
                fields[i + 1].focus();
            }
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
    let pointCount = 0;
    const colorData = canvas.getImageData(0, 0, pw, ph);
    for (let i = 0; i < colorData.data.length; i += 4) {
        colorData.data[i] > 0 ? pointCount += 1 : pointCount += 0;
    }
    points = Math.round(1000 * (pointCount / (ph * pw)));
    console.log(points);
    scoreCurrent.innerText = 1000 - points;
}

const posterReveal = (movies, item) => {
    // const canvas = document.getElementById('poster');
    // const calculate = document.getElementById('calculate');
    // const ctx = canvas.getContext('2d');
    // const ctxCalc = calculate.getContext('2d');
    // const img = new Image;
    // const scratch = new Image;

    scratch.onload = () => {
        ctx.drawImage(scratch, 0, 0);
        ctxCalc.clearRect(0, 0, calculate.width, calculate.height)
    }


    const strDataURI = `https://image.tmdb.org/t/p/w${pw}_and_h${ph}_bestv2${movies[item].poster_path}`;
    img.src = strDataURI;
    scratch.src = "../images/scratch.jpg";

    let draw = false;
    img.onload = () => {
        ctx.fillStyle = ctx.createPattern(img, "no-repeat");
        ctxCalc.fillStyle = 'red';
        canvas.addEventListener("mousedown", (e) => {
            draw = true;
            drawCanvas([ctx, ctxCalc], e.offsetX, e.offsetY);
            // drawCanvas(ctxCalc, e.offsetX, e.offsetY);
        })

        canvas.addEventListener("mousemove", (e) => {
            if (draw == true) {
                drawCanvas([ctx, ctxCalc], e.offsetX, e.offsetY);
                // drawCanvas(ctxCalc, e.offsetX, e.offsetY);
            }
        })
        document.addEventListener("mouseup", (e) => {
            draw = false;
            countPoints(ctxCalc);
        })
    };

    const revealBtn = document.getElementById("reveal");
    revealBtn.addEventListener("click", () => {
        ctx.drawImage(img, 0, 0)
    })


}


const newMovie = () => {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=a7a279b94f7be340c3155d4b7df30384&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${rand(1, 10)}&with_genres=16`;
    // const url = `https://api.themoviedb.org/3/discover/movie?api_key=a7a279b94f7be340c3155d4b7df30384&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${rand(1, 10)}`;
    // const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=a7a279b94f7be340c3155d4b7df30384&language=en-US&page=${rand(1, 10)}`;
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((myJson) => {
            let movies = myJson.results;
            let item = rand(0, 19);
            // document.getElementById("text").innerText = movies[item].title;
            answer.innerHTML = "";
            answerString = "";
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
            fieldFocus();
            posterReveal(movies, item);

        });
}

const skipBtn = document.getElementById("skip");
skipBtn.addEventListener("click", () => {
    document.getElementById('text').innerText = ""
    newMovie();
    scoreCurrent.innerText = 1000;
})

const submitBtn = document.getElementById("submit");
submitBtn.addEventListener("click", () => {
    const fields = document.querySelectorAll('input');
    response = "";
    fields.forEach((el, i) => {
        response += el.value;
    })
    if (response.toLowerCase() == answerString.toLowerCase()) {
        document.getElementById('text').innerText = "BRAWO!";
        ctx.drawImage(img, 0, 0);
        let total = 0;
        total = parseInt(scoreTotal.innerText) + parseInt(scoreCurrent.innerText);
        scoreTotal.innerText = total;
    } else {
        document.getElementById('text').innerText = "ŹLE"
    }
})

newMovie();