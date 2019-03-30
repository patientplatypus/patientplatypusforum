
const fs = require('fs');
const fsPromise =  require('fs').promises;
const sharp = require('sharp');

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const writePic = (picName, picData, callback) => {
  let tempFileName = Date.now().toString() + '&&' + picName
  let dest = __dirname+'/../picFolder/sharp/'+tempFileName
  sharp(picData)
  .resize(200, 300, {
    fit: 'inside',
    background: { r: 255, g: 255, b: 255, alpha: 0 }
  })
  .toFile(dest)
  .then(() => {
    let dest = __dirname+'/../picFolder/'+tempFileName
    fs.writeFile(dest, picData, function(err, data) {
      if (err) console.log(err);
      console.log("Successfully Written to File.");
      fileName = tempFileName;
      callback(fileName)
    });
  });
}

const IPquery = (req) => {
  // console.log('inside IPquery')
  // console.log('req.connection.remoteaddress: ', req.connection.remoteAddress)
  // console.log('req.header["x-forwarded-for"]: ', req.header('x-forwarded-for'))
  // if(req.connection.remoteAddress.includes('127.0.0.1')==false){
  //   return req.connection.remoteAddress
  // }else{//check to make sure this works in prod: 
  //   //docs: https://stackoverflow.com/questions/8107856/how-to-determine-a-users-ip-address-in-node
  //   return req.header('x-forwarded-for')
  // }
  let ipAddr = request.connection.remoteAddress;

  if (request.headers && request.headers['x-forwarded-for']) {
    [ipAddr] = request.headers['x-forwarded-for'].split(',');
  }

  return ipAddr;
}


module.exports = {
  asyncForEach, 
  writePic, 
  IPquery
}