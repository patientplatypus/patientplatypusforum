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


router.post('/getBlogPost', (req,res,next)=>{
  console.log('inside getBlogPost')
  console.log('value of req.body: ', req.body)

  var findId = null
  if (req.body.navID=='N/A'){
    findId = {}
  }else{
    findId = {_id: req.body.navID}
  }

  model.Blog.findOne(findId).exec((err, post)=>{
    if(err){
      console.log("there was an error: ", err)
      res.json({error: 'there was an error'})
    }
    if(post==null){
      res.json({post: {}})
    }else{
      let returnPost = post;
      console.log('value of post: ', post)
      if (returnPost.fileArr.length>0){
        console.log('inside second if statement')
        const asyncFunc = async () => {
          await logos.asyncForEach(returnPost.fileArr, async (item, index) => {
            let fileData;
            try{
              fileData =  await fsPromise.readFile(__dirname+'/../picFolder/blog/'+item.fileName)
            }
            catch(e){
              console.log('there was an error attempting to read the file: ', e)
              if (e.code=='ENOENT'){
                console.log('in if statement in try catch')
                fileData = await fsPromise.readFile(__dirname+'/../picFolder/utility/noimageavailable.jpg')
                fileData = await fileData.toString('base64')
              }
            }
            console.log('after try catch')
            returnPost.fileArr[index]['data'] = fileData//.toString('base64')
            if(index==post.fileArr.length-1){
              res.json({post: returnPost})
            }
          })
        }
        asyncFunc()
      }else{
        res.json({post: post})
      }
    }
  })
})

router.post('/getBlogArchive', (req, res, next)=>{
  console.log('inside /getBlogArchive')
  model.Blog.find({}).sort({created: -1}).exec((err, posts)=>{
    if(err){
      console.log("there was an error: ", err)
      res.json({error: 'there was an error'})
    }
    let returnPosts = posts.map(post=>{
      return {title: post.title, id: post._id}
    })
    console.log('value of returnPosts: ', returnPosts)
    res.json({posts: returnPosts})
  })
})

module.exports = router;
