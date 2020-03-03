# Films REST API

To run app You need Node.js.

To run localy you nedd to add file .env (in root project) with:

```
PORT=8000
FILE_PATH=/data/db.json
```
Running:

```bash
$ npm install
$ npm start
```

## ENDPOINTS MOVIES

### GET /moviesByParams?genres=<genres>&runtime=<runtime>

Returns collections of movies by query
Query:
genres(optional) => Fantasy,Comedy
runtime(optional) => 100

example: /moviesByParams?genres=Fantasy,Comedy&runtime=100

### GET /movies

Return collection of all films.

### POST /movies

Add films to file. Body as application/json:

```bash
{
	genres: 'required|array', // -> array of predefined strings (from file db.json)
  title: 'required|string|max:255',
  year: 'required|number',
  runtime: 'required|number',
  director: 'required|string|max:255',
  actors: 'optional|string',
  plot: 'optional|string',
  posterUrl: 'optional|string'
}
```

example: 
```bash
{
	"genres": ["Horror"],
	"title": "Test title",
	"year": 1958,
	"runtime": 110,
	"director": "Test Director"
}
```

## Tests

To run tests you need .env file. To start:

```bash
$ npm test
```
