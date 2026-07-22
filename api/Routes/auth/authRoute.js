const express = require("express");
const gAuthRouter = express.Router();

const {
    googleLogin,
    googleCallback,
} = require("./controllers.js");

gAuthRouter.get("/login", googleLogin);
gAuthRouter.get("/auth", googleCallback);

module.exports = gAuthRouter;