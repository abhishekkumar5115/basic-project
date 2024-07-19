const { model,Schema } = require("mongoose");

const reviewSchema = new Schema({
    comment: String,
    rating:{
        type: Number,
        min: 1,
        max: 5
    },
    createdAt:{
        type: Date,
        dafault: Date.now()
    },
    author:{
        type: Schema.Types.ObjectId,
        ref:"user"
    }
});

const review = new model("review", reviewSchema);

module.exports = review;