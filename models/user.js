const { model,Schema } = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true,
    },
});
userSchema.plugin(passportLocalMongoose);

const user = new model("user", userSchema);
module.exports = user;