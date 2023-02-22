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
         type:String
    },
	 groupName:{
        type:String
    },
   about:{
        type:String,
	default:""
	},
  
  autoDelete:{
        type:Date,
        default:''
    },
    content_customization:{
        text:{
            type:Boolean,
            default:false
        },
        voice:{
            type:Boolean,
            default:false
        },
        media:{
            type:Boolean,
            default:false
        },
        documents:{
            type:Boolean,
            default:false
        },
        attachments:{
            type:Boolean,
            default:false
        }
    }   
    
 },{ timestamps: true })

const CreateGroup=mongoose.model('createGroup',createGroupSchema)
module.exports={CreateGroup}