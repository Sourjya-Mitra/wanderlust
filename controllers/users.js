const User=require("../models/user.js");
module.exports.renderSignUpForm=(req,res)=>{
    res.render("users/signup.ejs");
};
module.exports.signup=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
     const newUser=new User({email,username});
    const registeredUser = await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            next(err);
        }
        req.flash("success","Welcome to wanderLust!");
        res.redirect("/listings");
    });
    } catch(error){
        req.flash("error",error.message);
        res.redirect("/signup");
    };
};
module.exports.renderLoginForm=async(req,res)=>{
    res.render("users/login.ejs");
};
module.exports.login=async(req,res)=>{
    req.flash("success","welcome to wanderLust you are logged in");
    let redirectUrl=res.locals.redirectUrl||"/listings";
    res.redirect(redirectUrl);
 };
 module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","logged you out!");
        res.redirect("/listings");
    });
};