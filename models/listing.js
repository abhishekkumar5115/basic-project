const { model,Schema } = require("mongoose");
const review = require("./review.js");


const listingSchema = new Schema(
    {
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
    },
    imageUrl:{
       url: String,
       filename: String,
    },
    price:{
        type: Number,
        required: true
    },
    location:{
        type: String,
        required: true
    },
    country:{
        type: String,
        required: true
    },
    category:{
        type: String,
        def:"Villa",
         
    },
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref:"review"
        }
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref:"user",
    }
},{timestamps:true}
);

listingSchema.post("findOneAndDelete", async(list)=>{
    if(list){
        await review.deleteMany({_id:{$in:list.reviews}});
    }
    
});

const list = new model("list", listingSchema);

module.exports = list;