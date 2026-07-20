const express = require("express");
const cors = require("cors");
const connect_Db = require("./connectdb");
const dotenv = require("dotenv");
//  user Functions

//  admin functions


//  request functions

const userRouter = require("./Routes/user/userRoute");
const handleError = require("./error");
const requestRoute = require("./Routes/requests/requestRoute.js");
const adminRouter = require("./Routes/admin/route.js");
const paymentRouter= require("./Routes/payments/paymentRoute.js")
const userModel = require("./models/userModel.js");
const investmentModel = require("./models/investmentModel.js");
const withdrawalModel = require("./models/withdrawalModel.js");
const coinModel= require("./models/coinModel.js")
dotenv.config();
const server = express();
server.use(cors());
server.use(express.json());
server.use("/users", userRouter)
server.use("/admin", adminRouter)
server.use("/requests", requestRoute)
server.use("/payments", paymentRouter)
const transporter = require("../mailer.js");

//  user routing optimized to fit with vercel's free tier serverless function count polic
// server.post("users/login", login);
// server.post("users/register", register);
// server.get("users/getcoins", getCoins);
// server.post("users/tklogin", verify, loginWithToken);
// server.post("users/getstats", verify, getTotalStat);
// server.post("users/addwallet", verify, addWallet);

// end user Routing

// start admin routing optimized

// server.post("admin/editcoin", verifyAdmin, editCoin);
// server.post("admin/getStats", verifyAdmin, getStats);
// server.post("admin/getinvestments", verifyAdmin, getInvestments);
// server.post("admin/getwithdrawals", verifyAdmin, getWithdrawals);
// server.post("admin/approvewithdrawal/:id", verifyAdmin, approveWithdrawal);
// server.post("admin/declinewithdrawal/:id", verifyAdmin, declineWithdrawal);
// server.post("admin/approveinvestment/:id", verifyAdmin, approveDeposit);
// server.post("admin/declineinvestment/:id", verifyAdmin, declineInvestment);

//  end admin route

//  request route
// server.post("requests/withdraw", verify, withdraw);
// server.post("requests/invest", verify, invest);


// server.get("/", (req, res) => {
//   res.json("Okay")
// });
server.use(handleError);
const mongo_uri = process.env.local_mongo;
const port = process.env.PORT || 5000;

server.get("/", (req, res, next) => {
  res.status(200).send("developed by me");
})
server.get("/test-email", async (req, res) => {
    try {
        const info = await transporter.sendMail({
            from: `"Northflank Test" <${process.env.SMTP_USER}>`,
            to: "chigbustephennamdi@gmail.com",
            subject: "SMTP Test",
            text: "If you're reading this, SMTP is working!",
            html: "<h2>🎉 SMTP is working!</h2>"
        });

        res.json({
            success: true,
            messageId: info.messageId,
            response: info.response
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            error: err.message,
            code: err.code,
            command: err.command
        });
      }
})

  
  const removeStaleEntries=async(model)=>{
    try{
      const  thisDocument= await model.find()
      const updatedDocument= await Promise.all(
        thisDocument.map(async(doc)=>{
         const user= await  userModel.findById(doc.userId)
         if(!user){
          await model.findByIdAndDelete(doc._id)
         } 
        })
      )

      console.log("model refresh was successful")
    }catch(err){
    console.log(err.message)
    }
  }
  // removeStaleEntries(withdrawalModel)

  // ||-------------------------------------------------------||
  // || Here are the database Migrations for the real server  ||
  // ||-------------------------------------------------------||
  // 


  // referralBonus number, default:0
  // totalEarnings number, default:0
  // investments array, default []
  // downlines array, default []
  // referral link, partly unique
  const migrateDatabase=async ()=>{
 try{
  const allUsers= await userModel.find()
  const updatedUsers= Promise.all(allUsers.map(async (x)=>{
    try{

      const updatedUser=await  userModel.findByIdAndUpdate(x._id, {$set:{investments:[]}},{new:true})
      console.log(updatedUser)
    }
    catch(err){
      console.log(err.message)
    }

  }))

 }catch(err){
  console.log(err.message)
 } 
}
const startServer = async () => {
  try {
    await connect_Db(mongo_uri);
    
  //  migrateDatabase()
    // await userModel.updateMany({},{$set:{stautus:"approved"}})
    server.listen(port, () => {
      console.log(`Server is actively listening on port ${port}`);
    });
  } catch (error) {
    console.log(error.message);
  }
};

startServer();
