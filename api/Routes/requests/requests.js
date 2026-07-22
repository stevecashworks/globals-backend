const express= require("express")
const withdrawalModel = require("../../models/withdrawalModel.js");
const createCustomError = require("../../createCustomError.js");
const userModel = require("../../models/userModel.js");
const {verify}=require("../../Routes/user/verify")
const investmentModel = require("../../models/investmentModel");


// withdraw logic starts
const  withdraw=  async(req,res,next)=>{
  try{
  const {amount,walletId, deduct_from}= req.body
  console.log({deduct_from})
  const walletMapping= {
    earnings:"totalEarnings",
    referral_bonus:"referralBonus",
    spot_balance:"balance"
   }
  const walletToDebit= walletMapping[deduct_from]
const walletBalance= await userModel.findById(req.user.id).select(walletToDebit);
console.log({walletBalance});
if(walletBalance[walletToDebit]<amount){
  return res.status(403).json({success:false, result:"insufficient funds"})
}

    const user= req.user 
const userId= user.id
const newTransaction= await withdrawalModel.create({...req.body,userId}) 

const  newUserDetails=await userModel.findByIdAndUpdate(userId,{$inc:{[walletToDebit]:(-1*amount)},$set:{pendingWithdrawal:amount,lastWithdrawal:amount}})
 return res.status(200).json({success:true,result:newTransaction})
}
catch(err){
    console.log(err.message)
    next(createCustomError(err.message))
}

    

}
// withdraw ends here


//  invest logic goes here

const invest = async (req, res, next) => {
   try {
     const userId = req.user.id;
  console.log(userId)
  console.log("hello")
  const amount=req.body.amount
  const wallet=req.body.wallet;
  const  walletMapping= {
     spot_balance:"balance",
     earnings:"totalEarnings",
     referral_bonus:"referralBonus"
  }
  const deductFrom= walletMapping[wallet]
  console.log({deductFrom, amount})
  const thisUser= await userModel.findById(userId)
  if(!thisUser){
    return res.status(404).json({success:false, result:"Issuer not found"})
  }
  if(amount>thisUser[deductFrom]){
    return res.status(403).json({success:false, result:"insufficient funds"})
  }
  
  

    const newInvestment = await investmentModel.create({ userId, ...req.body });
    await userModel.findByIdAndUpdate(userId, {
    $addToSet:{
      investments:newInvestment._id
    },
    $inc:{
      [deductFrom]:(Number(amount) * -1)

    }
    });
    res.status(200).json({ success: true, result: newInvestment });
  } catch (err) {
    console.log(err.message)
    next(createCustomError(err.message));
  }
};
//  invest logic goes here
// get Investment to re-invest

const getInvestment=async(req, res,next)=>{
  const {id}= req.params
  try{
    const   thisInvestment= await  investmentModel.findById(id)
    if(!thisInvestment){
      return res.status(404).json({success:false, result:"Investment not found"})
    }
    else{
      return res.status(200).json({success:true, result:thisInvestment})
    }
  }catch(err){
    return res.status(500).json({success:false,result:err.message})
  }

}






module.exports= {withdraw, invest, getInvestment}