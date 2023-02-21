const express = require('express')
const route = express.Router();

const {qrimageupload} = require('../middleware/qr-image')
const {qrimageupload1} = require('../middleware/qr-image1')
const uploadcamera=require('../middleware/camera')
const uploadAudio=require('../middleware/uploadaudio')
const uploadLiveaudio=require('../middleware/uploadliveaudio')
const uploadDocument=require('../middleware/uploadDocument')
const {upload1,compressGalleryImages}=require('../middleware/uploadimagevideo')
const {uploadVideo,compressGalleryVideo}=require('../middleware/uploadvideo')
const {uploadimage} =require('../middleware/uploadstory')
const {uploadStorageImageFile} = require('../middleware/storyimage')






const registrationController = require('../controllers/registration')
const onetooneController=require('../controllers/onetoone')
//route.post('/uploadqrimage',qrimageupload.single('image'),registrationController.qrImage)

route.post('/registration',registrationController.registration);
route.post('/loginViaOtp',registrationController.loginViaOtp);
route.post('/otpVerify',registrationController.otpVerify);
route.post('/ResendOtp',registrationController.resendOtp)
route.put('/emailsent',qrimageupload.single('qr_image'),registrationController.sendEmail)
route.put('/imageComparission',qrimageupload1.single('scan_image'),registrationController.imageComparission)
route.post('/compareUser',registrationController.compareUser)
//route.get('/image',registrationController.image)


route.post('/registerRoom',onetooneController.createroom)
route.post('/storemsg',onetooneController.storeMessage)
route.get('/getmsg/:room_id',onetooneController.getmessage)
route.post('/getcontact',onetooneController.getContact)

route.post('/imageupload',upload1.single('gallery'),compressGalleryImages,onetooneController.saveImageFile);
route.post('/videoupload',uploadVideo.single('gallery'),compressGalleryVideo,onetooneController.saveVideoFile)
route.post('/documentfileupload',uploadDocument.single('document_file'),onetooneController.saveDocumentFile)
    //audio file upload file
route.post('/audiofileupload',uploadAudio.single('audio'),onetooneController.saveAudioFile)
    //live voice recording
route.post('/livevoicerecording',uploadLiveaudio.single('voice'),onetooneController.saveLiveAudioFile)
route.post('/cameraimagesupload',uploadcamera.single('camera_img'),onetooneController.saveCameraFile)
route.delete('/clearallchat/:roomid',onetooneController.clearChat)
route.post("/blockcontact", onetooneController.blockContact);
route.post('/filteringcontact',onetooneController.filteringContact)
route.get('/getstory',registrationController.getstory)
route.post('/addstory',uploadStorageImageFile.single('image'),registrationController.addstory)




module.exports = route;

