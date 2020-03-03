const fs = require('fs');

module.exports = {
  getAllMovies: function () {
    return new Promise((resolve, reject) => {
      this.readAllContentFromFile().then(data => resolve(data.movies)).catch(err => reject(err))
    })
  },
  writeAllContentToFile: function (data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(process.env.FILE_FULL_PATH, JSON.stringify(data, null, 4), (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data)
        }
      });
    })
  },
  readAllContentFromFile: function () {
    return new Promise((resolve, reject) => {
      fs.readFile(process.env.FILE_FULL_PATH, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(data))
        }
      });
    })
  },
  getAllGenres: function () {
    return new Promise((resolve, reject) => {
      this.readAllContentFromFile().then(data => {
        resolve(data.genres)
      }).catch(err => {
        reject(err)
      })
    })
  },
  setAllMovies: function (movies) {
    return new Promise((resolve, reject) => {
      this.readAllContentFromFile().then(data => {
        let fileContent = {
          ...data
        };
        fileContent.movies = movies;
        this.writeAllContentToFile(fileContent).then(data => resolve()).catch(err => reject(err))
      }).catch(err => reject(err))
    })
  },
  getIdMovie: function (movies) {
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
}