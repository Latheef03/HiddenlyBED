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
    
});
const createRoomId=mongoose.model('createRoomId',chatApplicationSchema);
module.exports={createRoomId}