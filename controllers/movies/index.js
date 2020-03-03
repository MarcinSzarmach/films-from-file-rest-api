const helpers = require("./helpers");
let _ = require('lodash');

module.exports = {
  getAll: async (req, res) => {
    helpers.getAllMovies().then(data => {
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
    helpers.validateFilterMovie({
      genres: req.query.genres ? req.query.genres.split(',') : [],
      runtime: req.query.runtime
    }).then(() => {
      const params = {
        genres: req.query.genres ? req.query.genres.split(',') : [],
        runtime: req.query.runtime ? parseInt(req.query.runtime) : false
      }
      helpers.getAllMovies().then(data => {
        const genres = helpers.getGenresCombinations(params.genres);
        res.json(helpers.getFilteredMoviesSpecialAlrgorithm(data, genres, params.runtime));
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
    helpers.validateMovie(req.body).then(() => {
      helpers.addMovie(req.body).then(() => {
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