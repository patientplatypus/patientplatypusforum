
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


module.exports = {
  asyncForEach, 
  writePic
}