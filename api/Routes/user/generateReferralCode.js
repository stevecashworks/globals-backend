const generateReferralCode=()=>{
    const Alpha="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let str= ""
    for(let i=0; i<6; i++){
        str+=Alpha[Math.floor(Math.random()*Alpha.length)]
    }
    return str
}
module.exports=generateReferralCode