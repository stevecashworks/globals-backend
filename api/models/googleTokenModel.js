const mongoose = require("mongoose");

const googleTokenSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    refreshToken: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("GoogleToken", googleTokenSchema);