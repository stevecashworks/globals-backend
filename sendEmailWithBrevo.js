  const { BrevoClient } = require("@getbrevo/brevo");

const sendEmailWithBrevo = async ({ to, name, subject, html }) => {

try{

async function main() {
    const client = new BrevoClient({
        apiKey: process.env.brevo_api_key,
    });
    await client.transactionalEmails.sendTransacEmail({
        htmlContent: "<html><head></head><body><p>Hello,</p>This is my first transactional email sent from Brevo.</p></body></html>",
        sender: {
            email: "globaldiamond26@gmail.com",
            name: "globadldiamondcapital",
        },
        subject: "Hello from Brevo!",
        to: [
            {
                email: to,
                name: "Stephen",
            },
        ],
    });

}
main()


}
catch(err){

}
};

module.exports= sendEmailWithBrevo;