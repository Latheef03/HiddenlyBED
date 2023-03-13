
const story = require ('../models/status')

exports.addstory = async (req, res) => {
    try{
        if(req.file){
            const data = new story ({
                sender_id:req.body.sender_id,
                text:req.body.text,
                pic:req.file.filename,
                placename:req.body.placename
                 })
            const result = await story.create(data)
            return res.status(200).json({Status:true,result})
        }
        else{
            return res.status(406).json({Status:false,message:"Please choose img"})
        }
     }catch(err){
        console.log('err',err.message);
        const Error={}
        if(err.message.includes(' validation failed')){
            Object.values(err.errors).forEach(properties=>{
                    Error[properties.path]=properties.message
            })
        }
        return res.status(400).json({Status:'Error',Error})
     } 
};
exports.getstory = async (req, res) => {
    try {
        const{sender_id}=req.body
        const user = await story.findOne({sender_id:sender_id});
        res.status(200).json(user);
    } catch(error) {
        res.status(404).json({ message: error.message});
    }
};


exports.getAllStory=async(req,res)=>{
    try{

        const user = await story.find();
        res.status(200).send(user);

    }catch(error) {
        res.status(404).json({ message: error.message});
    }
}