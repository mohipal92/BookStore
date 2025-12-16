const express = require("express");
const router = express.Router();
const User = require("../model/user.js"); // Ensure this path is correct
const jwt = require("jsonwebtoken");
const Book = require("../model/book.js");
const { authenticateToken } = require("./userAuth.js");

// Add book -- admin
router.post("/add-book", authenticateToken, async (req, res) => {
    try {
        const {id} = req.headers; 
        if (!id) {
            return res.status(400).json({ message: "User ID not provided in headers" });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (user.role !== "admin") {
            return res.status(403).json({ message: "You do not have admin access" });
        }

        const { url, title, author, price, desc, language } = req.body;

        // Basic validation
        if (!url || !title || !author || !price || !desc || !language) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const book = new Book({
            url,
            title,
            author,
            price,
            desc,
            language,
        });

        await book.save();
        res.status(200).json({ message: "Book added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//update book
router.put("/update-book",authenticateToken,async(req,res)=>{
    try{
        const {bookid}=req.headers;
        const { url, title, author, price, desc, language } = req.body;

        await Book.findByIdAndUpdate(bookid,{
            url,
            title,
            author,
            price,
            desc,
            language,
        });
        return res.status(200).json({message:"Book update succesfully!"});

    }catch(error){
        console.log(error);
        res.status(500).json({message:"An error occurred"});
    }
});
// delete book
router.delete("/delete-book", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.headers;

        if (!bookid) {
            return res.status(400).json({ message: "Book ID not provided in headers" });
        }

        const book = await Book.findById(bookid);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        await Book.findByIdAndDelete(bookid);
        return res.status(200).json({ message: "Book deleted successfully!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});
//get all books
router.get("/get-all-books", async (req, res) => { // Corrected the route path
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        return res.json({
            status: "success",
            data: books,
        });
    } catch (error) {
        console.error("Error fetching books:", error); // Improved error logging
        return res.status(500).json({ message: "An error occurred" });
    }
});
// get recently added books limit 4
router.get("/get-recent-books", async (req, res) => { // Corrected the route path
    try {
        const books = await Book.find().sort({ createdAt: -1 }).limit(4);
        return res.json({
            status: "success",
            data: books,
        });
    } catch (error) {
        console.error("Error fetching books:", error); // Improved error logging
        return res.status(500).json({ message: "An error occurred" });
    }
});
// get book by id
router.get("/get-book-by-id/:id", async (req, res) => { // Corrected the route path
    try {
        //user headers or params depand upon choice
        const {id} = req.params;
        const book = await Book.findById(id);
        if(!book){
            return res.status(500).json({message:"book is not find"});
        }
        return res.json({
            status: "success",
            data: book,
        });
    } catch (error) {
        console.error("Error fetching books:", error); // Improved error logging
        return res.status(500).json({ message: "An error occurred" });
    }
});
module.exports = router;

