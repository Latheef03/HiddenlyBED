const mongoose=require('mongoose')

const storeMsgSchema=mongoose.Schema({
    sender_id:{
        type:String,
        required:true
    },
    senderName:{
       type:String,
       required:"pls Enter name"
    },
    message:{
        type:String,
        
    },
    image:{
	type:String,
	default:''
	  },
   video:{
	type:String,
	default:''
	},
   audio:{
        type:String,
	default:''
	},
   document:{
	type:String,
	default:''
           },  
   voice_recording:{
        type:String,
	default:''
	},
    room_id:{
        type:String,
        required:true
    },
    expiresAt:{
        type: Date,
    index: { expires:0 } 
    }
    
},{ timestamps: true });

module.exports=mongoose.model('storeMsg',storeMsgSchema)
