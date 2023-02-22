const {CreateGroup}=require('../models/groupchat')
const {v4 : uuidv4} = require('uuid')
//create group
exports.createGroupRoom=async(req,res)=>{
    try{
        if(req.body.user_id!='' && req.body.joining_group!='' && req.body.groupName!='' && req.body.admin_id!='')
        {
            const other_id=req.body.joining_group
            const arr=[]
            const userid=req.body.user_id
           /* other_id.forEach(async(element) => {
            //console.log(typeof element)
            var result=await usermaster.findOne({mobilenumber:element},{mobilenumber:1,name:1})
	        if(result)
                    arr.push(result)	
	       else{
          	      return res.status(400).json({status:"Failure",message:"this member is not exist in our contacts"})
                  }
            })
           
        result=await usermaster.findOne({mobilenumber:req.body.user_id},{mobilenumber:1,name:1})
        if(result)
           arr.push(result)
     */
        //const result1=await usermaster.find({mobilenumber:{$in:other_id}},{name:1,mobilenumber:1,profile_img:1,about:1})
        //console.log(result1)
	const room_id=uuidv4()
        const group=new CreateGroup({
            groupName:req.body.groupName,
            creterGroupId:req.body.user_id,
            joining_group:other_id,
            admin_id:[req.body.user_id],
            room_id:room_id
        });
        const response=await group.save()
            if(response){
               /* const mobilenumber=response._id
                const name=response.groupName
                const obj=new usermaster({
                    name:name,
                    mobilenumber:mobilenumber,
		    otpvalue:true
                })*/
            //const result1=await obj.save()
            //if(result1){
                res.status(200).send({status:"Success",message:"Group Created Successfuly",response})
           // }
          }
        }
        else{
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
        const groupid=req.params._id
        const other_id=req.body.other_id
    
        const result=await CreateGroup.findOne({_id:groupid})
         console.log(result)
    
         const arr=result.joining_group
    //    console.log(result)
        const newJoiningGroup=arr.filter(element=>{
            if(other_id!=element.mobilenumber){
                //console.log(other_id,"=",element)
                return element
            }
        })
        console.log(newJoiningGroup)
        const response=await CreateGroup.findByIdAndUpdate({_id:groupid},{$set:{joining_group:newJoiningGroup}},{new:true});
        if(response){
           res.status(201).send({status:"Success",message:response})
        }
        else{
            res.status(401).send({status:"Failure",message:"Somthing problem in doning updating group"})
        }
       }
       catch(err){
           console.log(err)
           res.send({message:"somthing problem",err})
       }
    }
      //End remove person of group
    
  //end add person in a group
  //Delete Member in group
exports.deleteGroupMember=async(req,res)=>{
    try{
    const groupid=req.params._id
    const other_id=req.body.other_id

    const result=await CreateGroup.findOne({_id:groupid})
     console.log(result)

     const arr=result.joining_group
//    console.log(result)
    const newJoiningGroup=arr.filter(element=>{
        if(other_id!=element.mobilenumber){
            //console.log(other_id,"=",element)
            return element
        }
    })
    console.log(newJoiningGroup)
    const response=await CreateGroup.findByIdAndUpdate({_id:groupid},{$set:{joining_group:newJoiningGroup}},{new:true});
    if(response){
       res.status(201).send({status:"Success",message:response})
    }
    else{
        res.status(401).send({status:"Failure",message:"Somthing problem in doning updating group"})
    }
   }
   catch(err){
       console.log(err)
       res.send({message:"somthing problem",err})
   }
}
  //End remove person of group
