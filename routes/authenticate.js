var express = require('express');
var router = express.Router();

var authenticateController = require('../controllers/authenticate/authenticate'); 
// Login
router.post('/signin', authenticateController.signIn);
// Registration
router.post('/signup', authenticateController.signUp);


module.exports = router;
