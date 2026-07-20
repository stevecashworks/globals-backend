const {Router} = require("express")
const { withdraw, invest, getInvestment } = require("./requests.js");
const { verify } = require("../user/verify.js");


const requestRouter= Router()

requestRouter.post("/withdraw",verify, withdraw)
requestRouter.post("/invest",verify, invest)
requestRouter.get("/getinvestment/:id",getInvestment)

module.exports=requestRouter