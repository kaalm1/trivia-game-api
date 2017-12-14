var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/new', function(req, res, next) {
  let data = req.body
  users.insert(data)

  // res.send('respond with a resource');
});

module.exports = router;
