require("dotenv").config();
const express = require("express");
const cors = require("cors");
let morgan = require("morgan");
// let persons = require("./data");
const Person = require("./models/persons.js");

const app = express();
app.use(express.json());
app.use(cors());

morgan.token("resBody", (req, res) =>
  Object.values(req.body).length !== 0 ? JSON.stringify(req.body) : ""
);
const morganFunc = morgan(
  ":method :url :status :res[content-length] - :response-time ms :resBody"
);

app.use(express.static("dist"));

app.use(morganFunc);

app.get("/api/persons", (req, res, next) => {
  Person.find({}).then((result) => res.json(result));
  // res.json(persons);
});

app.get("/info", (req, res, next) => {
  Person.find({}).then((result) => {
    res.send(`Phonebook has info for ${result.length} people \n ${new Date()}
      `);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((getPerson) => {
      if (!getPerson) {
        res.status(404).send({ error: "Person not found" });
      } else {
        res.json(getPerson);
      }
    })
    .catch((err) => next(err));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => response.status(204).end())
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (request, response, next) => {
  const { body } = request;
  const { id } = request.params;
  const person = {
    name: body.name,
    number: body.number,
  };

  // new:true is for return a new updatePerson
  const opts = { new: true, runValidators: true, context: "query" };

  Person.findByIdAndUpdate(id, person, opts)
    .then((updatePerson) => {
      if (!updatePerson) {
        return response.status(404).send({ error: "Person not found" });
        // next();
      } else {
        return response.json(updatePerson);
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const { body } = req;
  if (!body.name)
    res.status(400).json({
      error: "name is missing",
    });

  if (!body.number)
    res.status(400).json({
      error: "number is missing",
    });

  const person = new Person(body);
  person
    .save()
    .then((result) => res.json(result))
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.log(error.message);
  if (error.name === "CastError")
    return response.status(400).send({ error: "malformatted id" });
  if (error.name === "ValidationError")
    return response.status(400).json({ error: error.message });

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log("Listening on ", `http://localhost:${PORT}`)
);
