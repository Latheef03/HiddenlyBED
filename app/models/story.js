const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({

    pic:{
        type:String,
           set:(icon)=>{
            if(icon){
                return icon  
            }
            return ;
        },
        required:[true,'image is required field']
    },
    placename:{
        type: String, 
        required:[true,'place name is required field']
    },
    text:{
        type:String,
        required:[true,'text is required field']
    },
    sender_id:{
        type:String,
        required:[true,'userid is required field']
    }
 
},{timestamps:true})

module.exports = mongoose.model('story', userSchema, 'story');

