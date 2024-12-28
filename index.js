if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
    }
    const express= require("express");
    const app=express();
    const port=8080;
    const mongoose = require('mongoose');
    const path=require("path");
    const methodOverride= require("method-override");
    const ejsMate=require("ejs-mate");
    const wrapAsync=require("./utils/wrapAsync.js");
    const expressError = require("./utils/expressErrors.js");
    const {listingSchema,reviewSchema}=require("./schema.js");
    const Review=require("./models/review.js");
    const listingRouter=require("./routes/listing.js");
    const reviewRouter=require("./routes/review.js");
    const session = require("express-session");
    const MongoStore = require('connect-mongo');
    const { date } = require("joi");
    const flash=require("connect-flash");
    const passport=require("passport");
    const LocalStrategy=require("passport-local");
    const User = require("./models/user.js");
    const userRouter=require("./routes/user.js");
    const dbUrl=process.env.ATLASDB_URL;
    async function main(){
        await mongoose.connect(dbUrl);
     }; 
     main().then(()=>{
         console.log("connected to database");
     }) .catch((err)=>{
         console.log(err);
     });
 app.set("views",path.join(__dirname,"views"));
 app.use(express.static(path.join(__dirname,"public")));
 app.set("view engine","ejs");
 app.use(express.urlencoded({extended:true}));
 app.use(methodOverride("_method"));
 app.engine("ejs",ejsMate);
 app.listen(port,(req,res)=>{
     console.log(`app is listening on ${port}`);
 });
 const store=MongoStore.create({
     mongoUrl:dbUrl,
     crypto:{
         secret:process.env.SECRET,
     },
     touchAfter:24*3600
 });
 store.on("error",()=>{
     console.log("ERROR ON MONGO SESSION STORE",err);
 });
 const sessionOptions={
     store,
     secret:process.env.SECRET,
     resave:false,
     saveUninitialized:true,
     cookie:{
         expires:new Date(Date.now()+1000*60*60*24*3),
         maxAge:1000*60*60*24*3,
         httpOnly:true
     },
 };
 app.use(session(sessionOptions));
 app.use(flash());
 app.use(passport.initialize());
 app.use(passport.session());
 passport.use(new LocalStrategy(User.authenticate()));
 passport.serializeUser(User.serializeUser());
 passport.deserializeUser(User.deserializeUser());
 app.use((req,res,next)=>{
     res.locals.success=req.flash("success");
     res.locals.error=req.flash("error");
     res.locals.curUser=req.user;
     next();
 });
 app.get("/register", async(req,res)=>{
     let fakeUser=new User({
         email:"student@gmail.com",
         username:"delta-student",
     });
     let newUser=await User.register(fakeUser,"helloworld");
     res.send(newUser);
 });
 app.use("/listings",listingRouter);
 app.use("/listings/:id/reviews",reviewRouter);
 app.use("/",userRouter);
 //any above does not match
 app.all("*",(req,res,next)=>{
     next(new expressError(404,"page not found"));
 });
 //error middleware
 app.use((err,req,res,next)=>{
     let { statusCode=500,message="some unknown error" } = err;
     res.status(statusCode).render("error.ejs",{message});
 });