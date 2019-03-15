var express = require('express');
var router = express.Router();
const fs = require('fs');
const fsPromise =  require('fs').promises;
var model = require('../models/model');
const sharp = require('sharp');
// var getDirName = require('path').dirname;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

https://stackoverflow.com/questions/10049557/reading-all-files-in-a-directory-store-them-in-objects-and-send-the-object
// function readFiles(dirname, onFileContent, onDoneRead, onError) {
//   fs.readdir(dirname, function(err, filenames) {
//     if (err) {
//       onError(err);
//       return;
//     }
//     filenames.forEach(function(filename) {
//       fs.readFile(dirname + filename, 'utf-8', function(err, content) {
//         if (err) {
//           onError(err);
//           return;
//         }
//         onFileContent(filename, content);
//       });
//     });
//     onDoneRead();
//   });
// }



router.get('/getFirstPage', (req, res, next)=>{
  console.log('inside /getFirstPage')

  // https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
  async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  model.Post.find({}).sort({created: -1}).limit(15).exec((err, posts)=>{
    if(err){
      console.log('there was an err: ', err)
    }

    console.log("***before readFiles***")
    let dest = __dirname+'/../picFolder/sharp/'

    var tempPosts = posts;
    var dataArr = [];

    console.log('value of tempPosts: ', tempPosts)

    const asyncFunc = async () => {
      await asyncForEach(tempPosts, async (tempPost) => {
        console.log('inside asyncForEach')
        if (tempPost.fileName!=''){
          console.log('inside fileName!= if statement')
          console.log('tempPosts[tempPosts.indexOf(tempPost)]: ', tempPosts[tempPosts.indexOf(tempPost)])
          var fileData =  await fsPromise.readFile(__dirname+'/../picFolder/sharp/'+tempPost.fileName)
          console.log('value of fileData: ', fileData);
          // tempPost.data = fileData;
          dataArr.push({post: tempPost._id, data: fileData.toString('base64'), extension: tempPost.fileName.match(/\.[0-9a-z]+$/i)[0]})
          console.log('after assignment and value of tempPosts in asyncForEach: ', tempPosts)
        }
      })
      console.log('before send and value of tempPosts: ', tempPosts)
      console.log("before send and value of dataArr: ", dataArr)
      res.json({posts: tempPosts, dataArr: dataArr})
    }
    asyncFunc()
  })
})

router.get('/getNumPages', (req, res, next)=>{
  console.log('inside /getNumPages')
  model.Post.find({}).sort({created: -1}).exec((err, posts)=>{
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

  var fileName = ''


  const savePost = () => {

    console.log('inside savePost')

    var post = {
      body: req.body.post, 
      created: Date.now(),
      flags: 0, 
      comments: [],
      fileName: fileName
    }
  
    console.log('value of post: ', post)
  
    let postInstance = new model.Post(post)
    
    console.log('value of postInstance: ', postInstance)
  
    postInstance.save().then(post=>{
      console.log('value of post in save: ', post)
      res.json({post: 'saved!'})
    }).catch( (e) => {
      console.log('There was an error', e.message);
    });
  }

  if(req.files!=null){
    let tempFileName = Date.now().toString() + '&&' + req.files.pic.name
    console.log('value of tempFileName: ', tempFileName)
    console.log('inside req.Files != null')
    let dest = __dirname+'/../picFolder/sharp/'+tempFileName
    console.log('value of dest: ', dest)
    console.log('value of data:  ', req.files.pic.data)
    sharp(req.files.pic.data)
    .resize(200, 300, {
      fit: 'inside',
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    })
    .toFile(dest)
    .then(() => {
      console.log('inside .then for sharp')
      let dest = __dirname+'/../picFolder/'+tempFileName
      console.log('value of dest: ', dest)
      console.log('req.files.pic.data: ', req.files.pic.data)
      fs.writeFile(dest, req.files.pic.data, function(err, data) {
        if (err) console.log(err);
        console.log("Successfully Written to File.");
        fileName = tempFileName;
        savePost()
      });
    });
  }else{
    savePost()
  }
})

router.post('/uploadComment', (req, res, next)=>{
  console.log('inside /uploadComment')
  console.log('value of req.body: ', req.body)
  var fileName = ''

  const uploadComment = () => {

    console.log('inside uploadComment')

    var comment = {
      body: req.body.comment, 
      created: Date.now(),
      flags: 0, 
      fileName: fileName
    }

    let commentInstance = new model.Comment(comment)
  
    commentInstance.save().then(comment=>{
      model.Post.findOneAndUpdate({_id:req.body.postID}, { $push: { comments: comment._id }}, {new: true}, (err, post)=>{
        if(err){
          console.log('there was an error: ', err)
        }
        console.log('value of post after updating: ', post)     
        res.json({'success': 'success'})   
      })
    }).catch( (e) => {
      console.log('there was an error: ', e)
    });
  }

  console.log('value of req.files: ', req.files)

  if(req.files!=null){
    let tempFileName = Date.now().toString() + '&&' + req.files.pic.name
    console.log('value of tempFileName: ', tempFileName)
    console.log('inside req.Files != null')
    let dest = __dirname+'/../picFolder/sharp/'+tempFileName
    console.log('value of dest: ', dest)
    console.log('value of data:  ', req.files.pic.data)
    sharp(req.files.pic.data)
    .resize(200, 300, {
      fit: 'inside',
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    })
    .toFile(dest)
    .then(() => {
      console.log('inside .then for sharp')
      let dest = __dirname+'/../picFolder/'+tempFileName
      console.log('value of dest: ', dest)
      console.log('req.files.pic.data: ', req.files.pic.data)
      fs.writeFile(dest, req.files.pic.data, function(err, data) {
        if (err) console.log(err);
        console.log("Successfully Written to File.");
        fileName = tempFileName;
        uploadComment()
      });
    });
  }else{
    uploadComment()
  }


})

router.post('/getNavPage', (req, res, next)=>{
  console.log('inside /getNavPage')
  console.log('value of req.body.navPage: ', req.body.navPage)

  async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  model.Post.find({}).sort({created: -1}).skip(15*req.body.navPage).limit(15).exec((err, posts)=>{
    if(err){
      console.log('there was an err: ', err)
    }

    console.log("***before readFiles***")
    let dest = __dirname+'/../picFolder/sharp/'

    var tempPosts = posts;
    var dataArr = [];

    console.log('value of tempPosts: ', tempPosts)

    const asyncFunc = async () => {
      await asyncForEach(tempPosts, async (tempPost) => {
        console.log('inside asyncForEach')
        if (tempPost.fileName!=''){
          console.log('inside fileName!= if statement')
          console.log('tempPosts[tempPosts.indexOf(tempPost)]: ', tempPosts[tempPosts.indexOf(tempPost)])
          var fileData =  await fsPromise.readFile(__dirname+'/../picFolder/sharp/'+tempPost.fileName)
          console.log('value of fileData: ', fileData);
          // tempPost.data = fileData;
          dataArr.push({post: tempPost._id, data: fileData.toString('base64'), extension: tempPost.fileName.match(/\.[0-9a-z]+$/i)[0]})
          console.log('after assignment and value of tempPosts in asyncForEach: ', tempPosts)
        }
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

  async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  model.Post.findOne({_id: req.body.postID}).populate('comments').exec((err, post)=>{

    commentArr = [];
    var fileObj = null;
    const asyncFunc = async () => {
      if(post.fileName!=''){
        console.log('inside first if statement and value of post: ', post)
        console.log('inside first if statement and value of post.fileName: ', post.fileName)
        var fileData =  await fsPromise.readFile(__dirname+'/../picFolder/sharp/'+post.fileName)
        fileObj = {post: post._id, data: fileData.toString('base64'), extension: post.fileName.match(/\.[0-9a-z]+$/i)[0]}
      }
      if(post.comments.length>0){
        console.log('inside second if statement and post.comments; ', post.comments)
        await asyncForEach(post.comments, async (comment) => {
          console.log('inside asyncForEach')
          if (comment.fileName!=''){
            var commentData =  await fsPromise.readFile(__dirname+'/../picFolder/sharp/'+comment.fileName)
            commentArr.push({post: comment._id, data: commentData.toString('base64'), extension: comment.fileName.match(/\.[0-9a-z]+$/i)[0]})
          }
        })
      }
      console.log('inside model.Post.findOne and value of res: ', {post: post, postObj: fileObj, commentArr: commentArr})
      res.json({post: post, postObj: fileObj, commentArr: commentArr})
    }
    asyncFunc()

  })
})

module.exports = router;
