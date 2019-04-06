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
    console.log('posts.length: ', posts.length)
    console.log('req.body.editNum: ', req.body.editNum)
    if (posts.length>req.body.editNum){
      model.Newspaper.findOneAndUpdate({_id: posts[req.body.editNum]}, {"$set":{headline: req.body.editHeadline, url: req.body.editURL, created: Date.now()}}, (err, doc)=>{
        if (err){
          console.log('there was an error: ', err)
          res.json({error: err})
        }
        model.Newspaper.find({}).sort({created: -1}).exec((err, posts)=>{
          if (err){
            console.log('there was an error: ', err)
            res.json({error: err})
          }
          res.json({posts: posts})
        })
      })
    }else if (posts.length<=req.body.editNum){
      var post = {
        headline: req.body.editHeadline,
        url: req.body.editURL,
        created: Date.now()
      }
    
      console.log('value of post: ', post)
    
      let postInstance = new model.Newspaper(post)
      
      console.log('value of postInstance: ', postInstance)
    
      postInstance.save().then((post)=>{
        model.Newspaper.find({}).sort({created: -1}).exec((err, posts)=>{
          if (err){
            console.log('there was an error: ', err)
            res.json({error: err})
          }
          res.json({posts: posts})
        })
      });
    }
  })
})

module.exports = router;
