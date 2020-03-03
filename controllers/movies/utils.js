const validator = require("../../helpers/validate");
const _ = require('lodash');
const modelFilms = require('../../models/movies');
require('lodash.combinations');

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
    return _.flatMap(genres, (value, index, array) => _.combinations(array, index + 1));
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
    return _.find(genres, genre =>
      _.isEqual(_.intersection(genre, movie.genres), genre)
    )
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