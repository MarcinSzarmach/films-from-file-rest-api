require("dotenv").config();

const mongoose = require("mongoose");
const request = require("supertest");

const id = "tt7286456";
const value = "Test comment";
const app = require("../server");
const server = app.server;

describe("Movies Endpoints", () => {
    // describe("Post Endpoints", () => {
    //     it("should be able to create a movie", async() => {
    //         const { film } = await createFilm();
    //         expect(film.status).toBe(200);
    //     });
    // });
  
    // describe("Get Endpoints", () => {
    //     it("should be able to get a movie", async() => {
    //         const { film } = await createFilm();
    //         const getFilms = await request(server).get(`/movies`);
    //         expect(getFilms.body).toContainEqual(film.body);
    //     });
    // });
  });