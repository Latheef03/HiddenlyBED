const nodemailer = require('nodemailer')
//const TwoFactor = new (require('2factor'))(process.env.PINKBOX_APIKEY)
//const axios = require('axios').default;
var urlencode = require('urlencode');
const fetch = require('node-fetch')
const path=require('path')
var transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            auth: {
              user: "impanavenkatesh11@gmail.com",
              pass: "bjqplmuunskxrrrs",
            },
            
      });
      function mailoption(toemail,qr_image){
        var mail ={

            from: '"Hiddenly Team" <impanavenkatesh11@gmail.com>',
            to: `${toemail}`,
            subject: "Receive QRcode From Hiddenly ",
            html:
            "<h3>Dear" +
                  "  " +
                  "User," +
                  
                  "</h3>" +
                  `<h4>Find here you QR code , Keep it safe ,we will ask you everytime when you login to Hiddenly For security purpose dont ever loose this</h4>`+
                  "<p> Note:-Keepit safe for next login or else you won't able to access hiddenly</p>",
                attachments:[{
                  filename:"QR_IMAGE_HIDDENLY.png",
                  //path:"E:/download/Hiddenly/Hiddenly/app/src/qr-image-uploads/bts.jpg"
                  path:'E:/download/Hiddenly/Hiddenly/app/src/qr-image-uploads/'+qr_image
                  
                }
              ]         
        }
        console.log(qr_image)
        return mail
      }
  
      const sendmail=async(toemail,image)=>{
        try{
          
        transporter.sendMail(mailoption(toemail,image),function(error,info){
          if(error){
          
              console.log(error)
          }else{
              console.log('email sent'+ info.response)
          }
          
          })
      }catch(err){
        console.log(err);
        throw err
       }    
    
      }





const sendOtpOnMobile = async (number,otp)=>{
    try{
      let sender = encodeURIComponent('PNKBOX');
      otp = String(otp)
      let msg = `${otp} is the OTP to Login to your Pink Box Account. This OTP is valid for 2 minutes only. DO NOT SHARE OTPs to anyone.`
      let encoded_message = encodeURIComponent(msg);
      console.log(sender,encoded_message);
      let apikey=urlencode('NTU1NTMwNTU2YzU3NDM3ODRjNzc1MDUyNDM1ODRhNTA=')
      let numbers=urlencode(number)

      data = 'username='+'pinkboxjewels@gmail.com'+'&password='+'PinkBox@123'+'&numbers='+numbers+"&sender="+sender+"&message="+encoded_message;
      //let result = await api.get('/send/?'+data)
      let result = await fetch('https://api.textlocal.in/send/?'+data, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      let json = await result.json()
      if(json){
	  return true
      }else{
	 return false
      }
     }
    catch(err){
    	throw err
    }
  }

  
  



module.exports = {sendmail,sendOtpOnMobile}


