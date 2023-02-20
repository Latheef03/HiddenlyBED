const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        valid:true
    },
    mobilenumber: {
        type: Number,
        valid:true,
        minlength:10,
        default:" "
    },
    qr_image:{
       type:String,
           set:(icon)=>{
            if(icon){
                return icon  
            }
            return ;
        },
        default:" "
    },
    email:{
        type:String,
        default:" "
            },
    scan_image:{
        type:String,
            set:(icon)=>{
            if(icon){
                        return icon  
                    }
                    return ;
                },
                default:" "
            },
    contactList:{
                type:Object,
                default:" "
              },
    blockContact:{
                type:Array,
                default:[]
              }
});

module.exports = mongoose.model('usermaster', userSchema, 'usermasters');

