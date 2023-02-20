const multer = require('multer');
const path = require('path')
const fs=require('fs');
//require('../../uploads')
const storage=multer.diskStorage({
    destination: function (req, file, cb) {
      const dir='./Hiddenly/Media/Hiddenly Camera/';
      if(!fs.existsSync(dir)){
        fs.mkdirSync(dir,{
          recursive:true
        })
      }
        cb(null,dir)
        //./app/hiddenly/images'  
    },
    filename:(req,file,cb)=>{
        //console.log(file)
        cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname))
    }
})
const uploadcamera=multer({
    storage:storage,
    fileFilter:function(req,file,cb){
        if(file.mimetype==='image/png'||file.mimetype==='image/jpg'||file.mimetype==='image/jpeg'
           ||file.mimetype==='image/gif' 
           //video mimtype
           ||file.mimetype==='video/mp4'||file.mimetype==='video/mpeg'||file.mimetype==='video/ogg'||file.mimetype==='video/quicktime'
        ){
            cb(null,true)
        }else{
            console.log('Only Image,Audio and video support');
            cb(null,false)
        }
    }
})
 module.exports=uploadcamera
