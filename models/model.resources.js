const mongoose = require('mongoose')

const MindCastResourceSchema=new mongoose.Schema({
    i:{
        type:String,
    },
    userID:{
        type:String, 
    },
    description:{
        type:String,
    },
    image:{
        type:String,    
    },
    thumbnail:{
        type:String,  
    },
    duration:{
        type:String,  
    },
    interestID: {
        type: String,
    },
    resourceType:{
        type:Array,
    },
    resourceUrl:{
        type:String,
    },
    moodType:{
        type:String,
    },
    time_created:{type:Number, default:()=>Date.now()},	
    updated_at:{type:Number, default:()=>Date.now()}	
})


const MindCastResource=mongoose.model("mindCastResource", MindCastResourceSchema)

module.exports=MindCastResource