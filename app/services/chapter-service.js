const databaseConfig = require('../../config/database.config');
const { db } = require('../models/registration');
const Users = require('../models/registration');
 
class studyMaterialServie{


  async createAccount(data){
    try{
       return await Users.create(data)
    }catch(err){
      console.log('create service ',err);
      throw err
    }
}
async findOneAndUpadate(mobilenumber,qr_image,email){
  try{
    const data =await Users.findOneAndUpdate({mobilenumber:mobilenumber},{$set:{qr_image:qr_image,email:email}})
    if(data){
      return data;
    }
    else{
      return false;
    }
}catch(err){
  console.log('service error',err);
  throw err
}
}
async findOneAndUpadate1(mobilenumber,scan_image){
  try{
    const data =await Users.findOneAndUpdate({mobilenumber:mobilenumber},{$set:{scan_image:scan_image}})
    if(data){
      return data;
    }
    else{
      return false;
    }
}catch(err){
  console.log('service error',err);
  throw err
}
}


    async findByMobileNumber(mobilenumber){
        try{
             const data = await Users.findOne({mobilenumber:mobilenumber})
             if(data){
               return data;
             }
             else{
               return false;
             }
        }catch(err){
           console.log('service error',err);
           throw err
        }
      }
      async findByEmail(email){
        try{
             const data = await Users.findOne({email:email})
             if(data){
               return data;
             }
             else{
               return false;
             }
        }catch(err){
           console.log('service error',err);
           throw err
        }
      }
      async findByEmail(email){
        try{
             const data = await user.findOne({email:email})
             if(data){
               return data;
             }
             else{
               return false;
             }
        }catch(err){
           console.log('service error',err);
           throw err
        }
      }
      async findAccount(email){
        try{
             const data = await Users.findOne({email:email})
             if(data){
               return data;
             }
             else{
               return false;
             }
        }catch(err){
           console.log('service error',err);
           throw err
        }
   }
   async findLoginAccount(mobile,pass){
    try{
    return await Users.findOne({mobilenumber:mobile,password:pass})
  }catch(err){
      throw err
  }
  }

  async findImage(mobilenumber){
    try{
      const data = await Users.findOne({mobilenumber:mobilenumber},{_id:0,qr_image:1})
      console.log(data)
      return data.qr_image
      
 }catch(err){
    console.log('service error',err);
    throw err
 }
  }
  async findUser(_id){
    try{
      const data =await Users.findOne({_id:_id},{_id:0,mobilenumber:1})
      return data.mobilenumber
  }catch(err){
    console.log('service error',err);
    throw err
  }
  }
     
}

module.exports = new studyMaterialServie()
