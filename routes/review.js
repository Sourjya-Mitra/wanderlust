const express=require("express");
const router =express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const Review=require("../models/review.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const expressError = require("../utils/expressErrors.js");
const Listing = require("../models/listing.js");
const {validateReview,isLoggedIn,isOwner,isReviewAuthor}=require("../middlewares.js");
const reviewController=require("../controllers/reviews.js");
//post review route
router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.createReviews));
//Delete review route
router.delete("/:reviewId",isReviewAuthor,wrapAsync(reviewController.destroyReview));
module.exports=router;  