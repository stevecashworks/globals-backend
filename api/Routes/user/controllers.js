const createCustomError = require("../../createCustomError");
const userModel = require("../../models/userModel");
const investmentModel = require("../../models/investmentModel");
const withdrawalModel = require("../../models/withdrawalModel");
const coinModel=require("../../models/coinModel.js")
const earningModel=require("../../models/earningsModel.js")
const jwt = require("jsonwebtoken")
const {differenceInHours, differenceInMinutes}= require("date-fns")
const {transporter,setMailOptions}= require("../../../emailconfig.js")
const { verify } = require("./verify.js");
const getEmailTemplate = require("../../../createEmailtemplate.js");
const generateCryptId = require("./generateCryptId.js");
const generateReferralCode=require("./generateReferralCode.js")
console.log(generateReferralCode())
const plans={
    starter:{
    bonus:10 ,duration: 24,
  },
  premium:{
    
    bonus: 25,
    duration: 48,
  },
  ultimate:{
    bonus: 35,
    duration: 72,
  },
  standard:{
    bonus: 40,
    duration: 168 ,
  },
  // {
  //   title: "Annual Plan",
  //   roi: 15 ,
  //   min: "5000 USD",
  //   max: "9999 USD",
  //   duration: "1 Year Plan",
  //   reinvestment: "Reinvestment Supported",
  // },
  corporate:{
    
    bonus: 50,
    duration: 720,
  },
}
// const siteUrl= "https://globaldiamondcapitals-e8y1.onrender.com/"
const siteUrl="http://localhost:3000/"
//  add wallet
console.log(generateCryptId())
const addWallet = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const { coin, id } = req.body;
    //   get current walletIds
    const currentUser = await userModel.findById(userId);
    console.log(currentUser);
    const { walletIds } = currentUser;
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $set: { walletIds: { ...walletIds, [coin]: id } } },
      { new: true }
    );
    return res.status(200).json({ success: true, result: updatedUser });
  } catch (error) {
    next(createCustomError(error.message));
  }
};
// addWallet

// getCoins
const getCoins = async (req, res, next) => {
  try {
    const coins = await coinModel.findById("btctrustfund");
    return res.status(200).json({ success: true, result: coins });
  } catch (error) {
    console.log(error.message);
    next(createCustomError(error.message));
  }
};
// end getcoins

//  login

const login = async (req, res, next) => {
  try{

    const { password, email } = req.body;
    let thisUser = await userModel.findOne({ email }).populate("activeDeposit").populate("investments").populate("downLines").populate("earnings");
  if (!thisUser) {
    return res.status(404).json({
      success: false,
      result: `User with email: "${email}" was not found`,
    });
  } else if (password != thisUser.password) {
    console.log(thisUser)
    return res
      .status(403)
      .json({ success: false, result: "Incorrect password" });
  } else {

   updateTransactions(thisUser)

    const token = await jwt.sign(
      { id: thisUser._id, isAdmin: thisUser.isAdmin },
      process.env.jwt_pass
    );
    const { password, ...others } = thisUser._doc;

    return res
    .status(200)
    .json({ success: true, result: { ...others, token } });
  }
  } catch(err){
    return res.status(500).json({success:false, result:err.message})
  }
};
// end login logic

// login with token logic
const loginWithToken = async (req, res, next) => {
  try{
    console.log("hello")
    const { user } = req;
  const { id } = user;
  console.log(id);
  let thisUser = await userModel.findById(id).populate("investments").populate("activeDeposit").populate("downLines").populate("earnings");
  if (!thisUser) {
    console.log("user not found");
    return res.status(404).json({ success: false, result: "user not found" });
  } else {

    
    await updateTransactions(thisUser)

    const { password, ...others } = thisUser._doc;
    
    return res.status(200).json({ success: true, result: others });
  }
  }
  catch(err){
    console.log(err.message)
    next(createCustomError(err.message))
  }
};

// login with token logic ends here

// register logic
const register = async (req, res, next) => {
  try {
    let referrer
    const {ref}= req.body
    if(ref){
      const  DBReferrer=  await  userModel.findOne({referralLink:`${siteUrl}register?ref=${ref}`})
      // console.log(DBReferrer)
      referrer=DBReferrer._id
    }

  
    const document={...req.body,
       referralLink:`${siteUrl}register?ref=${generateReferralCode()}`,
       cryptId:generateCryptId()
      }
    if(referrer){
      document.referredBy=referrer
    } 
    const newUser = await userModel.create(document);
    // add downlines if referrer exists
    if(referrer){
    await   userModel.findByIdAndUpdate(referrer,{
      $addToSet:{
        downLines:newUser._id
      }
      
    })
    }
    const token = await jwt.sign(
      { id: newUser._id, isAdmin: newUser.isAdmin },
      process.env.jwt_pass
    );
    const { password, ...others } = newUser._doc;

    return res
      .status(201)
      .json({ success: true, result: { token, ...others } });
  } catch (error) {
    next(createCustomError(error.message));
  }
};
// register logic ends here

// get stats logic
const getTotalStat = async (req, res, next) => {
  try {
    //  totals all have an initial value set to 0
    //  each stat is incremented with each iteration's amount
    let totalDeposit = 0;
    let totalWithdrawal = 0;
    const allDeposits = await investmentModel.find({ userId: req.user.id });
    allDeposits.forEach((deposit) => {
      totalDeposit += deposit.amount;
    });
    const allWithdrawals = await withdrawalModel.find({ userId: req.user.id });
    allWithdrawals.forEach((deposit) => {
      totalWithdrawal += deposit.amount;
    });
    return res
      .status(200)
      .json({ success: true, result: { totalDeposit, totalWithdrawal } });
  } catch (err) {
    next(createCustomError(err.message));
  }
};
// get stats logic ends here

// account recovery

const recoverAccount=async(req,res,next)=>{
  
  try {
    const {email}= req.body
   const thisUser= await  userModel.findOne({email})
   if(!email){
    return res.status(404).json({success:false, result:"No user was found with this email"})
   }
   else{
    const message="Please click the button below to reset your password"
    const html=getEmailTemplate(thisUser.name,message,true,"reset password",`${siteUrl}/resetpassword/${thisUser._id}`)
    await transporter.sendMail(
      setMailOptions(email,html)
    ,(err,info)=>{
      if(err){
        return res.status(500).json({success:false, result:err.message})
      }
      else{
        
        return res.status(200).json({success:true, result:"done"})

      }
    })
   }
  } catch (error) {
    next(createCustomError(error.message))
  }
}



const updateTransactions=async (user)=>{
    
    try{
      const activeInvestments= user.investments.filter((investment)=>investment.status==="active")
    const updatedTransactions= Promise.all(activeInvestments.map(async (investment)=>{
    //  await investmentModel.findByIdAndUpdate(investment._id,{
    //   $set:{status:"approved"}
    //  })

    const {plan}=investment
    
    const {duration}=plans[plan]
    console.log(duration)
    const timeDiff=differenceInHours(new Date(),investment.approvedDate)
    console.log({timeDiff})
    const timeHasElapsed=timeDiff>=duration
    if(timeHasElapsed){
      // approve the investment and credit the user with the ROI
      const updatedInvestment=await investmentModel.findByIdAndUpdate(investment._id,{$set:{status:"approved"}})
    const newEarning= await earningModel.create({
      amount:plans[plan].bonus/100*investment.amount,
      reason:`ROI from ${plan} plan`,
      investment:investment._id

      // add the earning to users totalEarnings and add the earning._id to users earnings array
    })
    const updatedUser= await userModel.findByIdAndUpdate(user._id,{$inc:{totalEarnings:newEarning.amount},$addToSet:{earnings:newEarning._id}} ) 
  }
     
    }))
      
    }catch(err){
      console.log(err.message)
      throw new Error(err.message)
    }
   
  }

const resetPassword=async(req,res,next)=>{
  try{
    const {password,id}= req.body
  

    const updatedUser=await userModel.findByIdAndUpdate(id,{$set:{password}})
    return res.status(200).json({success:true,result:updatedUser})
  }catch(err){
   next(createCustomError(err.message)) 
  }

}
const promoteUser=async(req,res,next)=>{
try {
  const updatedUser= await  userModel.findByIdAndUpdate(req.params.id,{$set:{isAdmin:true}})
  return res.status(200).json({success:true,result:updatedUser})
} catch (error) {
  next(createCustomError(error.message))
}
}

const demoteUser=async(req,res,next)=>{
  try {
    const updatedUser= await  userModel.findByIdAndUpdate(req.params.id,{$set:{isAdmin:false}})
    return res.status(200).json({success:true,result:updatedUser})
  } catch (error) {
    next(createCustomError(error.message))
  }
  }
  const deleteUser=async(req, res, next)=>{
    try{
        const {id} =req.params
         await userModel.findByIdAndDelete(id)
         return   res.status(200).json({success:true, result:"User deleted successfully"})
    }catch(err){
      next(createCustomError(err.message))
    }

  }
  const sendMessage=async(req,res,next)=>{
    try{
        const  {email,name, message}= req.body

        const html=getEmailTemplate(name,message)
        await transporter.sendMail(
          setMailOptions(email,html)
        ,(err,info)=>{
          if(err){
            return res.status(500).json({success:false, result:err.message})
          }
          else{
            
            return res.status(200).json({success:true, result:"done"})
    
          }
        })

    }
    catch(err){
      next(createCustomError(err.message))
    }
  }
  const getSingleUser=async(req,res,next)=>{
    try{
        const {id}= req.params
        const thisUser=await userModel.findById(id)
        return res.status(200).json({success:true,result:thisUser})
    }catch(err){
        next(createCustomError(err.message))
    }

  }
  const approveUser=async(req,res,next)=>{
  try{
    const {id}= req.params;
    const updatedUser= await userModel.findByIdAndUpdate(id,{$set:{status:"approved"}});
    const message=`Welcome aboard ${updatedUser.name} we are pleased to inform  you that your request has been approved`
    const html=getEmailTemplate(updatedUser.name,message)
    await transporter.sendMail(
      setMailOptions(updatedUser.email,html)
    ,(err,info)=>{
      if(err){
        return res.status(500).json({success:false, result:err.message})
      }
      else{
        
        return res.status(200).json({success:true, result:"done"})

      }
    })
    return res.status(200).json({success:true, result:"approved"})
}catch(err){
  next(createCustomError(err.message))
}

  }
  const creditUser= async(req,res,next)=>{
    try{
      const {id}= req.params
      const {amount}= req.body
      const  updatedUser= await userModel.findByIdAndUpdate(id,{$inc:{balance:amount}})
      return res.status(200).json({success:true,result:"Credited successfully"})
    }catch(err){
        next(createCustomError(err.message))
    }

  }

  const editUserBalance= async(req,res,next)=>{
    try{
      const {id}= req.params
      const {amount}= req.body
      const  updatedUser= await userModel.findByIdAndUpdate(id,{$set:{balance:amount}})
      return res.status(200).json({success:true,result:"edited successfully"})
    }catch(err){
        next(createCustomError(err.message))
    }

  }


module.exports = {
  login,
  verify,
  loginWithToken,
  register,
  getCoins,
  getTotalStat,
  addWallet,
  resetPassword,
  recoverAccount,
  promoteUser,
  demoteUser,
  deleteUser,
  getSingleUser,
  sendMessage,
  approveUser,
  creditUser,
  editUserBalance,
  
};

