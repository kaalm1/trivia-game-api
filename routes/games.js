var Config = require('../config')
var express = require('express');
var router = express.Router();


var mongoose = require('mongoose');
const MONGO_URL = Config.MONGO_URL || Config.MONGO_TEMP_URL
var promise = mongoose.connect(MONGO_URL, {
  useMongoClient: true,
  /* other options */
});
var Schema = mongoose.Schema;
const https = require('https');
var request = require('request');

var userSchema = new Schema({
  email: String,
  fbId: String,
  googleId: String,
  date: { type: Date, default: Date.now },
})

var gameSchema = new Schema({
  code: String,
  players: [{type: Schema.Types.ObjectId, ref: 'User'}],
  questions: [{type: Schema.Types.ObjectId, ref: 'Question'}],
  date: { type: Date, default: Date.now },
})

var questionSchema = new Schema({
  question:  String,
  category: {type: Schema.Types.ObjectId, ref: 'Category'},
  type:   {type: Schema.Types.ObjectId, ref: 'Type'},
  difficulty: {type: Schema.Types.ObjectId, ref: 'Difficulty'},
  correct_answer: String,
  incorrect_answers: Array,
  date: { type: Date, default: Date.now },
});

var answerSchema = new Schema({
  player: {type: Schema.Types.ObjectId, ref: 'User'},
  question: {type: Schema.Types.ObjectId, ref: 'Question'},
  game: {type: Schema.Types.ObjectId, ref: 'Game'},
  answer: String
})

var categorySchema = new Schema({
  name: String
})

var qtypeSchema = new Schema({
  name: String
})

var difficultySchema = new Schema({
  name: String
})


var Question = mongoose.model('Question', questionSchema)
var Category = mongoose.model('Category', categorySchema)
var QType = mongoose.model('QType', qtypeSchema)
var Difficulty = mongoose.model('Difficulty', difficultySchema)



/* GET games listing. */
// Use mongoose.populate in order to reference the other models

// {
//   "category": "Entertainment: Books",
//   "type": "multiple",
//   "difficulty": "medium",
//   "question": "What position does Harry Potter play in Quidditch?",
//   "correct_answer": "Seeker",
//   "incorrect_answers": [
//     "Beater",
//     "Chaser",
//     "Keeper"
//   ]
// },

router.post('new', function(req, res, next){
  let data = req.body
  Game.create(function(err,game){})
})

router.post('/new', function(req, res, next) {
  let data = req.body
  Question.create({question: data.question, correct_answer: data.correct_answer, incorrect_answers: data.incorrect_answers}, function(err, question){
    Category.findOne({name: data.category},function(err, category){
      question.category = category._id
    })
    QType.findOne({name: data.type},function(err, qtype){
      question.type = qtype._id
    })
    Difficulty.findOne({name: data.difficulty},function(err, difficulty){
      question.difficulty = difficulty._id
    })
    question.save(function(err){})
  })
  res.send('New Question');
});

router.get('/giphy/:words', function(req, res, next) {
  let words = req.params.words
  let key = process.env.GIPHY_KEY
  let url = `https://api.giphy.com/v1/gifs/random?api_key=${key}&tag=${words}&rating=G`
  request(url,(error,response,body)=>{res.send(JSON.parse(body))})
});

module.exports = router;
