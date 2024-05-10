const mongoose = require("mongoose");

// Create quiz schema
const QuizSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  questions: {
    type: Array,
    required: true,
  },
  testDuractions: {
    type: Number,
    required: true,
  },
});

const QuizModel = mongoose.model("quizes", QuizSchema);

module.exports = QuizModel;