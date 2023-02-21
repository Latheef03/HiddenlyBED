
const multer = require('multer');
const path =require('path')

const storage = multer.diskStorage({
    destination:  function (req, file, cb) {
        dir ="/var/www/html/Hiddenly/app/src1/qr-imagecheck-uploads"
        cb(null, dir);
    },

    filename: function (req, file, cb)  {
      cb(null ,file.originalname);
    },
  })
  
const qrimageupload1 = multer({ storage: storage })

module.exports = {qrimageupload1}
