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
const nodemailer = require("nodemailer");
// var getDirName = require('path').dirname;

/* GET home page. */


router.get('/', function(req, res, next) {
  res.json({'hello': 'there sailor'});
});

router.post('/contact', (req, res, next) => {
  console.log('inside /contact')



  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: 'pweyand@gmail.com',
           pass: 'Fvnjtyb123'
       }
   });
   const mailOptions = {
    from: 'someschmuck@patientplatypus.com', // sender address
    to: 'pweyand@gmail.com', // list of receivers
    subject: 'Contact from patientplatypus.com', // Subject line
    html: `<p>`+req.body.emailText+`</p>`// plain text body
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if(err){
      console.log(err)
      res.json({status: 'error'})
    }else{
      console.log(info);
      res.json({status: 'success'})
    }
  });
  
})

module.exports = router;
