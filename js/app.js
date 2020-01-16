fetch('https://api.themoviedb.org/3/movie/top_rated?api_key=a7a279b94f7be340c3155d4b7df30384&language=en-US&page=2')
    .then((response) => {
        return response.json();
    })
    .then((myJson) => {
        console.log(myJson);
    });
