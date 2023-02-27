const multer = require('multer');
const path = require('path')
const fs=require('fs');
const webp=require('webp-converter')


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
const upload1=multer({
    storage:storage,
    fileFilter:function(req,file,cb){
        if(file.mimetype==='image/png'||file.mimetype==='image/jpg'||file.mimetype==='image/jpeg'
           ||file.mimetype==='image/gif' 
           //video mimtype
           ||file.mimetype==='video/mp4'||file.mimetype==='video/mpeg'||file.mimetype==='video/ogg'||file.mimetype==='video/quicktime')
            {
            cb(null,true)
        }else{
           // console.log('only Image and video upload');
            cb(null,false)
        }
    }
})


   const compressGalleryImages=async(req,res,next)=>{
    //console.log(req.file)
    if(req.file.mimetype==='image/png'||req.file.mimetype==='image/jpg'||req.file.mimetype==='image/jpeg'||req.file.mimetype==='image/gif'||req.file.mimetype==='video/mp4'||req.file.mimetype==='video/mpeg'||req.file.mimetype==='video/ogg'||req.file.mimetype==='video/quicktime'){
        let result;

            //console.log("_______________________________________________",req.file.path)
        var output_path="/var/www/html/Hiddenly/Hiddenly/webp/gallery/"+req.file.filename
         result=await webp.cwebp(req.file.path,output_path,"-q 30", logging="-v")
        //
        //webp.cwebp()
        console.log(result)
        next()
    }
     else if(req.files[i].mimetype==='image/heic' || req.files[i].mimetype==='image/HEIC'){
	   let output_path="/var/www/html/Hiddenly/Hiddenly/webp/status/"+req.files[i].filename
           const inputBuffer = await promisify(fs.readFile)(req.files[i].path);
           const outputBuffer = await convert({
		  buffer: inputBuffer, // the HEIC file buffer
	          format: 'JPEG/mp4',      // output format
	          quality: 0.5          // the jpeg compression quality, between 0 and 1
	      });
           await promisify(fs.writeFile)(output_path,outputBuffer);
       }
    else{
        next()
    }
}

 module.exports={upload1,compressGalleryImages}
