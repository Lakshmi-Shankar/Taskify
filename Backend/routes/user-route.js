const express = require("express");
const newUserSchema = require("../schema/user-schema")
const bcrypt = require("bcrypt")
const router = express.Router()

router.post("/sign-up", async(req, res) => {
    try{
        const {name, password} = req.body;
        if (!name || !password){
            return res.status(401).json({
                message: "All fields are required"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 8)
        const newUser = new newUserSchema({
            name: name,
            password: hashedPassword
        })
        await newUser.save()
        return res.status(200).json({
            message: "User created"
        })
    }
    catch(err){
        return res.status(500).json({
            message: "Internal server error",
            Error: err.message
        })
    }
});

router.post("/sign-in", async(req, res) => {
    try{
        const {name, password} = req.body;
        if(!name || !password){
            return res.status(401).json({
                message: "All fields are required"
            })
        }
        const existingUser = await newUserSchema.findOne({name: name});
        if(!existingUser){
            return res.status(404).json({
                message: "No user found"
            })
        }
        const userPass = existingUser.password;

        const match = await bcrypt.compare(password, userPass);
        if(match){
            return res.status(200).json({
                message: "Logged-in",
                userData: existingUser
            })
        }
        return res.status(402).json({
            message: "Incorrect User or Password"
        })
    }
    catch(err){
        return res.status(500).json({
            message: "Internal server error",
            Error: err.message
        })   
    }
})

module.exports = router