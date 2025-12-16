const express = require("express");
const router = express.Router();
const User = require("../model/user.js"); // Ensure this path is correct
const {authenticateToken} = require("./userAuth.js")
//add book to favourite

router.put("/add-book-to-favourite",authenticateToken,async(req,res)=>{
    try{
        const {bookid,id}=req.headers;
        const userData = await User.findById(id);

        const isBookFavourite = userData.favourites.includes(bookid);
        if(isBookFavourite){
            return res.status(200).json({message:"Book is already in favourites"});
        }
        await User.findByIdAndUpdate(id,{$push:{favourites:bookid}});
        return res.status(200).json({message:"Book added to favourites"});

    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
});
// remove book from api
router.put("/remove-book-from-favourite",authenticateToken,async(req,res)=>{
    try{
        const { bookid, id } = req.headers;
        if (!bookid || !id) {
            return res.status(400).json({ message: "Missing bookid or user id in headers" });
        }

        const userData = await User.findById(id);
        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        const isBookFavourite = userData.favourites.includes(bookid);
        if (!isBookFavourite) {
            return res.status(404).json({ message: "Book not found in favourites" });
        }

        await User.findByIdAndUpdate(id, { $pull: { favourites: bookid } });

        return res.status(200).json({ message: "Book removed from favourites" });
    } catch (error) {
        console.error("Error removing book from favourites:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
// get favourite books of a particular user
router.get("/get-favourite-books", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        if (!id) {
            return res.status(400).json({ message: "Missing user id in headers" });
        }

        const userData = await User.findById(id).populate("favourites");
        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        const favouriteBooks = userData.favourites;
        return res.json({
            status: "Success",
            data: favouriteBooks,
        });

    } catch (error) {
        console.error("Error fetching favourite books:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
module.exports=router;