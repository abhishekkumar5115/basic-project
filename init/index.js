const mongoose = require("mongoose");
const intdata = require("./data");
const list = require("../models/listing");

mongoose.connect("mongodb://127.0.0.1:27017/airbnb").then((err)=>{
    console.log("mongodb connected");
}).catch((err)=>{
    console.log(err);
});

const init = async ()=>{
    await list.deleteMany({});
    intdata.data = intdata.data.map((obj)=>({...obj, owner:"667596a4c052683ffcf8660b"}));
    await list.insertMany(intdata.data);
    console.log("data added ");
};
 init();