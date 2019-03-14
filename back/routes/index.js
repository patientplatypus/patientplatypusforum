var express = require('express');
var router = express.Router();
const fs = require('fs');
// var getDirName = require('path').dirname;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/uploadPost', (req, res, next)=>{
  console.log('inside /uploadPost')
  console.log('and value of req.body: ', req);
  console.log('value of req.files: ', req.files)
  console.log('value of req.body: ', req.body)

  if(req.files!=null){
    let dest = __dirname+'/../picFolder/'+req.files.pic.name
    console.log('value of dest: ', dest)
    console.log('req.files.pic.data: ', req.files.pic.data)
    fs.writeFile(dest, req.files.pic.data, function(err, data) {
      if (err) console.log(err);
      console.log("Successfully Written to File.");
    });
  }


  res.json({return: 'return from /uploadPost'})
})

module.exports = router;
