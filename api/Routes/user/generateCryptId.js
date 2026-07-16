 function generateCryptId(length=12){
    const alphaNum= "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const dots= "................................"
    const RandomChars=()=>{
        let str=""
        for(let i=0; i<4; i++){
            str+= alphaNum[Math.floor(Math.random()*alphaNum.length)]
        }
        return str

    }
    return`${RandomChars()}${dots}${RandomChars()}`
}
module.exports=generateCryptId