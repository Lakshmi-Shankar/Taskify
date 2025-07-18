const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "newUser"
    },
    status: {
        type: String,
        default: "Incomplete"
    }
},
{timestamps: true});

module.exports = mongoose.model("newTask", taskSchema);