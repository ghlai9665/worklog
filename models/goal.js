// This file is to define the data storage model in mongodb
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LogSchema = new Schema({
  logName: String,
  date: String
});

// Create schemas (like class, blueprint for the object)
const GoalSchema = new Schema({
  goalName: String,
  logs: [LogSchema] //an array of Book type
});

// Create the model based on the schema (like object)
const Goal = mongoose.model("goal", GoalSchema);

module.exports = Goal;

/* A model is just like a JS object (schema is like a class, the blueprint for the object), so we can literally call

var myChar = new MarioChar({});

*/
