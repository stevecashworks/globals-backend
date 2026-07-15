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
    }
 })
 module.exports= EarningSchema
//  earningSchema should be used to track earnings