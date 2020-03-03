const Validator = require('validatorjs');

Validator.registerAsync('genres', function (genres, attribute, req, passes) {
  if (Array.isArray(genres)) {
    const utils = require('../models/movies');
    utils.getAllGenres().then(genresFromFile => {
      genres.forEach(genre => {
        if (!genresFromFile.includes(genre)) {
          passes(false, `Genre ${genre} is not in ${genresFromFile.join(',')}`);
        }
      })
      passes();
    }).catch(err => {
      passes(false, 'No genres is defined');
    })
  } else {
    passes(false, `Genres is not Array but ${typeof genres}`);
  }
});

Validator.register('number', function (num, attribute, req) {
  return Number.isInteger(num)
}, `Value :attribute is not number.`);

const validator = (body, rules, customMessages, callback) => {
  return new Promise((resolve, reject) => {
    const validation = new Validator(body, rules, customMessages);
    validation.checkAsync(() => {
      resolve();
    }, err => {
      reject(validation.errors, false)
    })
  })
};

module.exports = validator;