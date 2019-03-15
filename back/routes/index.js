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

  model.Post.find({}).sort({created: -1}).exec((err, posts)=>{
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

module.exports = router;
