const mongoose =require('mongoose')
const createGroupSchema=new mongoose.Schema({
    creterGroupId:{
        type:String,
        required:true
    },
    joining_group:{
        type:Object,
        required:true
    },
    room_id:{
        type:String,
        required:true
    },
    admin_id:{
        type:Object,
        required:true
    },
   group_profile_img:{
         type:String,
         default:" "
    },
	 groupName:{
        type:String
    },
    setbackground:{
        type:String,
	default:""
    },
    setTheme:{
        type:String,
        default:''
    } ,
   Groupabout:{
        type:String,
	default:""
	},
  
  autoDelete:{
        type:Date,
        //index: { expireAfterSeconds: 4 }
    },
    content_customization:{
        type:Number,
        default:''
    }
 },{ timestamps: true })

const CreateGroup=mongoose.model('createGroup',createGroupSchema)
module.exports={CreateGroup}



