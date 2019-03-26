require('dotenv').config()
var express = require('express');
var router = express.Router();
const fs = require('fs');
const fsPromise =  require('fs').promises;
var model = require('../models/model');
var sha256 = require('js-sha256');
var names = require('../utilities/names')
var axios = require('axios');
var logos = require('../utilities/logos')
// var getDirName = require('path').dirname;

/* GET home page. */


router.get('/', function(req, res, next) {
  res.json({'hello': 'there sailor'});
});

module.exports = router;
