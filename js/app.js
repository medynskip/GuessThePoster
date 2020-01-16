const pw = 300;
const ph = 450;
const box = 10;

const allowed = `ABCDEFGHIJKLMNOPQRSTUWVXYZabcdefghijklmnopqrstuwvxyz0123456789`;
const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=a7a279b94f7be340c3155d4b7df30384&language=en-US&page=${rand(1, 10)}`

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

fetch(url)
    .then((response) => {
        return response.json();
    })
    .then((myJson) => {
        let movies = myJson.results;
        let item = rand(0, 19);
        document.getElementById("text").innerText = movies[item].title;

        for (let i = 0; i < movies[item].title.length; i++) {
            if (movies[item].title[i] == " ") {
                document.getElementById("answer").innerHTML += `<span> </span>`;
            } else if (allowed.indexOf(movies[item].title[i]) == -1) {
                document.getElementById("answer").innerHTML += `<span> ${movies[item].title[i]} </span>`
            } else {
                document.getElementById("answer").innerHTML += `<input type="text" name="${i}" required minlength="1" maxlength="1" size="1">`;
            }
        }
        console.log(movies[item]);

        const canvas = document.getElementById('poster');
        canvas.width = pw;
        canvas.height = ph;
        const ctx = canvas.getContext('2d');

        for (let i = 0; i < (ph / box); i++) {
            for (let j = 0; j < (pw / box); j++) {
                console.log(i, j);

            }

        }

        function drawPoster() {
            const strDataURI = `https://image.tmdb.org/t/p/w${pw}_and_h${ph}_bestv2${movies[item].poster_path}`
            var img = new Image;
            img.onload = function () {
                ctx.drawImage(img, 0, 0); // Or at whatever offset you like
            };
            img.src = strDataURI;
        }
        // image.addEventListener('load', e => {
        //     ctx.drawImage(image, 33, 71, 104, 124, 21, 20, 87, 104);
        // });


    });


