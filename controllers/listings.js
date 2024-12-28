const Listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken:mapToken });
module.exports.index=async(req,res)=>{
    let allListings= await Listing.find({});
    res.render("listings/index.ejs",{ allListings }); 
};
module.exports.renderNewForm=async (req,res)=>{
    res.render("listings/new.ejs");
};
module.exports.renderEditForm=async (req,res)=>{
    let { id } = req.params;
    let reqListing=await Listing.findById(id);
    if(!reqListing){
        req.flash("error","listing you requested for does not exist");
        res.redirect("/listings");
    };
    let originalImageUrl=reqListing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{ reqListing,originalImageUrl });
};
module.exports.showListings=async(req,res)=>{
    let { id } = req.params;
    const reqListings= await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!reqListings){
        req.flash("error","listing you requested for does not exist");
        res.redirect("/listings");
    };
    res.render("listings/show.ejs",{reqListings});
};
module.exports.createListing=async(req,res,next)=>{
    let response=await geocodingClient.forwardGeocode({
        query:req.body.listing.location ,
        limit: 1
      })
        .send();
        let url=req.file.path;
        let filename=req.file.filename;
         let newListing= new Listing(req.body.listing);
         newListing.owner=req.user._id;
         newListing.image={url,filename};
         newListing.geometry=response.body.features[0].geometry;
         let savedLising = await newListing.save();
         console.log(savedLising); 
         req.flash("success","new listing created");
         res.redirect("/listings");
 };
 module.exports.showsearchlisting=async(req,res)=>{
    let { title }=req.query;
    let allListings=await Listing.find({title:title});
    res.render("listings/index.ejs",{allListings});
 }
 module.exports.updateListing=async(req,res)=>{
    let { id }= req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file!="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    };
    req.flash("success","editted successfully");
    res.redirect(`/listings/${id}`);
}; 
module.exports.destroyListing=async(req,res)=>{
    let { id }= req.params;
    let deletedListing  =await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","listing deleted successfully");
    res.redirect("/listings");
};
module.exports.showlistinggenre=async(req,res)=>{
    let genre=req.query.genre;
    let allListings=await Listing.find({genre:genre});
   res.render("listings/index.ejs",{ allListings });
  
};