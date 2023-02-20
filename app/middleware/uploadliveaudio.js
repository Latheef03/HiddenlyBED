const multer = require('multer');
const path = require('path')
const fs=require('fs');
//require('../../uploads')
const storage=multer.diskStorage({
    destination: function (req, file, cb) {
      const dir='./Hiddenly/Media/Hiddenly voice/';
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

const uploadLiveVoice=multer({
    storage:storage,
    fileFilter:function(req,file,cb){
        if(file.mimetype==='audio/mpeg' ||file.mimetype==='audio/mp4'||file.mimetype==='audio/mid'|| file.mimetype==='audio/basic'
           || file.mimetype==='audio/x-aiff' || file.mimetype==='audio/vnd.rn-realaudio' ||file.mimetype==='audio/x-aiff'||file.mimetype==='audio/opus'||file.mimetype==='audio/ogg'||
           file.mimetype==='audio/m4a' )
           {
            cb(null,true)
           }
           else{
               console.log('Only Audio support');
               cb(null,false)
           }
    }
});
module.exports=uploadLiveVoice

