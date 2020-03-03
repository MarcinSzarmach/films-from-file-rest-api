const express = require("express");
const router = new express.Router();

const Movies = require("../controllers/movies");

router.get("/", (req, res) => res.send("ok"));

// movies routes
router.get("/movies", Movies.getAll);
router.get("/moviesByParams", Movies.getFilteredAll);
router.post("/movies", Movies.create);

module.exports = router;