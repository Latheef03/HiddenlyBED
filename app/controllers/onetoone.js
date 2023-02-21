const {createRoomId}=require('../models/onetoone')
const storeMsg=require('../models/storeMessage')
const usermaster=require('../models/registration')
const {v4 : uuidv4} = require('uuid')



//get all contact
exports.getContact=async(req,res)=>{
    try{
var id = req.body.user_id;
const result= await usermaster.find({mobilenumber:{$ne:id}},{_id:1,mobilenumber:1});
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


   //filtering contact
      /*const filteringContact=async(req,res)=>{
       try{
        if(!req.body){
            res.sed({message:"No Any Data Found from body "})
        }
	//console.log("shivchand",req.body.allContacts)
        if(req.body.allContacts.length>0){
            const arr=req.body.allContacts
	    //console.log(arr)
	    const userid=req.body.user_id
            const contact =[]
	    const invite=[]
            for(let i=0;i<arr.length;i++){
                let element=arr[i]
		let obj=element
		let number = element.number
		console.log("length",typeof number,element)
		if(number!=undefined){
                   if(number.length>10){
                      let length = number.length
		   // console.log("-------->l",length)
                    if(length===12){
                        number = number.substring(2)
                    }
                    else if(length===13){
                        number = number.substring(3)
                    }
                   }
		}
		//console.log(element.number)
                const result=await usermaster.findOne({mobilenumber:number})
                    if(result && result.mobilenumber!=userid)
			{
			obj.number = number
		  	obj.about=result.about ||""
                        obj.profile_img=result.profile_img||""
			obj.block=false
			 contact.push(obj)

			}
			else if(obj.number!=userid){
			     invite.push(obj)
			    }
   	                    //contact.push(element)
            }
        
            //console.log(contact)
             if(contact.length!=0||invite.length!=0){
                 console.log("success",contact,invite)
		 await usermaster.updateMany({mobilenumber:userid},{$set:{contactList:contact}})
               res.send({status:"Success",contact,invite})
               }
	   else{
		res.send({status:"Failure",message:"No Any Contact here"})

		}
            
        }
        else{
            res.send({status:"Failure",message:"Please Provide Contact List"})
        }
    }


catch(error){
console.log(error)
        res.send({status:"Failure",message:"Somthing Error"})
    }
   }*/
  
    //filtering contact start
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

  

 //Block Contact START
exports.blockContact = async(req,res)=>{
    try{
        const {user_id,other_number} = req.body
        if(!user_id || !other_number){
            return res.status(406).json({status:'Failure',message:'user_id and other_number are required field'})
        }else{
            const user = await usermaster.findOne({mobilenumber:user_id})
            //console.log(user);
            let {contactList,blockContact} = user
            //let contactlist = [];
            let obj = {};
            let list = contactList.filter(data=>{
                if(data.number===other_number){
                    data.block=true
                    obj = {...data}
                }else{
                    return data
                }
            })
            console.log("obj",obj);
            console.log("list",list,blockContact);
            if(Object.keys(obj).length!=0){
                //console.log("sklgj;lajgh;lash......");
                obj.block=true
                user.blockContact.push(obj)
                user.contactList = list
                await user.save()
            }else{
                console.log("else condition",blockContact);
                obj = blockContact.find(v=>{
                    console.log("v condition");
                    return v.number===other_number
                })
                console.log(obj);
                if(Object.keys(obj).length!=0){
                    console.log("block",obj);
                    list = [...list,obj]
                    //user.blockContact.pull(obj)
                    await usermaster.updateOne( {mobilenumber:user_id},{ $pull: {blockContact:obj}});
                    obj.block=false
                    user.contactList = list
                    await user.save()
                }
            }
            if(Object.keys(obj).length!=0){
                let message = (obj.block===true)?"contact block successfully":"contact unblock successfully"
                return res.status(200).json({status:'Success',message:message,obj})
            }else{
                return res.status(200).json({status:'Failure',message:'Some Technical Issue'})
            }
        }

    }catch(err){
        console.log(err);
        return res.status(400).json({status:'Error',message:'somthing went wrong'})
    }
}
//Block Contact END
 

  
   //filter ten digit start
   function findTenDigitNumber(number){
    if(number!=undefined){
        if(number.length>10){
            if(number.length===12)
                number = number.substring(2)
            else if(number.length===13)
                number = number.substring(3)
        }
    }
    return number;
 }
 //filtering ten digit end

  //Remove 91 number form the contact Number START
  const remove91Number = (allContacts) =>{
    let allcontact = allContacts.map(data=>{
         data.number = findTenDigitNumber(data.number)
         return data
    })
    return allcontact
  }
  //Remove 91 number form the contact Number START

  //GetAllContact Number START
   const getAllContactNumber = (contactList) =>{
         let contact = contactList.map(obj=>findTenDigitNumber(obj.number))
         return contact
   }
  //GetAllContact Number END

  