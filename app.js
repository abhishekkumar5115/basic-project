if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const list = require("./models/listing");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapASync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const {listingSchema, reviewSchema } = require("./schema.js");
const review = require("./models/review");
const listingroute = require("./router/listingroute.js"); 
const reviewroute = require("./router/review.js"); 
const userroute = require("./router/userroute.js"); 
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const app = express();
const port = 8000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodoverride("_method"));
app.set("view engine","ejs");
app.set("views",path.resolve("./views"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const dburl = process.env.AtlasDB_url;

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto:{
        secret: process.env.SECRET
    },
    touchAfter: 24*3600,
});

store.on("error",()=>{
    console.log("error in mongo session",err);
})

const sessionOption = {
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge:  7*24*60*60*1000,
        httpOnly: true
    }
}


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



mongoose.connect(dburl).then((err)=>{
    console.log("mongodb connected");
}).catch((err)=>{
    console.log(err);
});

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listing", listingroute);
app.use("/listing",reviewroute);
app.use("/",userroute);

app.get("/",(req,res)=>{
    res.redirect("/listing");
});

// userDemo
// app.get("/demo",async(req,res)=>{
//     let fakeUser = new User({
//         email:"abhi@gmail.com",
//         username:"Student"
//     });

//     let registerUser = await User.register(fakeUser,"student@123");
//     res.send(registerUser);
// });

// app.get("/testlisting",async (req,res)=>{
//     let samplelist = new listing({
//         title:"My new villa",
//         discription:"By  my new house",
//         price: 50,
//         location:"darbhanga,bihar",
//         country:"India"
//     });
//     await samplelist.save();
//     console.log(samplelist);
//     res.send("testing");
// });
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
});

app.use((err,req,res,next)=>{
   let{statusCode= 500,message = "Something went wrong!"} = err;
   res.status(statusCode).render("error",{err});
//    res.status(statusCode).send(message);
});

app.listen(port,()=>console.log(`server started at port ${port}`));