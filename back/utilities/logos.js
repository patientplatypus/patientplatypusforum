
const fs = require('fs');
const fsPromise =  require('fs').promises;
const sharp = require('sharp');

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const writePic = (picName, picData, callback) => {
  console.log('inside writePic in logos')
  let tempFileName = Date.now().toString() + '&&' + picName
  let dest = '/picFolder/sharp/'+tempFileName
  console.log('and value of dest : ', dest)
  console.log('and value of picData: ', picData)
  sharp(picData)
  .resize(200, 300, {
    fit: 'inside',
    background: { r: 255, g: 255, b: 255, alpha: 0 }
  })
  .toFile(dest)
  .then(() => {
    let dest = '/picFolder/'+tempFileName
    fs.writeFile(dest, picData, function(err, data) {
      if (err){
        console.log("there was an error writing the pic: ", err);
      }else{
        console.log("Successfully Written to File."); 
      }
      fileName = tempFileName;
      callback(fileName)
    });
  });
}

const IPquery = (req) => {
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