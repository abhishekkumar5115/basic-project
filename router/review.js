const express = require("express");
const path = require("path");
const wrapASync = require("../utils/wrapAsync");
const list = require("../models/listing");
const review = require("../models/review");
const {validateReview,isloggedin,isReviewAuthor} = require("../middleware/middleware");

const router = express.Router();





//review post route

router.post("/:id/review",isloggedin,validateReview,wrapASync( async(req,res)=>{
    let listing = await list.findById(req.params.id);
    let newReview = new review(req.body.review);
        newReview.author = req.user._id;
    listing.reviews.push(newReview);
     await newReview.save();
     await listing.save();
     req.flash("success","review added");
   res.redirect(`/listing/${listing._id}`);

}));

// delete review route
router.delete("/:id/review/:reviewId",isloggedin,isReviewAuthor,wrapASync( async(req,res)=>{
let { id, reviewId} = req.params;

await list.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
await review.findByIdAndDelete(reviewId);
req.flash("error","review deleted");
res.redirect(`/listing/${id}`);
}));


module.exports = router;

