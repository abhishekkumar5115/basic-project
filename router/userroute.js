const express = require("express");
const path = require("path");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const Passport = require("passport");
const { saveRedirecturl } = require("../middleware/middleware");


router.get("/signup",(req,res)=>{
    res.render("./user/signup.ejs");
});

//signup post

router.post("/signup",wrapAsync( async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        const createUser = new User({username,email});
        const registereduser = await User.register(createUser,password);
        req.flash("success","welcome to wanderlust");
        req.login(registereduser,((err)=>{
            if(err){
             return   next(err);
            }
            res.redirect("/listing");
           }));
    }catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }

}));

router.get("/login",(req,res)=>{
    res.render("user/login.ejs");
});

router.post("/login",saveRedirecturl ,Passport.authenticate('local', 
    { failureRedirect: '/login', failureFlash:true}),
     async(req,res)=>{
        let redirectUrl =  res.locals.redirectUrl || "/listing";
        res.redirect(redirectUrl);
       
});

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
         return   next(err);
        }
        res.redirect("/listing");
    });
});



module.exports = router;