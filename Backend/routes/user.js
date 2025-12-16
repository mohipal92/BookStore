const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../model/user.js"); // Ensure this path is correct
const jwt = require("jsonwebtoken");
const {authenticateToken} = require("./userAuth.js")

// Sign up
router.post("/sign-up", async (req, res) => {
    try {
        const { username, email, password ,address} = req.body;

        // Check if the username length is more than 3
        if (username.length < 4) {
            return res.status(400).json({ message: "Username length should be greater than 3" });
        }

        // Check if the username already exists
        const existingUsername = await User.findOne({ username:username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Check if the email already exists
        const existingEmail = await User.findOne({ email:email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Check if the password length is more than 5
        if (password.length <= 5) {
            return res.status(400).json({ message: "Password length should be greater than 5" });
        }

        // Hash the password before saving to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password:hashedPassword,
            address
        });

        await newUser.save();
        return res.status(201).json({ message: "Sign Up Successful" });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});
// sign in 
router.post("/sign-in", async (req, res) => {
    try {
        const{username,password} =req.body;

        const existingUser = await User.findOne({username});
        if(!existingUser){
            res.status(400).json({message: "Invalid Credentials"});
        }

        await bcrypt.compare(password,existingUser.password,(err,data)=>{
            if(data)
            {
                const authClaims=[
                    {name: existingUser.username},
                    { role : existingUser.role},
                ];
                const token = jwt.sign({authClaims},"bookStore123",{
                    expiresIn: "30d",
                });
                res.status(200).json({id:existingUser.id,role:existingUser.role,token:token,});

            }else{
                res.status(400).json({message: "Invalid Credentials"});
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});
// get user information
router.get("/get-user-information", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        
        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const data = await User.findById(id).select('-password');
        
        if (!data) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
// update address
router.put("/update-address",authenticateToken,async(req,res)=>{
    try{
        const {id} = req.headers;
        const {address}=req.body;
        await User.findByIdAndUpdate(id,{address:address});

        return res.status(200).json({message: "Address updated successfully"});
    }catch{
        res.status(404).json({message:"Internal server error"})
    }
})


module.exports = router;
