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

router.post('/getPinData', (req, res, next)=>{
  console.log('inside /getPinData')
  model.Pin.find({}).exec((err, pins)=>{
    if(err){
      console.log('there was an error: ', err)
    }
    res.json({pins})
  })
})

router.post('/addPinData', (req, res, next)=>{
  console.log('inside addPinData')
  console.log('value of req.body.latLng: ', req.body.latLng)
  console.log("req.cookies: ", req.cookies)
  addPin = (lat, lng, type) => {
    if(type=='new'){
      let pin = {
        lat,
        lng
      }
      let pinInstance = new model.Pin(pin)
      pinInstance.save().then(pin=>{
        model.Pin.find({}).exec((err, pins)=>{
          if(err){
            console.log('there was an error: ', err)
          }
          res.json({pins})
        })
      })
    }else if(type=='prev'){
      model.Pin.findOneAndUpdate({lat, lng}, {$inc: {visits: 1}}, {new: true}, (err, pin)=>{
        if(err){
          console.log('there was an error: ', err)
        }
        model.Pin.find({}).exec((err, pins)=>{
          if(err){
            console.log('there was an error: ', err)
          }
          res.json({pins})
        })
      })
    }
  }

  if((req.cookies.lat==undefined||req.cookies.lng==undefined) && (req.body.latLng.lat!=null&&req.body.latLng.lng!=null)){
    console.log('inside if statement')
    res.cookie('lat', req.body.latLng.lat)
    res.cookie('lng', req.body.latLng.lng)
    addPin(req.body.latLng.lat, req.body.latLng.lng, 'new')
  }else if (req.cookies.lat!=undefined&&req.cookies.lng!=undefined){
    addPin(req.cookies.lat, req.cookies.lng, 'prev')
  }else{
    res.json({error: 'no lat lng'})
  }

  
})

module.exports = router;
