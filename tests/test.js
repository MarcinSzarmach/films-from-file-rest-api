require("dotenv").config();

const mongoose = require("mongoose");
const request = require("supertest");

const id = "tt7286456";
const value = "Test comment";
const app = require("../server");
const server = app.server;
