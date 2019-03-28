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


router.post('/confirmPass', (req, res, next)=>{
  console.log('inside /confirmPass')
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(ip)
  var ipWhitelist = ['67.198.78.26', '70.118.40.114', '70.114.195.161', '136.41.96.68', '162.229.209.252']
  if(ipWhitelist.includes(req.body.payload.ip)&&req.body.payload.pass==process.env.adminPass){
    res.json({'confirmed': true})
  }else{
    res.json({'confirmed': false})
  }
})

router.post('/submitBlogPost', (req, res, next)=>{
  console.log('inside /submitBlogPost')

  const saveBlog = () => {
    console.log('inside saveBlog')

    let blogReq = req.body.payload.blogArr;
    let indexedBlogArr = blogReq.map((item, index)=>{
      item['index'] = index
      return item
    })

    console.log('value of indexedBlogArr: ', indexedBlogArr)

    let bodyArr = indexedBlogArr.filter((item, index)=>{
      if(item.type=='body')
      return {value: item.value, index: item.index}
    })

    console.log('value of bodyArr: ', bodyArr)

    var blog = {
      title: req.body.payload.title,
      dateText: req.body.payload.dateText,
      bodyArr: bodyArr,
      created: Date.now(),
      fileArr: [],
      comments: [],
    }

    const writeSaveBlog = () => {
      let blogInstance = new model.Blog(blog)
    
      console.log('value of blogInstance: ', blogInstance)
  
      blogInstance.save().then(blog=>{
        console.log('value of blog in save: ', blog)
        res.json({submitted: 'success'})
      }).catch((e) => {
        console.log('There was an error', e.message);
        res.json({error: e.message})
      });
    }

    let files = indexedBlogArr.filter(item=>item.type=='picURL')

    console.log('value of blog: ', blog)
    console.log('value of files: ', files)

    if (files.length>0){
      const asyncFunc = async()=>{
        await logos.asyncForEach(files, async (file) => {
          axios.get(file.value, {
            responseType: 'arraybuffer'
          })
          .then(response=>{
            let writeData = new Buffer(response.data, 'binary').toString('base64')
            let fileName = file.name+Date.now();
            let dest = __dirname+'/../picFolder/blog/'+fileName
            fs.writeFile(dest, writeData, function(err, data) {
              if (err) console.log(err);
              console.log("Successfully Written to File.");
              blog.fileArr.push({fileName: fileName, index: file.index, ext: file.value.match(/\.[0-9a-z]+$/i)[0]})
              if(blog.fileArr.length==files.length){
                writeSaveBlog()
              }
            });
          })
          .catch(error=>{
            console.log('value of error: ', error)
          })
        })
      }
      asyncFunc();
    }else{
      writeSaveBlog()
    }
  }
  saveBlog()
})

router.post('/updateBlogPost', (req, res, next)=>{
  console.log('inside updateBlogPost')
  
  let findId = {_id: req.body.payload.id};

  model.Blog.findOne(findId).lean().exec((err, post)=>{
    
    if(err){
      console.log("there was an error: ", err)
      res.json({error: 'there was an error'})
    }
    console.log('value of post: ', post)
    console.log('value of payload: ', req.body.payload)

    const updateBlog = (tempPost) => {
      console.log('inside updateBlog() and value of tempPost: ', tempPost)
      model.Blog.findOneAndUpdate({_id: tempPost._id}, {"$set":{title: tempPost.title, dateText: tempPost.dateText, bodyArr: tempPost.bodyArr, fileArr: tempPost.fileArr}}, (err, doc)=>{
        if(err){
          console.log('there was an error: ', err)
        }
        console.log('inside callback for findOneAndUpdate')
        res.json({updated: "updated!"})
      })
    }

    let tempPost = JSON.parse(JSON.stringify(post));

    tempPost.fileArr = tempPost.fileArr.filter(item=>{
      return req.body.payload.fileArr.filter(fileItem => (fileItem._id == item._id && fileItem.index == item.index)).length>0
    })
    tempPost.bodyArr = tempPost.bodyArr.filter(item=>{
      return req.body.payload.bodyArr.filter(bodyItem=> (bodyItem._id == item._id && bodyItem.index == item.index)).length>0
    })  
    console.log('after calcs delete and value of tempPost: ', tempPost)

    //next add in any items that are new
    req.body.payload.fileArr.forEach((item, index)=>{
      if(!tempPost.fileArr.filter(tempItem=>(tempItem._id==item._id && tempItem.index==item.index)).length>0){
        console.log('value of tempPost.fileArr: ', tempPost.fileArr)
        console.log('value of item: ', item)
        tempPost.fileArr.push(item)
      }
    })
    req.body.payload.bodyArr.forEach((item, index)=>{
      if(!tempPost.bodyArr.filter(tempItem=>(tempItem._id==item._id && tempItem.index==item.index)).length>0){
        tempPost.bodyArr.push(item)
      }
    })
    console.log('after calcs add and value of tempPost: ', tempPost)

    //finally sort items
    tempPost.fileArr = tempPost.fileArr.map(item=>{
      if(req.body.payload.fileArr.includes(item.index)){
        item.index = req.body.payload.fileArr.filter(arrItem=>arrItem==item).index
        return item;
      }else{
        return item
      }
    })
    tempPost.bodyArr = tempPost.bodyArr.map(item=>{
      if(req.body.payload.bodyArr.includes(item.index)){
        item.index = req.body.payload.bodyArr.filter(arrItem=>arrItem==item).index
        return item;
      }else{
        return item
      } 
    })
    console.log('after calcs sort and value of tempPost: ', tempPost)

    //handle deleting files no longer used;
    let dest = __dirname+'/../picFolder/blog/'
    var deleteArr = post.fileArr.filter(item=>{
      return tempPost.fileArr.filter(itemTemp=>itemTemp.id!=item.id).length>0
    });

    console.log('value of deleteArr: ', deleteArr)
    console.log('value of post.fileArr: ', post.fileArr)
    console.log('value of tempPost.fileArr: ', tempPost.fileArr)

    const asyncFunc = async () => {
      await logos.asyncForEach(deleteArr, async (item, index) => {
        try{
          await fsPromise.unlink(dest+item.fileName)
        }
        catch(e){
          console.log('there was an error attempting to delete the file: ', e)
        }
        finally{
          console.log('inside finally')
        }
      })
      if(req.body.payload.newFileArr.length>0){
        await logos.asyncForEach(req.body.payload.newFileArr, async (item, index) => {
          console.log('inside try of asyncAdd;')
          axios.get(item.value, {
            responseType: 'arraybuffer'
          })
          .then(response=>{
            let writeData = new Buffer(response.data, 'binary').toString('base64')
            let fileName = item.name+Date.now();
            let dest = __dirname+'/../picFolder/blog/'+fileName
            fs.writeFile(dest, writeData, function(err, data) {
              if (err) console.log(err);
              console.log("Successfully Written to File.");
              let fileObj = {fileName: fileName, index: item.index, ext: item.value.match(/\.[0-9a-z]+$/i)[0]}
              console.log('value of fileObj: ', fileObj)
              tempPost.fileArr.push(fileObj)
              console.log('value of index: ', index)
              console.log('value of req.body.payload.fileArr.length: ', req.body.payload.fileArr.length)
              console.log('')
              if(index==req.body.payload.newFileArr.length-1){
                console.log('inside if statement')
                updateBlog(tempPost)
              }
            });
          })
        })
      }else{
        updateBlog(tempPost)
      }
    }
    asyncFunc()
  })
})

router.post('/banImage', (req, res, next)=>{
  console.log('inside /banImage')
  model.Post.findOneAndUpdate({_id: req.body.id}, {$set: {fileName: 'noimageavailable.jpg', imageBanned: true}}).exec((err, post)=>{
    if(err){
      console.log('there was an error: ', err)
      res.json({'banned': 'error'})
    }else{
      if(post==null){
        model.Comment.findOneAndUpdate({_id: req.body.id}, {$set: {fileName: 'noimageavailable.jpg', imageBanned: true}}).exec((err, comment)=>{
          if(err){
            console.log('there was an error: ', err)
            res.json({'banned': 'error'})
          }else{
            res.json({'banned': 'comment'})
          }
        })
      }else{
        res.json({'banned': 'post'})
      }
    }
  })
})

module.exports = router;
