const fs = require('fs');
const validator = require("../../helpers/validate");
require('lodash.combinations');
let _ = require('lodash');

const runtimeRange = 10;

const filterRequirements = {
  genres: 'genres',
  runtime: 'numeric'
}

const movieRequirements = {
  genres: 'required|genres',
  title: 'required|string|max:255',
  year: 'required|number',
  runtime: 'required|number',
  director: 'required|string|max:255',
  actors: 'optional|string',
  plot: 'optional|string',
  posterUrl: 'optional|string'
}

module.exports = {
  getGenresCombinations: function (genres) {
    return _.flatMap(genres, (v, i, a) => _.combinations(a, i + 1));
  },
  getFilteredMoviesSpecialAlrgorithm: function (movies, genres, runtime) {
    const isGenres = genres.length > 0;
    const isRuntime = !!runtime;
    if (!isRuntime && !isGenres) {
      return [_.sample(movies)]
    }
    const filteredMovies = movies.filter(movie => {
      if (isRuntime && isGenres) {
        return this.filterByDurationAndGenres(movie, runtime, genres)
      } else if (isGenres) {
        return this.filterByGenres(movie, genres)
      } else if (isRuntime) {
        return this.filterByDuration(movie, runtime)
      }
    });
    if (isRuntime && !isGenres) {
      return [_.sample(filteredMovies)]
    }
    return filteredMovies
  },
  filterByDurationAndGenres: function (movie, runtime, genres) {
    return this.filterByGenres(movie, genres) && this.filterByDuration(movie, runtime)
  },
  filterByDuration: (movie, runtime) => {
    return _.inRange(parseInt(movie.runtime), runtime - runtimeRange, runtime + runtimeRange)
  },
  filterByGenres: (movie, genres) => {
    return _.find(genres, genre => {
      return _.isEqual(_.intersection(genre, movie.genres), genre)
    })
  },
  getAllMovies: () => {
    return new Promise((resolve, reject) => {
      fs.readFile(process.env.FILE_FULL_PATH, (err, data) => {
        if (err) {
          reject(err);
        } else {
          let movies = []
          try {
            movies = JSON.parse(data).movies
          } catch (error) {
            reject(error);
          }
          resolve(movies)
        }
      });
    })
  },
  getAllGenres: () => {
    return new Promise((resolve, reject) => {
      fs.readFile(process.env.FILE_FULL_PATH, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(data).genres)
        }
      });
    })
  },
  setAllMovies: (movies) => {
    return new Promise((resolve, reject) => {
      fs.readFile(process.env.FILE_FULL_PATH, (err, data) => {
        if (err) {
          reject(err);
        } else {
          let fileContent = JSON.parse(data)
          fileContent.movies = movies;
          fs.writeFile(process.env.FILE_FULL_PATH, JSON.stringify(fileContent, null, 4), (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(fileContent.movies)
            }
          });
        }
      });
    })
  },
  getIdMovie: movies => {
    const arr = [...movies].sort((a, b) => {
      return b.id - a.id
    })
    return arr[0].id + 1
  },
  addMovie: async function (movie) {
    let movies = await this.getAllMovies();
    const id = movies.slice(-1)[0] ? this.getIdMovie(movies) : 1;
    movies.push({
      id,
      ...movie
    })
    return this.setAllMovies(movies);
  },
  validateFilterMovie(filter) {
    return new Promise((resolve, reject) => {
      validator(filter, filterRequirements, {}).then(() => {
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  },
  validateMovie(movie) {
    return new Promise((resolve, reject) => {
      validator(movie, movieRequirements, {}).then(() => {
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  }
}