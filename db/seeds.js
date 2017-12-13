var Categories = require('./other/categories')
var Difficulties = require('./other/difficulties')
var QTypes = require('./other/types')
var Config = require('../config')

var mongoose = require('mongoose');

const MONGO_URL = Config.MONGO_URL || Config.MONGO_TEMP_URL
var promise = mongoose.connect(MONGO_URL, {
  useMongoClient: true,
  /* other options */
});
var Schema = mongoose.Schema;

var categorySchema = new Schema({
  id: Number,
  name: String
})

var qtypeSchema = new Schema({
  name: String
})

var difficultySchema = new Schema({
  name: String
})

var Category = mongoose.model('Category', categorySchema)
var QType = mongoose.model('QType', qtypeSchema)
var Difficulty = mongoose.model('Difficulty', difficultySchema)

Category.create(Categories.categories,function(err,categories){})
QType.create(QTypes.type,function(err,types){})
Difficulty.create(Difficulties.difficulty,function(err,difficulties){})
