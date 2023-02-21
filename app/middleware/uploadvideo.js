const multer = require('multer');
const express = require('express');
const fs = require('fs')
const path = require('path');

const ffmpeg = require('@ffmpeg-installer/ffmpeg');
const FFmpeg = require('fluent-ffmpeg');
FFmpeg.setFfmpegPath(ffmpeg.path);

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      var dir = './Hiddenly/Media/Hiddenly Video/Sent/'
        cb(null, dir);
    },

    filename: function (req, file, cb) {
      cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
    }

 });
 
var uploadVideo = multer({ storage: storage });

const compressGalleryVideo = async(req,res,next)=>{
  try {
   FFmpeg("/var/www/html/Hiddenly/Hiddenly/HiddenlVideo/Sent/"+req.file.filename)
          .videoCodec('libx264')
          .output("/var/www/html/Hiddenly/Hiddenly/webp/status/"+req.file.filename)
          .on('error', function(err) {
            console.log('An error occurred: ' + err.message);    
          })	
          .on('progress', function(progress) { 
            console.log('... frames: ' +   progress.frames);
            
          })
          .on('end', function() { 
            console.log('Finished processing'); 
            
          })
          .run();
          next()
          } catch (error) {
            next()
            console.log(error);
          }
}
module.exports =  {uploadVideo,compressGalleryVideo}
