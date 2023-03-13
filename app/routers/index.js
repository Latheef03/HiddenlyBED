const express = require('express')
const route = express.Router();

const {qrimageupload} = require('../middleware/qr-image')
const {qrimageupload1} = require('../middleware/qr-image1')
const uploadcamera=require('../middleware/camera')
const uploadAudio=require('../middleware/uploadaudio')
const uploadLiveaudio=require('../middleware/uploadliveaudio')
const uploadDocument=require('../middleware/uploadDocument')
const {upload1,compressGalleryImages}=require('../middleware/uploadimage')
const {uploadVideo,compressGalleryVideo}=require('../middleware/uploadvideo')
const {uploadimage} =require('../middleware/uploadstory')
const {uploadStorageImageFile} = require('../middleware/storyimage')
const{uploadProfile,compressProfileImg}=require('../middleware/uploadProfile')
const {uploadbackground,compressbackgroundimg}=require('../middleware/uploadBackground')
const{chathidden}=require('../middleware/uploadchathidden')



const registrationController = require('../controllers/registration')
const onetooneController=require('../controllers/onetoone')
const groupController=require('../controllers/groupchat')
const settingController=require('../controllers/settings')
const statusController = require('../controllers/status')
//route.post('/uploadqrimage',qrimageupload.single('image'),registrationController.qrImage)

route.post('/registration',registrationController.registration);
route.post('/loginViaOtp',registrationController.loginViaOtp);
route.post('/otpVerify',registrationController.otpVerify);
route.post('/ResendOtp',registrationController.resendOtp)
route.put('/emailsent',qrimageupload.single('qr_image'),registrationController.sendEmail)
route.put('/imageComparission',qrimageupload1.single('scan_image'),registrationController.imageComparission)
route.post('/compareUser',registrationController.compareUser)
route.put('/updateProfile/:userid', uploadProfile.single('profile_img'),compressProfileImg,settingController.updateProfile)
route.get('/getProfile/:userid',settingController.getProfile)
route.delete('/deleteAccount/:userid',settingController.deleteAccount)
route.put('/accountSettings',settingController.accountsetting)
route.put('/blockcontact',settingController.blockContact)
route.put('/unblockcontact',settingController.unBlockContact)
route.get('/getallblockcontact',settingController.getBlockContact)
route.put('/changenumber',settingController.changeNumber)
//route.get('/image',registrationController.image)


route.post('/registerRoom',onetooneController.createroom)
route.post('/storemsg',onetooneController.storeMessage)
route.get('/getmsg/:room_id',onetooneController.getmessage)
route.post('/getcontact',onetooneController.getContact)

route.delete('/deletonemessage',groupController.deleteOneMessage)
route.delete('/deletonemanymessage',groupController.deleteOneManyMesage)

route.post('/imageupload',upload1.single('gallery'),compressGalleryImages,onetooneController.saveImageFile);
route.post('/videoupload',uploadVideo.single('gallery'),compressGalleryVideo,onetooneController.saveVideoFile)
route.post('/documentfileupload',uploadDocument.single('document_file'),onetooneController.saveDocumentFile)
    //audio file upload file
route.post('/audiofileupload',uploadAudio.single('audio'),onetooneController.saveAudioFile)
    //live voice recording
route.post('/livevoicerecording',uploadLiveaudio.single('voice'),onetooneController.saveLiveAudioFile)
route.post('/cameraimagesupload',uploadcamera.single('camera_img'),onetooneController.saveCameraFile)
route.delete('/clearallchat/:roomid',onetooneController.clearChat)
route.post('/filteringcontact',onetooneController.filteringContact)
route.post('/chatHistory',onetooneController.getChatHistory)
route.post('/viewcontact',onetooneController.viewContact)
route.put('/setbackground',uploadbackground.single('back_img'),compressbackgroundimg,onetooneController.setbackground)
route.put('/settheme',onetooneController.setTheme)
route.delete('/deleteroom/:roomid',onetooneController.deleteRoom)

route.post('/sendcontact',onetooneController.sendContact)
route.delete('/chathiddenly',onetooneController.chathiddenly)
route.post('/commongroup',onetooneController.commonGroup)
route.post('/creategroup',uploadProfile.single('profile_img'),compressProfileImg,groupController.createGroupRoom)
route.put('/deleteperson',groupController.deleteGroupMember)
route.put('/joingroup',groupController.newJoingMemberinGroup)
route.put('/makeadmin',groupController.makeAdmin)
route.put('/demakeadmin',groupController.deMakeAdmin)
route.delete('/deletegrouproom/:_id',groupController.deletegrouproom)
route.put('/exitgroup/:_id',groupController.exitGroup)
//route.post('/invitelink',)
route.post('/storemsggroup',groupController.storeMessageGroup)
route.get('/getmsggroup/:room_id',groupController.getmessageGroup)

//route.post('/chatHistorygroup',groupController.getChatHistoryGroup)
route.post('/imageuploadgroup',upload1.single('gallery'),compressGalleryImages,groupController.saveImageFileGroup);
route.post('/videouploadgroup',uploadVideo.single('gallery'),compressGalleryVideo,groupController.saveVideoFileGroup)
route.post('/documentfileuploadgroup',uploadDocument.single('document_file'),groupController.saveDocumentFileGroup)
    //audio file upload file
route.post('/audiofileuploadgroup',uploadAudio.single('audio'),groupController.saveAudioFileGroup)
    //live voice recording
route.post('/livevoicerecordinggroup',uploadLiveaudio.single('voice'),groupController.saveLiveAudioFileGroup)
route.post('/cameraimagesuploadgroup',uploadcamera.single('camera_img'),groupController.saveCameraFileGroup)
route.delete('/clearallchatgroup/:roomid',groupController.clearChatGroup)
route.post('/viewgroupinfo',groupController.viewGroupInfo)
route.put('/setbackgroundgroup',uploadbackground.single('back_img'),compressbackgroundimg,groupController.setbackgroundGroup)
route.put('/setthemegroup',groupController.setThemeGroup)
route.put('/updateProfilegroup/:_id', uploadProfile.single('profile_img'),compressProfileImg,groupController.updateProfileGroup)
route.post('/totalparticipants',groupController.totalParticipants)




route.post('/addstory',uploadStorageImageFile.single('image'),statusController.addstory)
route.get('/getstory',statusController.getstory)
route.get('/getAllStory',statusController.getAllStory)




module.exports = route;

