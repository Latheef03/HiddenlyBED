
const multer = require('multer');
const path =require('path')

const storage = multer.diskStorage({
    destination:  function (req, file, cb) {
        dir ="./app/src/qr-image-uploads"
        cb(null, dir);
    },

    filename: function (req, file, cb)  {
      cb(null ,file.originalname);
    },
  })
  
const qrimageupload = multer({ storage: storage })

module.exports = {qrimageupload}
