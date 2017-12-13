var Config = require('../config')
const io = require('socket.io')();
const server = require('http').createServer();
var port = process.env.PORT || 3001;

var mongoose = require('mongoose');
const MONGO_URL = Config.MONGO_URL || Config.MONGO_TEMP_URL
var promise = mongoose.connect(MONGO_URL, {
  useMongoClient: true,
  /* other options */
});
var Schema = mongoose.Schema;

var gameSchema = new Schema({
  code: String,
  players: [{type: Schema.Types.ObjectId, ref: 'User'}],
  questions: [{type: Schema.Types.ObjectId, ref: 'Question'}],
  date: { type: Date, default: Date.now },
})

var Game = mongoose.model('Game', gameSchema)

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

io.on('connect', onConnect)

function onConnect(socket){
  socket.on('add user', (code)=> addUser(code, socket))
  socket.on('game start', (code) => gameStart(code, socket))
  socket.on('game end', (code)=>  gameEnd(code, socket))
}

function addUser(code, socket){
  socket.join(code)
}

function gameStart(code, socket){
  // Add all participants to the game
  // Get all questions
  // Send them to all participants with that code
  io.in(code).emit('big-announcement', 'the game will start soon')
}

function gameEnd(code, socket){
  socket.leave(code)
}
