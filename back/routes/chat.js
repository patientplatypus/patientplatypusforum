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

//fix this to work with routed ip in production!
router.post('/getChatName', (req, res, next)=>{
  console.log('inside /getChatName')
  console.log('and value of ip: ', req.body.ip)
  var hash = sha256(req.body.ip);
  var number = "";
  for(let i=0;i<hash.length;i++) {
      number += parseInt(hash.charAt(i), 16).toString();
  }
  console.log('number = ' + number);
  console.log('number = ' + number.length);

  var numberStart = number.substring(0, number.length%2==0?number.length/2:(number.length-1)/2)
  var numberEnd = number.substring(numberStart.length, number.length)
  console.log('value of numberStart: ', numberStart, 'value of numberEnd: ', numberEnd)
  var remainder1 = numberStart % 98
  var remainder2 = numberEnd % 378
  var chatName = names.adjectives[remainder1]+names.animals[remainder2] + Date.now().toString().substring(10, 13);
  console.log('value of chatName: ', chatName)
  res.json({chatName})
})

module.exports = router;
