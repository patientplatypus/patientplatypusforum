require('dotenv').config()
var express = require('express');
var router = express.Router();
const fs = require('fs');
const fsPromise =  require('fs').promises;
var model = require('../models/model');
const sharp = require('sharp');
var sha256 = require('js-sha256');
var names = require('../utilities/names')
var axios = require('axios');
var logos = require('../utilities/logos')
// var getDirName = require('path').dirname;

/* GET home page. */


router.get('/', function(req, res, next) {
  res.json({'hello': 'there sailor'});
});

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
