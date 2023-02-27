const mongoose =require('mongoose')
const chatApplicationSchema=mongoose.Schema({
    user_id:{
        type:String,
	//required:true
        
    },
    other_id:
    {
        type:String,
	//required:true
        
    },
    room_id:
    {
        type:String,
        require:true,
        unique:true
    },
    setbackground:{
        type:String,
	default:''
    },
    setTheme:{
        type:String,
        default:''
    }
});
const createRoomId=mongoose.model('createRoomId',chatApplicationSchema);
module.exports={createRoomId}