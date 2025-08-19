const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // .g., 'gmail'
    auth: {
        user: 'diamondsglobal32@gmail.com',
        pass: 'chwh lhka nfrb zuvq',
    },
});

const setMailOptions = (to, html)=>{
    return {from: '"Globaldiamondcapitals" <your-email@example.com>',
    to,
    subject: 'Info from Globaldiamondcapitals!',
    html}
};

module.exports={transporter, setMailOptions}