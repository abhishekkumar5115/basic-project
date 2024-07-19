const list = require("../models/listing");
const review = require("../models/review.js");
const {listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError");

module.exports.validateListing = (req,res,next)=> {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400 , errMsg);
    }
    else{
        next();
    }
}

module.exports.validateReview = (req,res,next)=> {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400 , errMsg);
    }
    else{
        next();
    }
};


module.exports.isloggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
    req.session.redirectUrl = req.originalUrl;
    req.flash("error","you must be logged in");
    return res.redirect("/login");
}
next();
}

module.exports.saveRedirecturl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isowner = async(req,res,next)=>{
    let {id} = req.params;
    let listing =await list.findById(id);
    if(! listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you don't have the permission ");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {reviewId,id} = req.params;
    let Review =await review.findById(reviewId);
    if(! Review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","you don't have the permission ");
        return res.redirect(`/listing/${id}`);
    }
    next();
}