const express = require("express");
const path = require("path");
const wrapASync = require("../utils/wrapAsync");

const list = require("../models/listing");
const {isloggedin,isowner,validateListing} = require("../middleware/middleware.js");
const multer  = require('multer');
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });


const router = express.Router();

router.get("/",wrapASync(async(req,res)=>{
   let search='';
   if(req.query.search){
     search= req.query.search;
   }
    let alllisting = await list.find({
         $or:[
            {"title":{$regex:".*"+search+".*",$options:"i"}},
            {"location":{$regex:".*"+search+".*",$options:"i"}},
            {"country":{$regex:".*"+search+".*",$options:"i"}},
            {"category":{$regex:".*"+search+".*",$options:"i"}},
          
        ]
    })
    res.render("./listings/index.ejs",{alllisting});
}));
router.get("/new",isloggedin,(req,res)=>{
    res.render("./listings/new.ejs");
    
});
//create route
router.post("/",upload.single('listing[imageUrl]'),validateListing,wrapASync( async (req,res,next)=>{
    // let {title,description,price,location,country} = req.body;
    // const newListing = new list({
    //     title: title,
    //     description: description,
    //     price: price,
    //     location: location,
    //     country: country
    // })  ;
    // console.log(newListing);
    //  let listing = req.body;
    //  console.log(listing);
    // if(!req.body.listing){
    //     throw new ExpressError(400,"send valid response for listing");
    // };
  
  

    let url = req.file.path;
    let filename = req.file.filename;
    const newlisting = new list(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.imageUrl = {url,filename};
    await newlisting.save();
    req.flash("success","New listing created");
    res.redirect("/listing");
    
}));
// router.post("/",upload.single('listing[name]'),(req,res)=>{
//     res.send(req.file);
// });

router.get("/:id/edit",isloggedin,isowner,wrapASync(async(req,res)=>{
    let {id} = req.params;
    const editlisting = await list.findById(id);
    if(!editlisting){
        req.flash("error","the listiing you are looking for does not exist");
        res.redirect("/listing");
    }
    let originalimageUrl = editlisting.imageUrl.url;

    originalimageUrl = originalimageUrl.replace("/upload","/upload/w_250");
    res.render("./listings/edit.ejs",{editlisting,originalimageUrl});
}));

router.get("/:id",wrapASync( async(req,res)=>{
    let {id} = req.params;
    const listings = await list.findById(id)
    .populate({path:"reviews", populate:{path:"author"}})
    .populate("owner");
    if(!listings){
        req.flash("error","the listiing you are looking for does not exist");
        res.redirect("/listing");
    }
    res.render("./listings/show",{listings});
}));
router.put("/:id",isloggedin,isowner,upload.single('listing[imageUrl]'),validateListing,wrapASync(async(req,res)=>{
    let {id} = req.params;
    let newlisting =   await list.findByIdAndUpdate(id, {...req.body.listing},{runValidators: true, new:true});
    if(typeof req.file !="undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        newlisting.imageUrl = { url,filename };
        await newlisting.save();
    }
    req.flash("success"," listing edited successfuly!");
    res.redirect(`/listing/${id}`);
}));
router.delete("/:id",isloggedin,isowner,wrapASync(async(req,res)=>{
    let {id} = req.params;
    const deletelist = await list.findByIdAndDelete(id);
    req.flash("success","listing deleted");
    res.redirect("/listing");
}));


module.exports = router;