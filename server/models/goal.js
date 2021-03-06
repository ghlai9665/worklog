// This file is to define the data storage model in mongodb
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create schemas (like class, blueprint for the object)
const GoalSchema = new Schema({
  goalName: String
});

// Create the model based on the schema (like object)
const Goal = mongoose.model("goal", GoalSchema);

module.exports = Goal;

/* A model is just like a JS object (schema is like a class, the blueprint for the object), so we can literally call

var myChar = new MarioChar({});

*/
