const {config}= require("dotenv")
config();

const sendEmail = async ({
  to,
  name,
  subject,
  html,
  text,
}) => {
 const response = await fetch("https://api.brevo.com/v3/smtp/email", {
  method: "POST",
  headers: {
    "accept": "application/json",
    "api-key": process.env.brevo_api_key,
    "content-type": "application/json",
  },
  body: JSON.stringify({
    sender: {
      name: "globaldiamondcapitals",
      email: "melissa.investify@gmail.com",
    },
    to: [
      {
        email: to,
        name,
      },
    ],
    subject,
    htmlContent: html,
  }),
});

const data = await response.json();

console.log("Status:", response.status);
console.log("Response:", data);;


  if (!response.ok) {
    console.error(data);
    throw new Error(data.message || "Failed to send email");
  }

  return data;
};

module.exports = sendEmail;