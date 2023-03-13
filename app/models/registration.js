const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        valid:true
    },
    mobilenumber: {
        type: Number,
        // valid:true,
        // max:10000000000,
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
            profile_img:{
                type:String,
                default:""
                },
    about:{
                type:String,
                default:""
                 },
    contactList:{
                type:Object,
                default:" "
              },
    blockContact:{
                type:Array,
                default:[]
              },
    isActive1:{
        type:Number,
        default:" "
    },
    isActive0:{
        type:Number,
        default:" "
    }
},{ timestamps: true });

module.exports = mongoose.model('usermaster', userSchema, );
