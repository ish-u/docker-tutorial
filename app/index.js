const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const NotesSchema = require("./models/Note");
const { response, json } = require("express");
require("dotenv").config();

// DB URI and MongoClient Options
let mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const uri = `mongodb://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PWD}@mongodb`;

// express app
const app = express();

//cors middleware
app.use(cors());

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Handlebars middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Port
const port = process.env.PORT || 5000;

// routes for the Index
app.get("/", async (req, res) => {
  // Connecting to the DB
  MongoClient.connect(uri, mongoClientOptions, (err, client) => {
    if (err) throw err;

    // setting DB to "notes"
    let db = client.db("notes");
    // setting the Collection to Notes and returning all the saved notes
    db.collection("Notes")
      .find()
      .toArray((err, result) => {
        if (err) throw err;
        const notes = result;
        client.close();
        res.render("index", { notes: notes });
      });
  });
});

app.post("/", async (req, res) => {
  try {
    // getting the note submitted by the user
    const note = req.body.note;

    // creating a new Note Document
    const newNote = NotesSchema({
      note: note,
    });

    // saving the Note Document in the Notes Collection
    MongoClient.connect(uri, mongoClientOptions, (err, client) => {
      if (err) throw err;
      let db = client.db("notes");
      db.collection("Notes").insertOne(newNote, (err) => {
        if (err) throw err;
        client.close();
        res.redirect("/");
      });
    });
    // await newNote.save();
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => console.log(`SERVER RUNNING ON PORT ${port}`));
