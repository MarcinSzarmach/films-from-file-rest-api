const utils = require("./utils");
const modelFilms = require("../../models/movies/index");
let _ = require('lodash');

module.exports = {
  getAll: async (req, res) => {
    modelFilms.getAllMovies().then(data => {
      res.json(data);
    }).catch(err => {
      res.status(500)
        .send({
          success: false,
          message: 'Validation failed',
          data: err
        });
    })
  },
  getFilteredAll: async (req, res) => {
    utils.validateFilterMovie({
      genres: req.query.genres ? req.query.genres.split(',') : [],
      runtime: req.query.runtime
    }).then(() => {
      const params = {
        genres: req.query.genres ? req.query.genres.split(',') : [],
        runtime: req.query.runtime ? parseInt(req.query.runtime) : false
      }
      modelFilms.getAllMovies().then(data => {
        const genres = utils.getGenresCombinations(params.genres);
        res.json(utils.getFilteredMoviesSpecialAlrgorithm(data, genres, params.runtime));
      }).catch(err => {
        res.status(500)
          .send({
            success: false,
            data: err
          });
      })
    }).catch(err => {
      res.status(412)
        .send({
          success: false,
          message: 'Validation failed',
          data: err
        });
    })

  },
  create: async (req, res) => {
    utils.validateMovie(req.body).then(() => {
      modelFilms.addMovie(req.body).then(() => {
        res
          .send({
            success: true
          });
      }).catch((err) => {
        res.status(500)
          .send({
            success: false,
            data: err
          });
      });
    }).catch(err => {
      res.status(412)
        .send({
          success: false,
          message: 'Validation failed',
          data: err
        });
    })
  },
}