const express = require("express");
const router = express.Router();
const User = require("../model/user.js"); // Ensure this path is correct
const {authenticateToken} = require("./userAuth.js");

//put book to cart
router.put("/add-to-cart",authenticateToken,async(req,res)=>{
    try {
        const { id, bookid } = req.headers;
        if (!id || !bookid) {
            return res.status(400).json({ status: "error", message: "Missing user id or book id in headers" });
        }

        const userData = await User.findById(id);
        if (!userData) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        const isBookInCart = userData.cart.includes(bookid);
        if (isBookInCart) {
            return res.status(200).json({
                status: "success",
                message: "Book is already in cart",
            });
        }

        await User.findByIdAndUpdate(id, {
            $push: { cart: bookid },
        });

        return res.status(200).json({
            status: "success",
            message: "Book added to cart",
        });
    }catch(error){
        console.log("error");
        return res.status(500).json({message:"An error occurred"})
    }
});
// remove from cart ->*some error*
router.put("/remove-from-cart/:bookid", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.params;
        const { id } = req.headers;

        if (!id || !bookid) {
            return res.status(400).json({ status: "error", message: "Missing user id or book id" });
        }

        const userData = await User.findById(id);
        if (!userData) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        const isBookInCart = userData.cart.includes(bookid);
        if (!isBookInCart) {
            return res.status(404).json({ status: "error", message: "Book not found in cart" });
        }

        await User.findByIdAndUpdate(id, { $pull: { cart: bookid } });

        return res.status(200).json({
            status: "success",
            message: "Book removed from cart",
        });

    } catch (error) {
        console.error("Error removing book from cart:", error);
        return res.status(500).json({ status: "error", message: "An error occurred" });
    }
});

// get cart of a particular user 
router.get("/get-user-cart",authenticateToken,async(req,res)=>{
    try{

        const {id}= req.headers;
        const userData = await User.findById(id).populate("cart");
        const cart = userData.cart.reverse();
        
        return res.json({
            status:"Success",
            data:cart,
        });

    }catch(error){
        console.error("Error removing book from cart:", error);
        return res.status(500).json({ status: "error", message: "An error occurred" });
    }
})
module.exports=router;