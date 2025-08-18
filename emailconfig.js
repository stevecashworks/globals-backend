const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // .g., 'gmail'
    auth: {
        user: 'diamondsglobal32@gmail.com',
        pass: 'chwh lhka nfrb zuvq',
    },
});

const setMailOptions = (to, html)=>{
    return {from: '"HealthSupport" <your-email@example.com>',
    to,
    subject: 'Info from HealthSupport!',
    html}
};

module.exports={transporter, setMailOptions}