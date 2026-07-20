const createCustomError = require("../../createCustomError")
const paymentModel=require("../../models/payment")
const tripsModel= require("../../models/trips.js")
const contributionModel= require("../../models/contribution.js")
const insuranceModel= require("../../models/insurance.js")
const covid19BenefitsModel= require("../../models/covid19benefits.js")
const medicalSupportModel= require("../../models/medicalsupport.js")
const userModel = require("../../models/userModel.js")
const getEmailTemplate= require("../../../createEmailtemplate.js")
const sendEmail= require("../../../sendMail.js")


const createPayment= async(req,res,next)=>{
        try{
            const userId= req.user.id
            console.log(req.body)
            const newPayment= await paymentModel.create({...req.body,user:userId})
            return res.status(201).json({success:true, result:"We have recieved your payment, please wait while we process your payment" })
        }catch(err){
            next(createCustomError(err.message))
        }
}

const approvePayment=async(req, res,next)=>{
const paymentId= req.params.paymentId
try{
    const thisPayment= await paymentModel.findById(paymentId).populate("user")
    console.log({thisPayment})
    if(!thisPayment){
        return res.status(200).json({success:false, result:"Payment not found"})
    }
    if(thisPayment.status==="approved"){
        return res.status(403).json({
            success: false,
            result:"This payment has already been approved"
    })
    
}
else{
       const html = getEmailTemplate(
  thisPayment.user .name,
  `
  Good news! Your deposit has been successfully approved.

  An amount of <strong>${thisPayment.amount}</strong> has been credited to your Spot Balance.

  Your updated balance is now available in your account, and the funds are ready for use.

  Thank you for choosing Global Diamond Capital.
  `,
  false
);
    await sendEmail({
        to:thisPayment.user.email,
        name:thisPayment.user.name,
        subject: "credit alert",
        text: "Your payment has been approved.",
        html

    })
    return res.status(200).json({success:true, result:"testing email client"})
    const  updatedPayment= await paymentModel.findByIdAndUpdate(paymentId,{$set:{status:"approved"}},{new:true})

    const updatedUser=await userModel.findByIdAndUpdate(updatedPayment.user,{
        $inc:{balance:updatedPayment.amount},
        
        $pushToSet:{
            deposits: updatedPayment._id,
            payments:updatedPayment._id
        }
    })
    if(updatedUser.referredBy){
        
    await userModel.findByIdAndUpdate(updatedUser.referredBy,{
        $addToSet:{
            referrals:{
                by:updatedPayment.user,
                amount :updatedPayment.amount*0.05
            },
           
        },
         $inc:{
                referralBonus:updatedPayment.amount*0.05
            }
        
    })

    }
 
    return res.status(201).json({success:true, result:"approved successfully"})
}


}catch(err){
    console.log(err)
    next(createCustomError(err.message))
}
}

const getInsurance=async(req,res,next)=>{
    try{
        const userId= req.user.id

        const myInsuranceList= await insuranceModel.find({user:userId}).populate("payment")
        return res.status(200).json({success:true, result:myInsuranceList})
    }
    catch(err){
        next(createCustomError(err.message))
    }
}
const getContributions=async(req,res,next)=>{
    try{
      const allContributions= await contributionModel.find({}).populate(["user","payment"])
      return res.status(200).json({success:true,result:allContributions})
    }
    catch(err){
        next(createCustomError(err.message))
    }
}
const createTrip=async(req,res,next)=>{
    try{
         const user= req.user.id
         
         const newTrip = await tripsModel.create({user,...req.body})
         return res.status(200).json({success:true, result:newTrip})
    }catch(err){
        next(createCustomError(err.message))
    }
}
const getMytrips=async(req,res,next)=>{
    try{
        const user= req.user.id
        const myTrips= await tripsModel.find({user})
        return res.status(200).json({success:true, result:myTrips})

    }catch(err){
        next(createCustomError(err.message))
    }
}
const getAllTrips=async(req,res,next)=>{
    try{
        const allTrips= await tripsModel.find().populate(["user","payment"])
        return res.status(200).json({success:true, result:allTrips})
    }catch(err){
        next(createCustomError(err.message))
    }
}
const editTrip=async(req,res,next)=>{
    try {
        const  tripId= req.params.id
        const updatedTrip= await tripsModel.findByIdAndUpdate(tripId,{$set:req.body})
        return res.status(200).json({success:true, result:"edited successfully"})
    } catch (error) {
        next(createCustomError(error.message))
    }
}
// refresh github
module.exports={
    createPayment,
    approvePayment,
    getInsurance,
    getContributions,
    createTrip,
    getMytrips,
    getAllTrips,
    editTrip
}