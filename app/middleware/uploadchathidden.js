const multer = require('multer');
const path = require('path')
const fs=require('fs')

const storage=multer.diskStorage({
    destination: function (req, file, cb) {
     const dir='/var/www/html/Hiddenly/Hiddenly/Media/HiddenlyImages/Sent/';
      if(!fs.existsSync(dir)){
        fs.mkdirSync(dir,{
          recursive:true
        })
      }
        cb(null,dir)
        //./app/hiddenly/images'  
    },
    filename:(req,file,cb)=>{
	//console.log("file",file)
        cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname))
    }
})
const chathidden =multer({
    storage:storage})

module.exports = {chathidden}