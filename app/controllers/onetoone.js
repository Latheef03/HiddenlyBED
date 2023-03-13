const {createRoomId}=require('../models/onetoone')
const {CreateGroup}=require('../models/groupchat')
const storeMsg=require('../models/storeMessage')
const usermaster=require('../models/registration')
const schedule = require('node-schedule')
const {v4 : uuidv4} = require('uuid')
const { set } = require('mongoose')



//get all contact
exports.getContact=async(req,res)=>{
    try{
        const {mobilenumber,contactList}=req.body
        const result= await usermaster.find({mobilenumber:mobilenumber},{_id:1,mobilenumber:1});
        if( result.length!=0)
        {
            res.send({status:true,message:"Get Data Succesfully",result})
        }
        else{
            res.status(401).send({message:"No Any data available"})
        }
    }
    catch(err)
    {
        res.send({message:"somthing is wrong"})
    }
}
//End loading contact 

//roomId created by userid and otherid
exports.createroom=async(req,res)=>{
    try{
      let userid=req.body.user_id;
      let otherid=req.body.other_id;
      if(!userid|| !otherid){
          res.send({ErrorMessage:"Please Before Provide user_id and other_id"})
         }
      else{
	 console.log(userid,typeof userid ,otherid,typeof otherid)
	if(userid.length>10){
           let l = userid.length 
           if(l===12){
               userid = userid.substring(2)
           }
           else if(l===13){
                userid = userid.substring(3)
           }
        }
	//console.log(userid,otherid)
        if(otherid.length>10){
            let l = otherid.length 
            if(l===12){
                otherid = otherid.substring(2)
            }
            else if(l===13){
                otherid = otherid.substring(3)
            }
        }
	console.log(otherid,userid)
        var response=await createRoomId.find({
              $or:[{user_id:userid,other_id:otherid},{user_id:otherid,other_id:userid}]
        });
        if(response.length!=0){
	   console.log(response)
            res.status(200).send({status:"Success",message:"room created",response})
        }

        else{
           const room_id=uuidv4()
           const user=new createRoomId({
            user_id:userid,
            other_id:otherid,
            room_id:room_id.toString()
           })
          const result=await user.save();
           if(result)
           {
		console.log(result)
		let response=[result]
                res.send({status:"Success",message:"room created",response})
           }
           else{
               res.send({ErrorMessage:"some technical issue"})
           }
        }
      }
    }
    catch(err){
        console.log("room err",err)
        return res.status(400).send({ErrorMessage:"somthing error"})
    }
} 
//End  api of created roomid

//Store message api 
exports.storeMessage=async(req,res)=>{
    try{
        const otherid=req.body.sender_id
        const name=req.body.senderName
        const msg=req.body.msg
        const roomid=req.body.room_id
	if(!otherid ||!name || !roomid){
		res.status(406).json({message:"sender_id ,senderName,room_id"})
	}
	else{
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
     }
    }
    catch(err){
        return res.status(400).send({ErrorMessage:"Somthing Wrong"})
    }
}
//end store message api

//loadin message in chatRoom
exports.getmessage=async(req,res)=>{
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
exports.saveImageFile=async(req,res,next)=>{
    try{
	console.log(req.file)
	const file1=req.file.mimetype
        if(req.file){
            const otherid=req.body.sender_id
            const name=req.body.senderName
	    let image="";
	    let video="";
	    if(file1==='image/png'||file1==='image/jpg'||file1==='image/jpeg'||file1==='image/gif')
		{
                  image=req.file.filename
		}
	   else if (file1==='video/mp4'||file1==='video/mpeg'||file1==='video/ogg'||file1==='video/quicktime'){
		video=req.file.filename	
	       }
            const roomid=req.body.room_id
	    const msg=req.body.message
	   
	    const store=storeMsg({
                sender_id:otherid,
                senderName:name,
                image:image,
                room_id:roomid,
		message:msg,
		video:video,
		audio:'',
		document:''
            })
            const result= await store.save();
            if(result)
            {
                res.send({status:"Success",message:"Image Uploaded Successfully",result})
            }
        }
        else{
            res.send({ErrorMessage:'Please choose image'})
        }
    }
    catch(err){
        res.send({ErrorMessage:"Somthing Error",err})
    }
}
//end image sending


exports.saveVideoFile=async(req,res,next)=>{

    try{
        console.log(req.file)
        if(req.file){
            const otherid=req.body.sender_id
            const name=req.body.senderName
            const video=req.file.filename
            const roomid=req.body.room_id
            const msg=req.body.message
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
            res.send({ErrorMessage:'Please choose image and video file'})
        }
    }
    catch(err){
        res.send({ErrorMessage:"Somthing Error",err})
    }
}
//end video sending
  //sent Images
exports.saveAudioFile=async(req,res,next)=>{

    try{
        console.log(req.file)
        if(req.file){
            const otherid=req.body.sender_id
            const name=req.body.senderName
            const audio=req.file.filename
            const roomid=req.body.room_id
            const msg=req.body.message
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
exports.saveLiveAudioFile=async(req,res,next)=>{

    try{
        console.log(req.file)
        if(req.file){
            const otherid=req.body.sender_id
            const name=req.body.senderName
            const audio=req.file.filename
            const roomid=req.body.room_id
            const msg=req.body.message
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
exports.saveDocumentFile=async(req,res,next)=>{

    try{
        console.log(req.file)
        if(req.file){
            const otherid=req.body.sender_id
            const name=req.body.senderName
            const document=req.file.filename
            const roomid=req.body.room_id
            const msg=req.body.message
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
        }
        else{
            res.send({ErrorMessage:'Please Document file only image'})
        }
    }
    catch(err){
        res.send({ErrorMessage:"Somthing Error",err})
    }
}
//End uploading Document file
exports.saveCameraFile=async(req,res,next)=>{

    try{
        console.log(req.file)
        if(req.file){
            const otherid=req.body.sender_id
            const name=req.body.senderName
            const audio=req.file.filename
            const roomid=req.body.room_id
            const msg=req.body.message
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
exports.clearChat=(req,res)=>{
    
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


exports.filteringContact = async(req,res)=>{
    try{
        const {user_id,allContacts} = req.body
        if(!user_id && allContacts && allContacts.length===0){
            return res.status(406).send({status:'Failure',message:'user_id and allContacts are required fields'})
        }else{
            let arraycontact = getAllContactNumber(allContacts)
	    const allcontacts = remove91Number(allContacts)
            const registercontactlist = await usermaster.find({mobilenumber:{$in:arraycontact}})
            if(registercontactlist.length===0){
                return res.status(200).send({status:'Success',contact:[],invite:allcontacts})
            }else{
                let userdata = await usermaster.findOne({mobilenumber:user_id})
                let {contact,invite} = registerAndInvite(userdata.blockContact,user_id,registercontactlist,allcontacts)
                userdata.contactList = contact
                await userdata.save()
                return res.status(200).send({status:'Success',contact,invite})
            }
        }
    }catch(err){
        console.log(err);
        return res.status(400).send({status:'Failure',message:'sorry! somthing went wrong'})
    }
  }
  //contact filtering contact end

  //chathistory started
exports.getChatHistory=async(req,res)=>{
    var user_id = req.body.user_id;
    try{
        const result= await createRoomId.find({user_id:{$eq:user_id}},{_id:0,room_id:1,other_id:1})
        console.log(result)
        const other_id1 = result.map(doc => doc.other_id);
       console.log(other_id1);
        const result1=await CreateGroup.find({user_id:{$eq:user_id}},{_id:0,room_id:1,joining_group:1,admin_id:1})
        console.log(result1)
        const joining_groups = result1.map(doc => doc.joining_group);
        console.log(joining_groups);
        const admin_ids = result1.map(doc => doc.admin_id);
        console.log(admin_ids);
        const other_ids=joining_groups.concat(admin_ids)
        console.log(other_ids)
        const roomIds = result.map(doc => doc.room_id);
  console.log(roomIds);
  
            const roomIds1=result1.map(doc => doc.room_id)
        console.log(roomIds1)
        /* let result2=await storeMsg.find({result1})
         //console.log(result)
*/
     //    db.createroomids.aggregate([{$match:{room_id:"1ba7f950-21a2-49c6-a0d5-0f8942c8a19d"}},{$lookup:{from:"storemsgs",localField:"room_id",foreignField:"room_id",as:"data"}}]).pretty()`
   
     const result2 = await createRoomId.aggregate([
        {
          $match: {
            other_id: { $in: other_id1 },
            room_id: { $in: roomIds }
          }
        },
        {
          $lookup: {
            from: "storemsgs",
            localField: "room_id",
            foreignField: "room_id",
            as: "data"
          }
        },
        {
          $lookup: {
            from: "usermasters",
            localField: "other_id",
            foreignField: "mobilenumber",
            as: "otherdata"
          }
        }
    ])
      
     console.log(result2)
     const result3 = await CreateGroup.aggregate([
        {
          $match: {
            room_id: { $in: roomIds1 },
          }
        },
        {
          $lookup: {
            from: 'storemsgs',
            localField: 'room_id',
            foreignField: 'room_id',
            as: 'data'
          }
        }
      ]);
      
     console.log(result3)
 
      const result4=result2.concat(result3)
     console.log(result4)
// const response = await usermaster.find({mobilenumber:other_id1},{mobilenumber:1,profile_img:1,_id:0})
      
//       console.log(response)
        if( result4)
        {
            res.send({status:true,message:"Get Data Succesfully",result4})
        }
        else{
            res.status(401).send({message:"No Any data available"})
        }
    
     } catch(err)
    {
        res.send({message:"somthing is wrong"})
        console.log(err)
    }
}
//chat history closed
//view contact has started
exports.viewContact=async(req,res)=>{
    try{
        const {other_id}=req.body
        const response = await usermaster.findOne({mobilenumber:other_id})
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
//view contact ended

//setbackgroun started
exports.setbackground=async(req,res)=>{
    try{
        const {room_id}=req.body
        if(req.file&&room_id){
        setbackground=req.file.filename
        const result= await createRoomId.findOneAndUpdate({room_id:room_id},{$set:{setbackground:setbackground}},{new:true})
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
exports.setTheme=async(req,res)=>{
    try{
        const {room_id,setTheme}=req.body
        if(room_id){
        const result= await createRoomId.findOneAndUpdate({room_id:room_id},{$set:{setTheme:setTheme}},{new:true})
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
//settheme ended
//deleteroom started
exports.deleteRoom=async(req,res)=>{
    try{
        const roomid=req.params.roomid
        if(roomid){
        const result= await createRoomId.findOneAndDelete({room_id:roomid})
        console.log(result)
        res.send({status:true,message:"room deleted successfully",result})

    }else{
        res.status(401).send({message:"can not be deleted pls check"})
    }
    
}catch(err)
{
    res.send({message:"somthing is wrong"})
    console.log(err)
}
}
//deleteroom ended



//sendConact started
exports.sendContact=async(req,res)=>{
    try{
        const roomid=req.body.roomid
        if(roomid){
        const result= await createRoomId.findOne({room_id:roomid})
        console.log(result)
        if(result){
            if(req.file){
                const otherid=req.body.sender_id
                const name=req.body.senderName
                const image=req.file.filename
            }
        }
        res.send({status:true,message:"room deleted successfully",result})

    }else{
        res.status(401).send({message:"can not be deleted pls check"})
    }
    
}catch(err)
{
    res.send({message:"somthing is wrong"})
    console.log(err)
}
}
//sendContact ended
//chathiddenly started
exports.chathiddenly=async(req,res)=>{
        try {
            // Schedule the job to delete old messages
            const job = schedule.scheduleJob(new Date(Date.now() + 24 * 60 * 1000), async function() {
              try {
                const cutoffDate = new Date(Date.now() - 24 * 60 * 1000); // 2 minutes ago
                const result = await storeMsg.deleteMany({ createdAt: { $gte: cutoffDate } });
                console.log(`Deleted ${result.deletedCount} chat Hiddenly is activated, The after 24hrs messages will be dissapear`);
              } catch (err) {
                console.error(err);
              }
            });
            // Respond with success message
            res.status(200).json({ message: 'chat Hiddenly is activated, The after 24hrs messages will be dissapear',result});
        
          } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error starting scheduled job.' });
          }
        };
//chathiddenly started  
//common group started
exports.commonGroup=async(req,res)=>{
    try{
const {sender_id,other_id}=req.body
console.log(sender_id,other_id)
const query = {
   
          $and: [
           { joining_group: { $in: [sender_id, other_id] }},
           { admin_id: { $in: [sender_id, other_id] }}
           ]
        }
  const results = await CreateGroup.find(query).exec();
  console.log(results)
  res.send({status:true,message:"room fetched successfully",results})
    }catch(err)
    {
        res.status(400).send({message:"somthing is wrong"})
        console.log(err)
    }
}
//common group ended