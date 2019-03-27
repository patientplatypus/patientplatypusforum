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
var ObjectId = require('mongoose').Types.ObjectId; 

router.get('/getNumPages/:boardType', (req, res, next)=>{
  console.log('inside /getNumPages')
  model.Post.find({board: req.params.boardType}).sort({created: -1}).exec((err, posts)=>{
    if(err){
      console.log("there was an error: ", err)
    }
    var numPages = -1;
    if(posts.length==0){
      numPages = 1
    }else{
      numPages = Math.ceil(posts.length/15)
    }
    res.json({numPages: numPages});
  })
})

router.post('/uploadPost', (req, res, next)=>{
  console.log('inside /uploadPost')
  console.log('value of req.files: ', req.files)
  console.log('value of req.body: ', req.body)


  const savePost = (fileName) => {

    console.log('inside savePost')

    var post = {
      body: req.body.post, 
      created: Date.now(),
      flags: 0, 
      lastFlag: Date.now(),
      comments: [],
      fileName: fileName, 
      board: req.body.boardType
    }
  
    console.log('value of post: ', post)
  
    let postInstance = new model.Post(post)
    
    console.log('value of postInstance: ', postInstance)
  
    postInstance.save().then(post=>{
      console.log('value of post in save: ', post)
      model.Post.find({}).sort({created: -1}).skip(300).exec((err, posts)=>{
        if(err){
          console.log('value of err: ', err)
        }
        let postIDs = [] 
        postIDs = posts.map(post=>post._id)
        model.Post.deleteMany({_id: {$in: postIDs}}, (err, posts)=>{
          if (err){
            console.log('there was an error in find: ', err)
          }
          res.json({post: 'saved!'})
        })    
      })
    }).catch( (e) => {
      console.log('There was an error', e.message);
    });
  }

  if(req.files!=null){
    logos.writePic(req.files.pic.name, req.files.pic.data, (fileName)=>savePost(fileName))
  }else{
    savePost()
  }
})

router.post('/uploadComment', (req, res, next)=>{
  console.log('inside /uploadComment')
  console.log('value of req.body: ', req.body)

  const uploadComment = (fileName) => {

    console.log('inside uploadComment')

    var comment = {
      body: req.body.comment, 
      created: Date.now(),
      flags: 0, 
      lastFlag: Date.now(),
      fileName: fileName,
    }

    let commentInstance = new model.Comment(comment)
  
    commentInstance.save().then(comment=>{
      model.Post.findOne({_id: req.body.postID}).populate('comments').exec((err, post)=>{
        if(err){
          console.log('there was an error in retrieving post: ', err)
        }
        console.log('value of post: ', post)
        if(post==null){
          res.json({'success': 'success'})
        }else{
          if (post.comments.length>250){
            console.log('inside delete if statement')
            console.log('value of post; ', post)
            console.log('value of comments: ', post.comments)
            const asyncFunc = async () => {
              if (post.fileName!=''){
                try{
                  let dest = __dirname+'/../picFolder/sharp/'+post.fileName
                  await fsPromise.unlink(dest)
                  dest = __dirname+'/../picFolder/'+post.fileName
                  await fsPromise.unlink(dest)
                }
                catch(e){
                  console.log('there was an error deleting file: ', e)
                }
              }
              await logos.asyncForEach(post.comments, async (item, index) => {
                try{
                  let dest = __dirname+'/../picFolder/sharp/'+item.fileName
                  await fsPromise.unlink(dest)
                  dest = __dirname+'/../picFolder/'+item.fileName
                  await fsPromise.unlink(dest)
                }
                catch(e){
                  console.log('there was an error attempting to delete the file: ', e)
                }
              })
            }
            asyncFunc()
            model.Post.deleteOne({_id: req.body.postID}).exec((err)=>{
              if(err){
                console.log('there was an error deleting: ', err)
              }
              console.log('inside deleteOne')
              res.json({'success': 'success'})
            })
          }else if(post.comments.length>200){
            model.Post.findOneAndUpdate({_id:req.body.postID}, { $push: { comments: comment._id }}, {new: true}, (err, post)=>{
              if(err){
                console.log('there was an error: ', err)
              }
              console.log('value of post after updating: ', post)     
              res.json({'success': 'success'})   
            })
          }else{
            model.Post.findOneAndUpdate({_id:req.body.postID}, { $push: { comments: comment._id }, $set: {created: Date.now()}}, {new: true}, (err, post)=>{
              if(err){
                console.log('there was an error: ', err)
              }
              console.log('value of post after updating: ', post)     
              res.json({'success': 'success'})   
            })
          }
        }
      })
    }).catch((e) => {
      console.log('there was an error: ', e)
    });
  }

  console.log('value of req.files: ', req.files)

  if(req.files!=null){
    logos.writePic(req.files.pic.name, req.files.pic.data, (fileName)=>uploadComment(fileName))
  }else{
    uploadComment()
  }


})

router.post('/flipPic', (req, res, next)=>{
  console.log('inside /flipPic')
  console.log('value of req.body: ', req.body)
  let dest = __dirname+'/../picFolder/'
  var picVal = req.body.picVal
  if(req.body.picVal.fileType=='actual'){
    console.log('inside if statement 1')
    dest = dest + 'sharp/'
    picVal.fileType = 'preview'
  }else if (req.body.picVal.fileType=='preview'){
    console.log('inside if statement 2')
    picVal.fileType = 'actual'
    //no extension main folder
  }
  console.log('value of dest: ', dest)
  console.log('value of dest+req.body.picVal.fileName: ', dest+req.body.picVal.fileName)
  const asyncFunc = async () => {
    var fileData =  await fsPromise.readFile(dest+req.body.picVal.fileName)
    picVal.data = fileData.toString('base64')
    console.log('value of picVal: ', picVal)
    res.json({picVal: picVal})
  }
  asyncFunc()
})

router.post('/getNavPage', (req, res, next)=>{
  console.log('inside /getNavPage')
  console.log('value of req.body.navPage: ', req.body.navPage)

  model.Post.find({board: req.body.boardType}).sort({created: -1}).skip(15*req.body.navPage).limit(15).populate('comments').exec((err, posts)=>{
    if(err){
      console.log('there was an err: ', err)
    }

    let dest = __dirname+'/../picFolder/sharp/'

    var tempPosts = posts;
    var dataArr = [];

    const asyncFunc = async () => {
      await logos.asyncForEach(tempPosts, async (tempPost) => {
        if (tempPost.fileName!=''){
          var fileData =  await fsPromise.readFile(__dirname+'/../picFolder/sharp/'+tempPost.fileName)
          dataArr.push({post: tempPost._id, data: fileData.toString('base64'), extension: tempPost.fileName.match(/\.[0-9a-z]+$/i)[0], fileType: 'preview', fileName: tempPost.fileName})
        }
        if(tempPost.comments.length >= 3){
          var lastThreeComments = tempPost.comments.slice(Math.max(tempPost.comments.length - 3, 1))
        }else{
          var lastThreeComments = tempPost.comments
        }
        await logos.asyncForEach(lastThreeComments, async (comment) => {
          if (comment.fileName!=''){
            var fileData =  await fsPromise.readFile(__dirname+'/../picFolder/sharp/'+comment.fileName)
            dataArr.push({post: comment._id, data: fileData.toString('base64'), extension: comment.fileName.match(/\.[0-9a-z]+$/i)[0], fileType: 'preview', fileName: tempPost.fileName})
          }
        })
      })

      console.log('before send and value of tempPosts: ', tempPosts)
      console.log("before send and value of dataArr: ", dataArr)
      res.json({posts: tempPosts, dataArr: dataArr})
    }
    asyncFunc()
  })
})

router.post('/getPost', (req, res, next)=>{
  console.log('inside /getPost')

  model.Post.findOne({_id: req.body.postID}).populate('comments').exec((err, post)=>{

    commentArr = [];
    var fileObj = null;
    const asyncFunc = async () => {
      if(post.fileName!=''){
        var fileData =  await fsPromise.readFile(__dirname+'/../picFolder/sharp/'+post.fileName)
        fileObj = {post: post._id, data: fileData.toString('base64'), extension: post.fileName.match(/\.[0-9a-z]+$/i)[0], fileType:'preview', fileName: post.fileName}
      }
      if(post.comments.length>0){
        console.log('inside second if statement and post.comments; ', post.comments)
        await logos.asyncForEach(post.comments, async (comment) => {
          console.log('inside asyncForEach')
          if (comment.fileName!=''){
            var commentData =  await fsPromise.readFile(__dirname+'/../picFolder/sharp/'+comment.fileName)
            commentArr.push({post: comment._id, data: commentData.toString('base64'), extension: comment.fileName.match(/\.[0-9a-z]+$/i)[0], fileType: 'preview', fileName: comment.fileName})
          }
        })
      }
      console.log('inside model.Post.findOne and value of res: ', {post: post, postObj: fileObj, commentArr: commentArr})
      res.json({post: post, postObj: fileObj, commentArr: commentArr})
    }
    asyncFunc()
  })
})

router.post('/flagPost', (req, res, next)=>{
  console.log('inside /flagPost')
  model.Post.findOne({_id: req.body.id}).exec((err, post)=>{
    if(err){
      console.log('there was an error : ', error)
    }else{
      if(post==null){
        res.json({status: 'deleted'})
      }else{
        let timeDif = new Date().getTime()-new Date(post.lastFlag).getTime();
        if(timeDif>300000){
          if(post.flags>=10 && post.imageBanned!=true){
            let oldFileName = post.fileName;
            model.Post.findOneAndUpdate({_id:req.body.id}, {$set: {fileName: 'noimageavailable.jpg', imageBanned: true}}).exec((err, post)=>{
              if(err){
                console.log('there was an error: ', error)
              }
              const asyncFunc = async () => {
                try{
                  let dest = __dirname+'/../picFolder/sharp/'+oldFileName
                  await fsPromise.unlink(dest)
                  dest = __dirname+'/../picFolder/'+oldFileName
                  await fsPromise.unlink(dest)
                }
                catch(e){
                  console.log('there was an error deleting file: ', e)
                }
              }
              asyncFunc()
              res.json({status: 'deleted'})
            })
          }else{
            model.Post.findOneAndUpdate({_id: req.body.id}, {$inc: {flags: 1}, $set:{lastFlag: Date.now()}}, {new: true}, (err, post)=>{
              if(err){
                console.log('there was an error : ', error)
              }else{
                res.json({status: "success"})
              }
            })
          }
        }else{
          res.json({status: 'wait'})
        }
      }
    }
  })
})

router.post('/flagComment', (req, res, next)=>{
  console.log('inside /flagComment')
  console.log('value of req.body: ', req.body)
  console.log('value of objid req id : ',  ObjectId(req.body.id))
  // model.Post.findOne({"comment._id": ObjectId(req.body.id)}).exec((err, doc)=>{
  //   if(err){
  //     console.log('there was an error: ', err)
  //   }
  //   console.log('the value of the found doc: ', doc)
  //   res.json({dummy: 'dummy'})
  // })

  model.Post.findOne({_id:req.body.secondID})
  .populate({
    path  : 'comments',
    match : { _id : ObjectId(req.body.id) }
  })
  .exec((err, doc)=>{
    if(err){
      console.log('there was an error: ', err)
    }
    console.log('the value of the found doc: ', doc.comments[0])
    let comment = doc.comments[0]
    let timeDif = new Date().getTime()-new Date(comment.lastFlag).getTime();
    if(timeDif>300000){
      if(comment.flags>=10 && comment.imageBanned!=true){
        let oldFileName = comment.fileName;
        model.Comment.findOneAndUpdate({_id:req.body.id}, {$set: {fileName: 'noimageavailable.jpg', imageBanned: true}}).exec((err, comment)=>{
          if(err){
            console.log('there was an error: ', error)
          }
          const asyncFunc = async () => {
            try{
              let dest = __dirname+'/../picFolder/sharp/'+oldFileName
              await fsPromise.unlink(dest)
              dest = __dirname+'/../picFolder/'+oldFileName
              await fsPromise.unlink(dest)
            }
            catch(e){
              console.log('there was an error deleting file: ', e)
            }
          }
          asyncFunc()
          res.json({status: 'deleted'})
        })
      }else{
        model.Comment.findOneAndUpdate({_id: req.body.id}, {$inc: {flags: 1}, $set:{lastFlag: Date.now()}}, {new: true}, (err, post)=>{
          if(err){
            console.log('there was an error : ', error)
          }else{
            res.json({status: "success"})
          }
        })
      }
    }else{
      res.json({status: 'wait'})
    }
  });


})

module.exports = router;
