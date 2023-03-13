const {CreateGroup}=require('../models/groupchat')
const {v4 : uuidv4} = require('uuid')
const { text } = require('body-parser')
const storeMsg=require('../models/storeMessage')

const usermaster=require('../models/registration')
//create group
exports.createGroupRoom=async(req,res)=>{
    try{
       // const currenttime= new Date()
//currenttime.setSeconds(currenttime.getSeconds()+1)
        if(req.body.user_id!='' && req.body.joining_group!='' && req.body.groupName!='' && req.body.admin_id!='')
        {
            const other_id=req.body.joining_group
            const userid=req.body.user_id
            const customization=req.body.content_customization
            const group_profile_img=req.file.filename
            const autoDelete=req.body.autoDelete
            if(req.file){
           
	const room_id=uuidv4()
        const group=new CreateGroup({
            groupName:req.body.groupName,
            creterGroupId:req.body.user_id,
            joining_group:req.body.joining_group,
            admin_id:[req.body.user_id],
            room_id:room_id,
            content_customization:customization,
            group_profile_img:group_profile_img,
            autoDelete:autoDelete
            
        });
        const response=await group.save()
            if(response){
              
                res.status(200).send({status:"Success",message:"Group Created Successfuly",response})
        
          
        }
    }
    }else{
            res.status(401).send({status:"Failure",message:"Please Provide All Field"}) 
        }
    }
        catch(Error){
	    console.log('error123',Error)
            res.status(401).send({status:"Failure",message:"Somthing Eroor",Error})
        }
    }
  //End of create group
   //Add person in  group
exports.newJoingMemberinGroup=async(req,res)=>{
    try{
        const {_id}=req.body
        const admin_id=req.body.admin_id
        const other_id=req.body.other_id
    
        const result=await CreateGroup.findOne({_id:_id})
        console.log(result)
        const result1=result.admin_id
        const result2=result.joining_group
         console.log(result1,result2)
         if(result1.includes(admin_id)){
            if(!result2.includes(other_id)){
        const response= await CreateGroup.findOneAndUpdate({_id:_id},{$push:{joining_group:other_id}},{new:true});
        console.log(response)
        if(response){
           res.status(201).send({status:"Success",message:response})
        }
    
        else{
            res.status(401).send({status:"Failure",message:"Somthing problem in doning updating group"})
        }
    }else{
        res.status(401).send({status:"Failure",message:"your already in group"})
    }
}else{
    res.status(401).send({status:"Failure",message:"not an admin"})
}
     } catch(err){
           console.log(err)
           res.send({message:"somthing problem",err})
       }
    }
    
      //End remove person of group
    
  //end add person in a group
  //Delete Member in group
exports.deleteGroupMember=async(req,res)=>{
    try{
        const _id=req.body._id
        const other_id=req.body.other_id
        const admin_id=req.body.admin_id
        const result=await CreateGroup.findOne({id:_id})
        console.log(result)
        const result1=result.admin_id
        const result2=result.joining_group
        console.log(result1,result2)
        if(result1.includes(admin_id)){
            if(result2.includes(other_id)){
    const response=await CreateGroup.findOneAndUpdate({_id:_id},{$pull:{joining_group:other_id}},{new:true});
    if(response){
        console.log(response)
       res.status(201).send({status:"Success",message:response})
    }
    else{
        res.status(401).send({status:"Failure",message:"Somthing problem in doning updating group"})
    }
   }else{
    res.status(401).send({status:"Failure",message:"not in group"})
   }
}else{
    res.status(401).send({status:"Failure",message:"not an admin"})
}
 }
  catch(err){
       console.log(err)
       res.send({message:"somthing problem",err})
   }
}
  //End remove person of group
    //make Member admin in group
exports.makeAdmin=async(req,res)=>{
    try{
        const {_id}=req.body
        const other_id=req.body.other_id
        const admin_id=req.body.admin_id
        const result=await CreateGroup.findOne({id:_id})
         console.log(result)
         const result1=result.admin_id
         const result2=result.joining_group
        console.log(result1,result2)
         if(result1.includes(admin_id)&&!result1.includes(other_id)){
            if(result2.includes(other_id)){
    const response=await CreateGroup.findOneAndUpdate({_id:_id},{$push:{admin_id:other_id}},{new:true});
    console.log(response)
    if(response){
       res.status(201).send({status:"Success",message:response})
    }
    else{
        res.status(401).send({status:"Failure",message:"Somthing problem in doning updating group"})
    }
   }else{
    res.status(401).send({status:"Failure",message:"cannot make user to admin"})
   
   }
}else{
    res.status(401).send({status:"Failure",message:"you are already an admin"})
}
}catch(err){
       console.log(err)
       res.send({message:"somthing problem",err})
   }
}
  //End make admin person of group
  exports.deMakeAdmin=async(req,res)=>{
    try{
        const _id=req.body._id
        const other_id=req.body.other_id
        const admin_id=req.body.admin_id
        const result=await CreateGroup.findOne({id:_id})
         console.log(result)
         const result1=result.admin_id
         const result2=result.joining_group
         console.log(result1,result2)
         if(result1.includes(admin_id)){
                if(result1.includes(other_id)){
    const response=await CreateGroup.findOneAndUpdate({_id:_id},{$pull:{admin_id:other_id}},{new:true});
    console.log(response)
    if(response){
       res.status(201).send({status:"Success",message:'user removed from group',response})
    }
    else{
        res.status(401).send({status:"Failure",message:"Somthing problem in doning updating group"})
    }
    }else{
        res.status(401).send({status:"Failure",message:"other id is not an admin"})
    }
}
    else{
        res.status(401).send({status:"Failure",message:"you are already an admin"})
    }
}
   catch(err){
       console.log(err)
       res.send({message:"somthing problem",err})
   }
}
  //End make admin person of group
  //deleteroom started
exports.deletegrouproom=async(req,res)=>{
    try{
        const roomid=req.params._id
        const admin_id=req.body.admin_id
        if(roomid){
        const result= await CreateGroup.findOne({_id:roomid})
        console.log(result)
        const result1=result.admin_id
        console.log(result1)
        if(result1.includes(admin_id)){
            const result= await CreateGroup.findByIdAndDelete({_id:roomid})
        res.status(200).send({status:true,message:"room deleted successfully",result})

    }else{
        res.status(401).send({message:"can not be deleted pls check"})
    }
}else{
    res.status(401).send({message:"your not having authority to delete the group"})
}
}catch(err)
{
    res.send({message:"somthing is wrong"})
    console.log(err)
}
}
//deleteroom ended
//exit group 
exports.exitGroup=async(req,res)=>{
    try{
        const roomid=req.params._id
        const other_id=req.body.other_id
        if(roomid){
        const result= await CreateGroup.findOne({_id:roomid})
        console.log(result)
        const result1=result.joining_group
        const result2=result.admin_id
        console.log(result1,result2)
            if(!result2.includes(other_id)){
                if(result1.includes(other_id)){
                const response=await CreateGroup.findOneAndUpdate({_id:roomid},{$pull:{joining_group:other_id}},{new:true});
                console.log(response)
                res.status(200).send({status:true,message:"room deleted successfully",response})
                }else{
                    res.status(401).send({message:"you are not in group"})
                }
            }else{
                res.status(401).send({message:"you are an admin pls make someone admin and exit"})
            }
    }else{
        res.status(401).send({message:"provide roomid"})
    }
}catch(err)
    {
        res.send({message:"somthing is wrong"})
        console.log(err)
    }
}
//exit group ended
//Store message api 
exports.storeMessageGroup=async(req,res)=>{
    try{
        const otherid=req.body.sender_id
        const name=req.body.senderName
        const msg=req.body.msg
        const roomid=req.body.room_id
        const result=await CreateGroup.findOne({room_id:roomid})
        console.log(result)
        const result1= result.joining_group
        const result2=result.admin_id
        console.log(result1,result2)
	if(!otherid ||!name || !roomid){
		res.status(406).json({message:"sender_id ,senderName,room_id"})
	}
	else if(result1.includes(otherid)||result2.includes(otherid)) {
          const store=storeMsg({
            sender_id:otherid,
            senderName:name,
            message:msg,
            room_id:roomid,
            image:'',
	    video:'',
	    audio:'',
	    document:''
        })
        const result= await store.save();
        if(result)
        {
            return res.status(200).send({status:"Success",message:"Store Message Successfully",result})
        }else{
	  return res.status(400).json({stauts:"Success",message:"Some Technical Issue"})
	}
     }else{
        return res.status(400).json({stauts:"Success",message:"user not allowed to send message"})
     }
    }
    catch(err){
        return res.status(400).send({ErrorMessage:"Somthing Wrong"})
    }
}
//end store message api

//loadin message in chatRoom
exports.getmessageGroup=async(req,res)=>{
    try{
        const roomid=req.params.room_id
        
            const result=await storeMsg.find({room_id:roomid});
            if(result!=0){
                res.send({status:"Success",message:"Get All Data Successfully",result});
            
        }
    }catch(err){
         res.sen({ErrorMessage:"somthing error"})
    }
}
//End loading message api

//sent Images
exports.saveImageFileGroup=async(req,res,next)=>{
    try{
        if(req.file){
            const file1=req.file.mimetype
            const sender_id=req.body.sender_id
            const name=req.body.senderName
            const roomid=req.body.room_id
            const result1=await CreateGroup.findOne({room_id:roomid})
        console.log(result1)
        const result2= result1.joining_group
        const result3=result1.admin_id
        console.log(result2,result3)
        const msg=req.body.message
        let image=""
	    if(file1==='image/png'||file1==='image/jpg'||file1==='image/jpeg'||file1==='image/gif')
		{
                  image=req.file.filename
		}
	   if(result2.includes(sender_id)||result3.includes(sender_id)){
	    const store=storeMsg({
                sender_id:sender_id,
                senderName:name,
                image:image,
                room_id:roomid,
		message:msg,
		video:'',
		audio:'',
		document:''
            })
            const result= await store.save();
            console.log(result)
            if(result)
            {
                res.status(201).send({status:"Success",message:"Image Uploaded Successfully",result})
            }
       }
    else{
        return res.status(400).json({stauts:"false",message:"user not allowed to send message"})
    }
}else{
    return res.status(400).json({stauts:"false",message:"culdnot find any room"})
}
}catch(err){
    console.log(err)
        res.status(400).send({ErrorMessage:"Somthing Error",})

    }
}
//end image sending


exports.saveVideoFileGroup=async(req,res,next)=>{

    try{
        console.log(req.file)
        if(req.file){
            const otherid=req.body.sender_id
            const name=req.body.senderName
            const video=req.file.filename
            const roomid=req.body.room_id
            const msg=req.body.message
            const result1=await CreateGroup.findOne({room_id:roomid})
            console.log(result1)
            const result2= result1.joining_group
            const result3=result1.admin_id
            console.log(result2,result3)
            if(result2.includes(otherid)||result3.includes(otherid)){
            const store=storeMsg({
                sender_id:otherid,
                senderName:name,
                video:video,
                room_id:roomid,
                message:msg
            })
            const result= await store.save();
            if(result)
            {
		console.log(result)
                res.send({status:"Success",message:"Video Uploaded Successfully",result})
            }
        }
        else{
            res.send({ErrorMessage:'couldnt process video'})
        }
    }else{
        return res.status(400).json({stauts:"false",message:"culdnot find any room"})
    }
}catch(err){
        res.send({ErrorMessage:"Somthing Error",err})
    }
}
//end video sending
  //sent Images
exports.saveAudioFileGroup=async(req,res,next)=>{

    try{
        console.log(req.file)
        if(req.file){
            const otherid=req.body.sender_id
            const name=req.body.senderName
            const audio=req.file.filename
            const roomid=req.body.room_id
            const msg=req.body.message
            const result1=await CreateGroup.findOne({room_id:roomid})
            console.log(result1)
            const result2= result1.joining_group
            const result3=result1.admin_id
            console.log(result2,result3)
            if(result2.includes(otherid)||result3.includes(otherid)){
            const store=storeMsg({
                sender_id:otherid,
                senderName:name,
                audio:audio,
                room_id:roomid,
                message:msg,
		image:'',
		video:'',
		document:''
            })
            const result= await store.save();
            if(result)
            {
                res.send({status:"Success",message:"Audio Uploaded Successfully",result})
            }
        } else{
            res.send({ErrorMessage:'couldnt process video'})
        }
    }
        else{
            res.send({ErrorMessage:'Please choose Audio file'})
        saveLiveAudioFile        }
    }
    catch(err){
        res.send({ErrorMessage:"Somthing Error",err})
    }
}
//end Audio sending

     //live audio  upload in  middelware
exports.saveLiveAudioFileGroup=async(req,res,next)=>{

    try{
        console.log(req.file)
        if(req.file){
            const otherid=req.body.sender_id
            const name=req.body.senderName
            const audio=req.file.filename
            const roomid=req.body.room_id
            const msg=req.body.message
            const result1=await CreateGroup.findOne({room_id:roomid})
            console.log(result1)
            const result2= result1.joining_group
            const result3=result1.admin_id
            console.log(result2,result3)
            if(result2.includes(otherid)||result3.includes(otherid)){
            const store=storeMsg({
                sender_id:otherid,
                senderName:name,
                voice_recording:audio,
		audio:'',
                room_id:roomid,
                message:msg,
                image:'',
                video:'',
                document:''
            })
            const result= await store.save();
            if(result)
            {
                res.send({status:"Success",message:"Audio Uploaded Successfully",result})
            }
        }else{
            res.send({ErrorMessage:'couldnt process video'})
        }
    }
        else{
             res.send({ErrorMessage:'Please choose Audio file'})
        }
    }
    catch(err){
        res.send({ErrorMessage:"Somthing Error",err})
    }
}
   //End live audio uploading     

   //save document file uploading
exports.saveDocumentFileGroup=async(req,res,next)=>{

    try{
        console.log(req.file)
        if(req.file){
            const otherid=req.body.sender_id
            const name=req.body.senderName
            const document=req.file.filename
            const roomid=req.body.room_id
            const msg=req.body.message
            const result1=await CreateGroup.findOne({room_id:roomid})
            console.log(result1)
            const result2= result1.joining_group
            const result3=result1.admin_id
            console.log(result2,result3)
            if(result2.includes(otherid)||result3.includes(otherid)){
            const store=storeMsg({
                sender_id:otherid,
                senderName:name,
                document:document,
                room_id:roomid,
                message:msg,
		image:'',
		video:'',
		audio:''
            })
            const result= await store.save();
            if(result)
            {
                res.send({status:"Success",message:"Documentfile Uploaded Successfully",result})
            }
        }else{
            return res.status(400).json({stauts:"false",message:"culdnot find any room"})
        }

    }else{
            res.send({ErrorMessage:'Please Document file only image'})
        }
    }
    catch(err){
        res.send({ErrorMessage:"Somthing Error",err})
    }
}
//End uploading Document file
exports.saveCameraFileGroup=async(req,res,next)=>{

    try{
        console.log(req.file)
        if(req.file){
            const otherid=req.body.sender_id
            const name=req.body.senderName
            const audio=req.file.filename
            const roomid=req.body.room_id
            const msg=req.body.message
            const result1=await CreateGroup.findOne({room_id:roomid})
            console.log(result1)
            const result2= result1.joining_group
            const result3=result1.admin_id
            console.log(result2,result3)
            if(result2.includes(otherid)||result3.includes(otherid)){
            const store=storeMsg({
                sender_id:otherid,
                senderName:name,
                audio:audio,
                room_id:roomid,
                message:msg
            })
            const result= await store.save();
            if(result)
            {
                res.send({status:"Success",message:"Camera Images and Video  Uploaded Successfully",result})
            }
        }else{
            return res.status(400).json({stauts:"false",message:"culdnot find any room"})
        }
        }
        else{
            res.send({ErrorMessage:'Please choose image and video '})
        }
    }
    catch(err){
        res.send({ErrorMessage:"Somthing Error",err})
    }
}
    
  
   //clear chat through roomid
exports.clearChatGroup=(req,res)=>{
    
    const roomid=req.params.roomid
    storeMsg.deleteMany({room_id:roomid}).then(response=>{
        if(response){
            //console.log(response.deletedCount)
            res.status(200).send({status:"Success",message:"All Chat are Clear",response})
        }
        else{
            res.send({message:"Not found Room id"})
        }
        }).catch(Error=>{
            res.status(401).send({status:"Failure",messaage:"somthing problem in clear chat"})
        })
    }
//viewgroupinfo
exports.viewGroupInfo=async(req,res)=>{
    try{
        const {_id}=req.body
        const response = await CreateGroup.findOne({_id:_id})
        if(response){
            res.send({status:true,message:"Get Data Succesfully",response})
        }
        else{
            res.status(401).send({message:"user not found"})
        }
    }catch(err)
    {
        res.send({message:"somthing is wrong"})
        console.log(err)
    }
}
//view group info end

//setbackgroun started
exports.setbackgroundGroup=async(req,res)=>{
    try{
        const {room_id}=req.body
        if(req.file&&room_id){
        setbackground=req.file.filename
        const result= await CreateGroup.findOneAndUpdate({room_id:room_id},{$set:{setbackground:setbackground}},{new:true})
        console.log(result)
        res.send({status:true,message:"background updated successfully",result})

    }else{
        res.status(401).send({message:"select background image"})
    }
    
}catch(err)
{
    res.send({message:"somthing is wrong"})
    console.log(err)
}
}
//setbackground ended

//setthem started
exports.setThemeGroup=async(req,res)=>{
    try{
        const {room_id,setTheme}=req.body
        if(room_id){
        const result= await CreateGroup.findOneAndUpdate({room_id:room_id},{$set:{setTheme:setTheme}},{new:true})
        console.log(result)
        res.status(201).send({status:true,message:"background updated successfully",result})

    }else{
        res.status(401).send({message:"select background image"})
    }
    
}catch(err)
{
    res.send({message:"somthing is wrong"})
    console.log(err)
}
}
//settheme ended
//updategroupprogilr
exports.updateProfileGroup=async(req,res)=>{
    try{
        const {_id}=req.params
        console.log(_id)
    //    console.log(req.body.name,req.body.about,req.file.filename)
      /*  if(req.file && userid){
            
            response=await usermaster.findOneAndUpdate({_id:userid},{$set:{"profile_img":req.file.filename}},{new:true})
        }*/
        if(req.body.groupName&& _id){
            const response=await CreateGroup.findOneAndUpdate({_id:_id},{$set:{groupName:req.body.groupName}},{new:true})
            res.status(200).send({status:true,message:"Your profile update successfully",response})
           }
        else if(req.body.Groupabout&& _id){
            const response=await CreateGroup.findOneAndUpdate({_id:_id},{$set:{Groupabout:req.body.Groupabout}},{new:true})
            res.status(200).send({status:true,message:"Your profile update successfully",response})
        }
         else if(req.file&& _id){
        console.log(req.file.filename)
            const response=await CreateGroup.findOneAndUpdate({_id:_id},{$set:{group_profile_img:req.file.filename}},{new:true})
            res.status(200).send({status:true,message:"Your profile update successfully",response})
        }
         else{
            res.status(400).send({status:false,message:"No updated New"})
         }
     }
     catch(err){
        console.log("error",err)
        res.send({ErrorMessage:"somthing error",err})
        }
    }
    //end updating groupprofile

// //delete one message start

exports.deleteOneMessage=async(req,res)=>{
    try{
    const{_id}=req.body
    if(!_id){
        return res.status(406).json({status:'Failure',message:'mobilenumber and are required field'})
    }else{
        const response=await storeMsg.findOneAndDelete({_id:_id})
        if(response){
            console.log(response)
            return res.status(200).send({status:'Success',message:'message deleted successfully',response})
        }else{
            return res.status(406).json({status:'Failure',message:'message couldnot be deleted'})
        }
    }
}catch(err){
    console.log(err);
    return res.status(400).json({status:'Error',message:'somthing went wrong',err})
}
}
// //delete mesages one

////delete one message start

exports.deleteOneManyMesage=async(req,res)=>{
    try{
    const{_id}=req.body
    if(!_id){
        return res.status(406).json({status:'Failure',message:'mobilenumber and are required field'})
    }else{

        const response=await storeMsg.deleteMany({_id:{$in:_id}})
        if(response){
            console.log(response)
            return res.status(200).send({status:'Success',message:'message deleted successfully',response})
        }else{
            return res.status(406).json({status:'Failure',message:'message couldnot be deleted'})
        }
    }
}catch(err){
    console.log(err);
    return res.status(400).json({status:'Error',message:'somthing went wrong',err})
}
}
//delete mesages one
//   //chathistory started
//   exports.getChatHistoryGroup=async(req,res)=>{
//     var user_id = req.body.user_id;
//     let room_id=req.body.room_id
//     try{
//         const result= await CreateGroup.find({user_id:{$eq:user_id}},{_id:0,room_id:1})
//         console.log(result)
//         const roomIds = result.map(doc => doc.room_id);
//   console.log(roomIds);


//         /* let result2=await storeMsg.find({result1})
//          //console.log(result)
// */
//      //    db.createroomids.aggregate([{$match:{room_id:"1ba7f950-21a2-49c6-a0d5-0f8942c8a19d"}},{$lookup:{from:"storemsgs",localField:"room_id",foreignField:"room_id",as:"data"}}]).pretty()`
//     const result2= await CreateGroup.aggregate([
//         { $match: { room_id:{$in:roomIds} } },
//         {
//           $lookup: {
//             from: 'storemsgs',
//             localField: "room_id",
//             foreignField: "room_id",
//             as: "data"
//           }
//         }
//       ])
//         if( result2 )
//         {
//             res.send({status:true,message:"Get Data Succesfully",result2})
//         }
//         else{
//             res.status(401).send({message:"No Any data available"})
//         }
    
//      } catch(err)
//     {
//         res.send({message:"somthing is wrong"})
//         console.log(err)
//     }
// }
// //chat history closed
//count particepants
exports.totalParticipants=async(req,res) => {
try{
const _id=req.body._id
console.log(_id)
if(!_id){
    return res.status(400).json({status:'failuer',message:'enter the _id'})
}
else {
     const result=await CreateGroup.findOne({_id:_id},{joining_group:1,_id:0,admin_id:1})
     const result2=result.joining_group
     const result3=result.admin_id
     console.log(result2,result3)
     const response=result2.length+result3.length
     if(response){
        console.log(response)
        return res.status(200).json({status:'success',message:'count of participants',response})
     }else{
        return res.status(400).json({status:'failuer',message:'something problem'},response)
     }
}

}catch(err){
    console.log(err);
    return res.status(400).json({status:'Error',message:'somthing went wrong',err})
}
}