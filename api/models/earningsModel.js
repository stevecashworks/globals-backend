 const {Schema, model}= require("mongoose")

 const EarningSchema=  new Schema({
    date:{
        type:Date,
        default:Date.now()
    },
    amount:{
        type:Number,
        required:true
    },
    reason:{
        type:String,
        required:true
    },
    investment:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"investments"
    }

 })
 const earningModel=model("earnings", EarningSchema)
 module.exports= earningModel
//  earningSchema should be used to track earnings