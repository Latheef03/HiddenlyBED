const multer=require('multer');
const path=require('path')
const fs=require('fs')

const storage=multer.diskStorage({
    destination:function(req,res,cb){
        const dir = '/var/www/html/Hiddenly/Hiddenly/Media/HiddenlyDocument/'
        if(!fs.existsSync(dir))
        {
            fs.mkdirSync(dir,{
                recursive:true
            })
        }
        cb(null,dir)
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname))
    }
})
 
  const docupload=multer({
      storage:storage,
     fileFilter:function(req,file,cb){
      if(file.mimetype!='image/png'||file.mimetype!='image/jpg'||file.mimetype!='image/jpeg'
       ||file.mimetype!='image/gif' 
       //audio file type
       ||file.mimetype!='audio/mpeg' ||file.mimetype!='audio/mp4'||file.mimetype!='audio/mid'|| file.mimetype!='audio/basic'
       || file.mimetype!='audio/x-aiff' || file.mimetype!='audio/vnd.rn-realaudio' ||file.mimetype!='audio/x-aiff'
       //video mimtype
       ||file.mimetype!='video/mp4'||file.mimetype!='video/mpeg'||file.mimetype!='video/ogg'||file.mimetype!='video/quicktime'
      ){
        cb(null,true)
      }else{
        console.log('Only document file support');
        cb(null,false)
    }
  }
})
  
  module.exports=docupload
