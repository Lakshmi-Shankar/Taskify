const mongoose = require("mongoose");

const newSignup = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model("newUser", newSignup)