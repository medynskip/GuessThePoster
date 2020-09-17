const pw = 300;
const ph = 450;
const box = 20;
let answerString = "";
let response = "";

const answer = document.getElementById("answer");
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

const posterReveal = (movies, item) => {
    const canvas = document.getElementById('poster');
    canvas.width = pw;
    canvas.height = ph;
    const ctx = canvas.getContext('2d');
    const strDataURI = `https://image.tmdb.org/t/p/w${pw}_and_h${ph}_bestv2${movies[item].poster_path}`;

    const img = new Image;
    img.src = strDataURI;

    let draw = false;
    img.onload = function () {
        ctx.fillStyle = ctx.createPattern(img, "no-repeat");
        canvas.addEventListener("mousedown", (e) => {
            draw = true;
            ctx.beginPath();
            ctx.arc(e.offsetX, e.offsetY, box, 0, 2 * Math.PI);
            ctx.fill();
        })

        canvas.addEventListener("mousemove", (e) => {
            if (draw == true) {
                ctx.beginPath();
                ctx.arc(e.offsetX, e.offsetY, box, 0, 2 * Math.PI);
                ctx.fill();
            }
        })
        document.addEventListener("mouseup", (e) => {
            draw = false;
        })
    };
}


const newMovie = () => {
    const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=a7a279b94f7be340c3155d4b7df30384&language=en-US&page=${rand(1, 10)}`;
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

            console.log(answerString);
        });
}

const refreshBtn = document.getElementById("refresh");
refreshBtn.addEventListener("click", () => {
    newMovie();
})

const submitBtn = document.getElementById("submit");
submitBtn.addEventListener("click", () => {
    const fields = document.querySelectorAll('input');
    response = "";
    fields.forEach((el, i) => {
        response += el.value;
    })
    if (response.toLowerCase() == answerString.toLowerCase()) {
        document.getElementById('text').innerText = "BRAWO!"
    } else {
        document.getElementById('text').innerText = "ŹLE"
    }

})


newMovie();