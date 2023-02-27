const Users = require('../models/registration');
const {createRoomId}=require('../models/onetoone')
const {CreateGroup}=require('../models/groupchat')

//Update Profile
exports.updateProfile=async(req,res)=>{
    try{
        var response;
        console.log(req.body.name,req.body.about)
    
        const userid=req.params.userid
    //    console.log(req.body.name,req.body.about,req.file.filename)
      /*  if(req.file && userid){
            
            response=await usermaster.findOneAndUpdate({_id:userid},{$set:{"profile_img":req.file.filename}},{new:true})
        }*/
        if(req.body.name && userid){
            response=await Users.findOneAndUpdate({_id:userid},{$set:{"name":req.body.name}},{new:true})
           }
        if(req.body.about && userid){
            response=await Users.findOneAndUpdate({_id:userid},{$set:{"about":req.body.about}},{new:true})
        }
         if(req.file && userid){
        console.log(req.file.filename)
            response=await Users.findOneAndUpdate({_id:userid},{$set:{"profile_img":req.file.filename}},{new:true})
        }
    
        if(response){
            res.send({status:true,message:"Your profile update successfully",response})
         }
         
         else{
             res.send({status:false,message:"No updated New"})
         }
     }
     catch(err){
        console.log("error",err)
        res.send({ErrorMessage:"somthing error",err})
        }
    }
    //end updating profile
  //get profile
exports.getProfile=async(req,res)=>{
    try{
   const userid=req.params.userid
   if(userid!=undefined)
        {
      const response=await Users.findOne({_id:userid})
      if(response)
       {
         res.send({status:"Success",response})
       }
      else{
       res.send({status:"failure",message:"somthing error"})
       }
    }
   else{
       res.send({status:"failure",message:"please pass id"})
       }
   }
   catch(err){
       res.send({ErrorMessage:"somthing error",err})
         }
  }
 //end get profile code
 //delete profile
 exports.deleteAccount=async(req,res)=>{
    try{
   const userid=req.params.userid
   if(userid!=undefined){
      //const response=await Users.findOneAndDelete({_id:userid})
      const response=await Users.findOne({_id:userid})
      response.mobilenumber
      console.log(response)
      if(response){
    const response1=await Users.findOneAndDelete({_id:userid})
    console.log(response1)
     const response2= await createRoomId.findOneAndDelete({mobilenumber:userid})
      console.log(response2)
      const response3=await CreateGroup.findOneAndDelete({mobilenumber:userid})
      console.log(response3)
      
      }
      if(response3)
       {
         res.send({status:"Success",response3})
       }
      else{
       res.send({status:"failure",message:"somthing error"})
       }
    }
   else{
       res.send({status:"failure",message:"please pass id"})
       }
   }
   catch(err){
       res.send({ErrorMessage:"somthing error",err})
         }
  }
  //delete profile complete
  //accountsettings started
  exports.accountsetting=async(req,res)=>{
    try{
        var response;
        console.log(req.body.name,req.body.about)
    
        const userid=req.params.userid
        if(req.body.isActive1 && userid){
            response=await Users.findOneAndUpdate({_id:userid},{$set:{isActive1:1}},{new:true})
            if(response){
                res.send({status:true,message:"settings updated nobody",response})
            }
           }
        else if(req.body.isActive0 && userid){
            response=await Users.findOneAndUpdate({_id:userid},{$set:{isActive0:0}},{new:true})
            if(response){
                res.send({status:true,message:"settings updated mycontact",response})
            }
        }
        else{
             res.send({status:true,message:"account is visible everybody"})
         }
     }
     catch(err){
        console.log("error",err)
        res.send({ErrorMessage:"somthing error",err})
        }
    }