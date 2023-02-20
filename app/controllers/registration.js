const Users = require('../models/registration');
const Jimp=require('jimp')
const fs=require('fs')
const path=require("path")
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');
var validator = require("email-validator");
const chaservice = require('../services/chapter-service')
const otpService = require('../services/otp_service')
const jwtTokenService = require('../services/jwt-service')
const service = require('../services/mobile_service');
const { setMaxIdleHTTPParsers } = require('http');
const { response } = require('express');

exports.registration = async (req, res) => {
    try{  
        
        if(!req.body.mobilenumber||!req.body.name){
            return res.status(406).send({Status:false,message:'Mobilenumber&name is required field'})
        }
        else{
            let account;
            account = await chaservice.findByMobileNumber(req.body.mobilenumber)
            if(account){
                return res.status(406).send({Status:false,message:'You have already registerd with Hiddenly please login'})
            }
            else{
            if (!account){
                const user=new Users({   
                    mobilenumber:req.body.mobilenumber,
                    name:req.body.name,
                    
                     
                          })
                          
                          
                          
                            const account1 = await user.save()
                            account= account1 
                            account = await chaservice.findByMobileNumber(req.body.mobilenumber)
                            const Authorization  = jwtTokenService.generateJwtToken({user_id:account._id,LoggedIn:true})
                            await jwtTokenService.storeRefreshToken(Authorization,account._id)
                
            }
        }
    
            let mobilenumber;
           
            let otp = otpService.generateOtp(1000,9999)
            
                   mobilenumber = await service.sendOtpOnMobile(req.body.mobilenumber,otp)
                
                let time = 1000*60*5
                let expires = Date.now()+time
                let data = `${req.body.mobilenumber}.${otp}.${expires}`
                let result = otpService.hashData(data)
                if(mobilenumber===true){
                    return res.status(200).send({
                        Status:true,
                        message:'otp send sucessfully on mobilenumber',
                        name:req.body.name,
                        hashdata:`${result}.${expires}`,
                        otp,
                        mobilenumber:req.body.mobilenumber,
                        
                    })
                }
                else{
                    return res.status(406).send({Status:false,message:'name ormobilenumber is not Valid'})
                }
           
            
    }
    }
    catch(err){
         console.log('registrtion error',err);
        return res.status(400).send({Status:'Error',message:'somthing went wrong'})
       }                    
 };

exports.loginViaOtp = async (req, res) => {             
    try{
        if(!req.body.mobilenumber){
            return res.status(406).send({Status:false,message:'Mobilenumber is required field'})
          }
        else{
            let account;
            account = await chaservice.findByMobileNumber(req.body.mobilenumber)
            if(account){
            let mobilenumber;
            let otp = otpService.generateOtp(1000,9999)
                   mobilenumber = await service.sendOtpOnMobile(req.body.mobilenumber,otp)
                
                let time = 1000*60*5
                let expires = Date.now()+time
                let data = `${req.body.mobilenumber}.${otp}.${expires}`
                let result = otpService.hashData(data)
                if(mobilenumber===true){
                    return res.status(200).send({
                        Status:true,
                        message:'otp send sucessfully on mobile',
                        hashdata:`${result}.${expires}`,
                        otp,
                        mobilenumber:req.body.mobilenumber
                    })
                }
                }else{
                    return res.status(406).send({Status:false,message:'mobilenumber is not Valid'})
                }
    }
}
   
    catch(err){
         console.log('LoginViaOtperror',err);
        return res.status(400).send({Status:'Error',message:'somthing went wrong'})
       }                    
 };

exports.otpVerify = async (req, res) => {
try{
    const {mobilenumber,hashdata,otp} = req.body
    if(!mobilenumber || !hashdata || !otp){
        return res.status(406).send({Status:false,message:'mobilenumber,hashdata and otp required fields'})
    } 
    else{
        let account;
        if(isNaN(mobilenumber)){
            account = await chaservice.findAccount(mobilenumber)
        }
        else{
            account = await chaservice.findByMobileNumber(mobilenumber)
        }
        if(!account){
            return res.status(406).send({Status:false,message:'This MobileNumber is not Exist'})
        }
        else{
        const [hash,expires] = hashdata.split('.')
        let data = `${mobilenumber}.${otp}.${expires}`
        if(Date.now()>expires){
            return res.status(406).send({Status:false,message:'Your OTP Session Expires'})
        }
        else{
            let result = otpService.hashData(data)
            if(result===hash){
                    const Authorization = jwtTokenService.generateJwtToken({user_id:account._id,LoggedIn:true})
                    await jwtTokenService.updateRefreshToken(account._id,Authorization)
                    return res.status(200).send({Status:true,message:'OTP Verify Successfully',account,Authorization})
                }
            else{
                return res.status(406).send({Status:false,message:'OTP Miss Match'})
            }
        }
    }
}
}catch(err){
    console.log(err);
    return res.status(400).send({Status:'Error',message:'somthing went wrong'})
           }
}

/*
exports.sendEmail= async (req, res) =>{
    
        try{
           if(req.file){
                var user = new Users ({
                    qr_image :req.file.filename
               }) 
               
                const response=await user.save()
let email;
let image =({qr_image:req.file.filename})
           if(isNaN(req.body.email)){
            
                email = await service.sendmail(req.body.email,image)
                

                return res.status(200).json({
                    Status:true,
                    message:'qr code send sucessfully on email',
                    email:req.body.email,
                    response
                    
                  })
                  
     } else{
        if(isNaN(!req.body.email))
               return res.status(406).json({Status:false,message:'could not send email'})
            }
        
}
}catch(err){
        console.log(err);
        return res.status(400).json({Status:'Error',message:'somthing went wrong'})
        }
    }

*/
/*exports.sendEmail= async (req, res) =>{
    
    try{
    
        
       if(req.file){
            var user = new Users ({
                qr_image :req.file.filename
           }) 
           const response=await user.save()
           return res.status(200).json({ response})



let email;
let image =({qr_image:req.file.filename})
       if(isNaN(req.body.email)){
        
            email = await service.sendmail(req.body.email,image)
            

            return res.status(200).json({
                Status:true,
                message:'qr code send sucessfully on email',
                email:req.body.email,
                response
                
              })
              
 } else{
    if(isNaN(!req.body.email))
           return res.status(406).json({Status:false,message:'could not send email'})
        }
  
}
}catch(err){
    console.log(err);
    return res.status(400).json({Status:'Error',message:'somthing went wrong'})
    }
}

exports.sendEmail = async (req, res) => {  
    try{
       const {mobilenumber,email}=req.body
       
            if(req.file){
                qr_image=req.file.filename
                
                
                const response=await chaservice.findOneAndUpadate(mobilenumber,qr_image,email)
            console.log("registaration Data ",response)
            return res.status(200).json({Status:true,response})
            }
            else{
                return res.status(400).json({Status:'Error',Error})
            }
        }
        
    
     catch(err){
        console.log('err',err.message);
        const Error={}
        if(err.message.includes(' validation failed')){
            Object.values(err.errors).forEach(properties=>{
                   
                    Error[properties.path]=properties.message
            })
        }
        return res.status(400).json({Status:'Error',Error})
     }
}
 */
exports.sendEmail = async (req, res) => {  
    try{
       const {mobilenumber}=req.body
       if(req.file){
            qr_image=req.file.filename,
            email=req.body.email
       }
            const response=await chaservice.findOneAndUpadate(mobilenumber,qr_image,email)
            //console.log(response)
            if(response){
                //let  =({qr_image:req.file.filename})
                                email = await service.sendmail(email,qr_image)
                                
                                return res.status(200).send({
                                    Status:true,
                                    message:'qr code send sucessfully on email',
                                    response
                                })
                                
                            }else{
                                return res.status(400).send({Status:false,message:'account is not found',Error})
                            }
                        }
     catch(err){
        console.log('err',err.message);
        const Error={}
        if(err.message.includes(' validation failed')){
            Object.values(err.errors).forEach(properties=>{
                   
                    Error[properties.path]=properties.message
            })
        }
        return res.status(400).json({Status:'Error',Error})
     }
}
/*
exports.imageComparission = async (req, res ) => {  
try{
    const {mobilenumber,qr_image}=req.body
    
   if(req.file){
        scan_image=req.file.filename
    }
    var src1="E:/download/Hiddenly/Hiddenly/app/src/qr-image-uploads/bts.jpg"
    console.log('path',src1)
    var src2="E:/download/Hiddenly/Hiddenly/app/src1/qr-imagecheck-uploads/"+scan_image
    console.log('path',src2)
    var src3 =await chaservice.findImage(mobilenumber,qr_image)
        console.log("fetch1",src3)
        var src4=await chaservice.findImage1(mobilenumber,scan_image)
       console.log("fetch2",src4)
    compareImages = async (filename1, filename2) => {
        console.log("firstfile",filename1)
        console.log("secondfile",filename2)
        const example1 =  await Jimp.read(filename1)
       // console.log("jimp1",example1)
        const example2 = await Jimp.read(filename2)
        //console.log("jimp2",example2)
        //const example1Hash = example1.hash()
        //const example2Hash = example2.hash()
        const distance = Jimp.distance(example1, example2)
        const diff = Jimp.diff(example1, example2)
        console.log(distance)
        console.log(diff)
        if ( distance > 0.15 || diff > 0.15) {
            return "Images don't match"
        } else {
            return "Images are same"
        }
        
    }
   var src5="E:/download/Hiddenly/Hiddenly/app/src/qr-image-uploads/bts.jpg"
   var src6="E:/download/Hiddenly/Hiddenly/app/src1/qr-imagecheck-uploads/bts.jpg"
    compareImages(src5,src6)
    const response=await chaservice.findOneAndUpadate1(mobilenumber,scan_image)
   
    if(response){
        return res.status(200).json({Status:true,message:'updated successfully',response}) 
        
    } 
    
    }catch(err){
            console.log(err);
            return res.status(400).send({Status:'Error',message:'somthing went wrong'})
             }
}*/
exports.imageComparission = async (req, res ) => {  
    try{
        const {mobilenumber}=req.body
       if(req.file){
            scan_image=req.file.filename
        }
        const response=await chaservice.findOneAndUpadate1(mobilenumber,scan_image)
        if(response){ 
       var src1 =await chaservice.findImage(mobilenumber)
        console.log(src1)
         const src2="E:/download/Hiddenly/Hiddenly/app/src/qr-image-uploads/"+src1
         const src3="E:/download/Hiddenly/Hiddenly/app/src1/qr-imagecheck-uploads/"+scan_image
         compareImages = async (filename1, filename2) => {
            console.log("firstfile",filename1)
            console.log("secondfile",filename2)
            const example1 =  await Jimp.read(filename1)
           // console.log("jimp1",example1)
            const example2 = await Jimp.read(filename2)
            //console.log("jimp2",example2)
            //const example1Hash = example1.hash()
            //const example2Hash = example2.hash()
            const distance = Jimp.distance(example1, example2)
            const diff = Jimp.diff(example1, example2)
            if (distance > 0.1 ||diff > 0.1) {
                console.log( "Images don't match")   
                return res.status(200).send({ Status:false,message:'Images are donot same'})}
                 else {
                console.log( "Images are same")
                return res.status(400).send({Status:true,message:'Images are same'})
            }
            
        }
       var src4=src2
       var src5=src3
        compareImages(src4,src5)
       
    }
        }catch(err){
                console.log(err);
                return res.status(400).send({Status:'Error',message:'somthing went wrong'})
                 }
    }
    exports.resendOtp = async (req, res) => {
        try{
            if(!req.body.mobilenumber){
                return res.status(406).send({Status:false,message:'Mobilenumber is required field'})
              }
            else{
                let account;
                account = await chaservice.findByMobileNumber(req.body.mobilenumber)
                if(account){
                let mobilenumber;
                let otp = otpService.generateOtp(1000,9999)
                       mobilenumber = await service.sendOtpOnMobile(req.body.mobilenumber,otp)
                    
                    let time = 1000*60*5
                    let expires = Date.now()+time
                    let data = `${req.body.mobilenumber}.${otp}.${expires}`
                    let result = otpService.hashData(data)
                    if(mobilenumber===true){
                        return res.status(200).send({
                            Status:true,
                            message:'otp send sucessfully on mobile',
                            hashdata:`${result}.${expires}`,
                            otp,
                            mobilenumber:req.body.mobilenumber
                        })
                    }
                    }else{
                        return res.status(406).send({Status:false,message:'mobilenumber is not Valid'})
                    }
        }
    }
       
        catch(err){
             console.log('LoginViaOtperror',err);
            return res.status(400).send({Status:'Error',message:'somthing went wrong'})
           }                    
     };

     exports.compareUser = async (req, res ) => {
        try{  
            const {_id} = req.body         
            if(!_id){
                return res.status(406).send({Status:false,message:'_id  and mobilenumber is require feild'})
            }
          else{
            var response =await chaservice.findUser(_id)
            if(response==req.body.mobilenumber){
                return res.status(400).send({Status:true,message:'qr code verified successfully'})
            }else{
                return res.status(406).send({Status:false,message:'sorry, qr code is MissMatch!'})
            }
            
        }                 
        }catch(err){
            console.log(err);
            res.status(400).json({Status:false,message:'somthing went wrong'})
        }
    };
     