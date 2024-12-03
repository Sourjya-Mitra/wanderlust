const mongoose = require("mongoose");
const initData = require("./data.js");
const Listings = require("../models/listing.js");
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
 };
 main().then(()=>{
     console.log("connected to database");
 }) .catch((err)=>{
     console.log(err);
 });

 const initDB= async ()=> {
    await Listings.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"67430687a2f41c9fe41c27dc"}));
    await Listings.insertMany(initData.data);
    console.log("data has been initiallised");
 };
 
 initDB(); 