function getMovieData() {
  const APIKey = "1b66c7913a4b8a373f3a18ed478f32fa";
  const posterURL = "https://image.tmdb.org/t/p/w500/";

  const input = document.getElementById("user").value;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  };

  fetch(
    `https://api.themoviedb.org/3/search/movie?query=${input}&api_key=${APIKey}`,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      const movies = response.results;
      if (movies.length === 0) {
        console.log("Movie not found!");
      } else {
        const movieId = movies[0]["id"];
        fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/similar?language=en-US&page=1&api_key=${APIKey}`,
          options
        )
          .then((response) => response.json())
          .then((response) => {
            const similarmovies = response.results;
            // create a for loop that loops 1-8 of similarmovies
            for (let i = 0; i < 8; i++) {
              const title = similarmovies[i]["title"];
              const posterpath = similarmovies[i]["poster_path"];
              // make a div - add inner html (card i designed)
              // add card to bigger div container
            }
          })
          .catch((err) => console.error(err));
      }
    })
    .catch((err) => console.error(err));
}
