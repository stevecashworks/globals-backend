const { google } = require("googleapis");
const GoogleToken = require("./api/models/googleTokenModel.js");
const oauth2Client = require("./api/config/authClient.js");

const sendMail = async ({
    to,
    subject,
    html = "",
    text = "",
    cc = [],
    bcc = [],
    fromName = "Global Diamond Capital",
}) => {
    try {

        const googleAccount = await GoogleToken.findOne();

        if (!googleAccount) {
            throw new Error("No Google account connected.");
        }

        // Load refresh token
        oauth2Client.setCredentials({
            refresh_token: googleAccount.refreshToken,
        });

        // Generate an access token
        const { token: accessToken } = await oauth2Client.getAccessToken();

        if (!accessToken) {
            throw new Error("Failed to generate access token.");
        }

        console.log("Access Token:", accessToken);

        // Check token scopes
        const tokenInfo = await oauth2Client.getTokenInfo(accessToken);

        console.log("Scopes:");
        console.log(tokenInfo.scopes || tokenInfo.scope || tokenInfo);

        const gmail = google.gmail({
            version: "v1",
            auth: oauth2Client,
        });

        const email = [
            `From: Global Diamond Capital <${googleAccount.email}>`,
            `To: ${Array.isArray(to) ? to.join(", ") : to}`,
            cc.length ? `Cc: ${cc.join(", ")}` : "",
            bcc.length ? `Bcc: ${bcc.join(", ")}` : "",
            `Subject: ${subject}`,
            "MIME-Version: 1.0",
            'Content-Type: text/html; charset="UTF-8"',
            "",
            html || text,
        ]
            .filter(Boolean)
            .join("\r\n");

        const raw = Buffer.from(email)
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");

        const response = await gmail.users.messages.send({
            userId: "me",
            requestBody: {
                raw,
            },
        });

        return {
            success: true,
            messageId: response.data.id,
            threadId: response.data.threadId,
        };

    } catch (error) {

        console.error("===== Gmail Error =====");

        if (error.response?.data) {
            console.dir(error.response.data, { depth: null });
        } else {
            console.error(error);
        }

        return {
            success: false,
            error: error.response?.data || error.message,
        };
    }
};

module.exports = sendMail;