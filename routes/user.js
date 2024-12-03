const express=require("express");
const router =express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const User=require("../models/user.js");
const {userSchema}=require("../schema.js");
const expressError = require("../utils/expressErrors.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const {saveRedirectUrl}=require("../middlewares.js");
const userController=require("../controllers/users.js");
router
.route("/signup")
.get((userController.renderSignUpForm))
.post(wrapAsync(userController.signup));
router
.route("/login")
.get(wrapAsync(userController.renderLoginForm))
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),
wrapAsync(userController.login));
router.get("/logout",(userController.logout));
module.exports=router;