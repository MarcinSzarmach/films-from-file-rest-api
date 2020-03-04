require("dotenv").config();

const request = require("supertest");
const genres = ["Fantasy", "Comedy"]
const runtime = 100;
const {
  runtimeRange
} = require("../controllers/movies/utils");
const _ = require('lodash');

const app = require("../server");
const server = app.server;

describe("Movies Endpoints", () => {
  describe("Get Endpoints", () => {
    it("get films by runtime", async () => {
      await request(server).get(`/moviesByParams?runtime=${runtime}`)
      const req = await request(server).get(`/moviesByParams?runtime=${runtime}`).expect('Content-Type', /json/).expect(200)
      const movie = req.body;
      expect(_.inRange(parseInt(_.head(movie).runtime), runtime - runtimeRange, runtime + runtimeRange) && _.size(movie) === 1).toBeTruthy();
    });

    it("get films by runtime and genres", async () => {
      const req = await request(server).get(`/moviesByParams?genres=${genres.join(',')}&runtime=${runtime}`)
      const movies = req.body;
      movies.filter(movie => {
        expect(_.size(_.intersection(genres, movie.genres)) && _.inRange(parseInt(movie.runtime), runtime - runtimeRange, runtime + runtimeRange)).toBeTruthy();
      });
    });
  });
});