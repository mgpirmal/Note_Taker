// DEPENDENCIES
// Series of npm packages that we will use to give our server useful functionality
const express = require("express");
const fs = require("fs");
const notes = require("./db/db.json");
const path = require("path");
const uuid = require("uuid");

// EXPRESS CONFIGURATION
// This sets up the basic properties for our express server

// Tells node that we are creating an "express" server
const app = express();

// Sets an initial port. We"ll use this later in our listener
const PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// needed so files will be read properly. CSS files were not being found without it.
app.use(express.static("public"));

// ROUTER
// The below points our server to a series of "route" files.
// These routes give our server a "map" of how to respond when users visit or request data from various URLs.

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});
//call for notes.html
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

  app.get("/api/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/db/db.json"))
  });


  app.post("/api/notes", (req, res) => {
    const notes = JSON.parse(fs.readFileSync("./db/db.json"));
    const newNotes = req.body;
    newNotes.id = uuid.v4();
    notes.push(newNotes);
    fs.writeFileSync("./db/db.json", JSON.stringify(notes))
    res.json(notes);
  });

  app.delete("/api/notes/:id", (req, res) => {
    const notes = JSON.parse(fs.readFileSync("./db/db.json"));
    const delNote = notes.filter((rmvNote) => rmvNote.id !== req.params.id);
    fs.writeFileSync("./db/db.json", JSON.stringify(delNote));
    res.json(delNote);
  })


  // LISTENER
  // The below code effectively "starts" our server

  app.listen(PORT, () => {
    console.log(`App listening on PORT: ${PORT}`);
  });
