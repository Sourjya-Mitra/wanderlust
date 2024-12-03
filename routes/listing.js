const express=require("express");
const router =express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const expressError = require("../utils/expressErrors.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middlewares.js");
const User = require("./user");
const listingController=require("../controllers/listings.js");
const multer  = require('multer');
const {storage}=require("../cloudconfig.js");
const upload = multer({ storage });
router
.route("/")
.get( wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));
//new route
router.get("/new",isLoggedIn,wrapAsync(listingController.renderNewForm));
router
.route("/:id")
.get(wrapAsync(listingController.showListings))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));
//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));
//delete route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));
module.exports=router;