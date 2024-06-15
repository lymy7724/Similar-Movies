const express = require("express");
const app = express();
require("dotenv").config();
const fetch = require("node-fetch");
const PORT = 3000;
app.use(express.static("views"));
app.set("view engine", "ejs");

// body parser allows us to read the body of the request (form data)
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const APIKey = process.env.API_KEY;
const posterURL = "https://image.tmdb.org/t/p/w500";

app.get("/", (req, res) => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  };

  let list = "";

  // fetches popular movies and displays it on main page
  fetch(
    `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1&api_key=${APIKey}`,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      const similarmovies = response.results;
      // create a for loop that loops 1-8 of similarmovies
      for (let i = 0; i < 8; i++) {
        const title = similarmovies[i]["title"];
        const posterpath = posterURL + similarmovies[i]["poster_path"];

        const html = `
            <div class="card">
            <img src="${posterpath}" class="poster">
            <h3>${title}</h3>
            </div>
                 `;

        list = list + html;
      }
      res.render("index", { text: list, title: "Trending Movies" });
      res.end;
    })
    .catch((err) => res.render("index", { text: "", title: "" }));
});

app.post("/", (req, res) => {
  const url = `https://api.themoviedb.org/3/search/movie?query=${req.body.movie}&language=en-US&page=1&api_key=${APIKey}`;

  let list = "";
  let movieName = "";
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  };

  // fetches the first movie that user searched for
  fetch(url, options)
    .then((response) => response.json())
    .then((response) => {
      const movies = response.results;
      if (movies.length === 0) {
        console.log("Movie Not Found");
      } else {
        // grabs the id of the movie the user searched for and compares it to similar movies
        const movieId = movies[0]["id"];
        movieName = movies[0]["title"];

        fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/similar?language=en-US&page=1&api_key=${APIKey}`,
          options
        )
          .then((response) => response.json())
          .then((response) => {
            const similarmovies = response.results;
            // create a for loop that loops 1-8 of similarmovies
            for (let i = 0; i < 8; i++) {
              if (i < similarmovies.length) {
                const title = similarmovies[i]["title"];
                const posterpath = posterURL + similarmovies[i]["poster_path"];

                let html = `
                      <div class="card">
                      <img src="${posterpath}" class="poster">
                      <h3>${title}</h3>
                      </div>
                       `;

                list = list + html;
              }
            }

            movieName = "Similar movies to " + movieName;
            res.render("index", {
              text: list,
              title: movieName,
            });
          })
          .catch((err) => res.render("index", { text: "Movie Not Found" }));
      }
    })
    .catch((err) => res.render("index", { text: "Movie Not Found" }));
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
