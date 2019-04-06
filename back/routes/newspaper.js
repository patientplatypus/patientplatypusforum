require('dotenv').config()
var express = require('express');
var router = express.Router();
var model = require('../models/model');

router.get('/getHeadlines', (req, res, next)=>{
  console.log('inside /getHeadlines')
  model.Newspaper.find({}).sort({created: -1}).exec((err, posts)=>{
    if (err){
      console.log('there was an error: ', err)
      res.json({error: err})
    }
    console.log('here are the posts: ', posts)
    res.json({posts: posts})
  })
})

router.post('/addHeadline', (req, res, next)=>{
  console.log('inside /addHeadline')
  model.Newspaper.find({}).sort({created: -1}).exec((err, posts)=>{
    if (err){
      console.log('there was an error: ', err)
      res.json({error: err})
    }
    console.log('here are the posts: ', posts)
  })
})

module.exports = router;
