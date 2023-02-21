const express = require('express');
const multer = require('multer');
const sharp = require('sharp');   

var storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
	       dir2= "/var/www/html/Hiddenly/app/src/storyimage"
       cb(null, dir2);
    },
    filename: function (req, file, cb) {
       cb(null, file.originalname);
    }
 });
 var uploadimage = multer({ storage: storage2 });

 const compressedImg = async(req,res,next)=>{
    try {
      await sharp("./app/src/src-ip-image/121.jpg")
        .resize({
          width: 150,
          height: 97
        })
        .toFormat("jpeg", { mozjpeg: true })
        .toFile("./app/src/resize-image/121-resized.jpg");
	    next()
    } catch (error) { 
        next()
        console.log(error);
      }
  }

 module.exports =  {uploadimage,compressedImg}
