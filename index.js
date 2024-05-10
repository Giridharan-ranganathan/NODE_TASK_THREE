const express = require("express");
const parser = require("body-parser");
const HTTP_SERVER = express();

//IMPORT MODEL
const QuizModel = require("./model/quizemodel.js")

//CONNECTION OF DB
require("./DataBase/db.js")

HTTP_SERVER.use(parser.json());


//CONNECTING .ENV 
require("dotenv").config();
// const PORT = process.env.PORT;
// const HOSTNAME = process.env.HOSTNAME;
const PORT = 5000;
const HOSTNAME = "localhost"



//SERVER SRARTING
HTTP_SERVER.listen( PORT , HOSTNAME , () => {
    console.log(`sever started at http://${HOSTNAME}:${PORT}`);
})

//GETING DATA FROM DB
HTTP_SERVER.get("/quizzes", (req, res, next) => {
    QuizModel.find()
      .then((response) => {
        res.status(200).json({
          message: "Quiz fetched successfully",
          length: response.length,
          page: 1,
          data: response,
        });
      })
      .catch((error) => console.log(error));
  });


  HTTP_SERVER.post("/create/quiz", (req, res, next) => {
  const Quiz = new QuizModel(req.body);
  Quiz.save()
    .then((response) => {
      if (response._id) {
        return res.status(201).json({
          message: "Quiz created successfully",
          data: response,
        });
      } else {
        return res.status(500).json({
          message: "Quiz creation failed",
          data: response,
        });
      }
    })
    .catch((error) => {
      if (error) {
        return res
          .status(400)
          .json({ error: error.message, message: "Something went wrong" });
      }
    });
});


HTTP_SERVER.get("/quizzes/:quizId", (req, res, next) => {
    const { quizId } = req.params;
    QuizModel.findOne({ _id: quizId })
      .then((response) => {
        res.status(200).json({
          message: "Quiz fetched successfully",
          data: response,
        });
      })
      .catch((error) => {
        return res.status(500).json({
          error: error.message,
          message: "Something went wrong",
        });
      });
  });