const Mongoose = require("mongoose");
const {Schema} = Mongoose
const UserModel = new Mongoose.Schema({
  status:{
    type:String,
    enum:["pending", "approved"],
    default:"pending"
  },
  name: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  lastWithdrawal: {
    type: Number,
    default:0
    
  },
  pendingWithdrawal: {
    type: Number,
    default:0
  },
  password: {
    type: String,
    minLength: 8,
    required: true,
  },
  phone: {
    type: String,
  },
  earnings: {
    type:[{type:Schema.Types.ObjectId,ref:"earnings"}],
    default :[],
  },
  balance: {
    type: Number,
    default: 0,
  },
  referrals: {
   type: [{
    by:{
      type:Schema.Types.ObjectId,
      ref:"users"
    },
    amount:Number
   }],
   default: [],
  },
  referralLink:{
    type:String,
    required:true,
    unique:true

  },
  referredBy:{
    type:Schema.Types.ObjectId,
    ref:"users"
  },
  downLines:{
type:[{type:Schema.Types.ObjectId, ref:"users"}],
default:[]
  },
  // for  aesthetics
  cryptId:{
    type:String,
    required:true
  },

  activeDeposit: [{
    type: Schema.Types.ObjectId,
    ref:"investments",
    default:[]
}],
investments:[{
    type: Schema.Types.ObjectId,
    ref:"investments",
    default:[]
}],
  lastDeposit: {
    type: Number,
    
  },
  idImg:{
    type:String,
    required:true
  },
  deposits:{
    type:[{
      type:Mongoose.Schema.Types.ObjectId,
      ref:"payments"
    }],
    default:[]
  }
  ,

  walletIds: {
    ethereum:{type:String, default:"none" },
    usdt:{type:String, default:"none" },
    dogecoin:{type:String, default:"none" },
    bitcoin:{type:String, default:"none" },
  },
  totalEarnings:{
    type:Number, 
    default:0
  },
  referralBonus:{
    type:Number, 
    required:true,
    default:0,
  }
  ,
},{timestamps:true});
module.exports=Mongoose.model("users",UserModel)