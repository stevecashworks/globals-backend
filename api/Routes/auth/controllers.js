const oauth2Client = require("../../config/authClient.js");
const GoogleToken = require("../../models/googleTokenModel.js");

const googleLogin = (req, res) => {

    const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/gmail.send",
            "profile",
            "email",
        ],
    });

    res.redirect(authUrl);
};

const googleCallback = async (req, res) => {

    try {

        const { code } = req.query;

        const { tokens } = await oauth2Client.getToken(code);

        oauth2Client.setCredentials(tokens);

        const ticket = await oauth2Client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { email } = ticket.getPayload();

        await GoogleToken.findOneAndUpdate(
            { email },
            {
                email,
                refreshToken: tokens.refresh_token,
            },
            {
                upsert: true,
                new: true,
            }
        );

        res.json({
            message: "Google connected successfully",
            email,
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Google callback failed",
        });

    }

};

module.exports = {
    googleLogin,
    googleCallback,
};