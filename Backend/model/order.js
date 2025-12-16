const mongoose = require("mongoose");

const order = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User", //  should match model name
  },
  book: {
    type: mongoose.Types.ObjectId,
    ref: "books", // make sure "books" is correct too
  },
  status: {
    type: String,
    default: "Order Placed",
    enum: ["Order Placed", "Out for delivered", "Delivered", "Canceled"],
  },
}, { timestamps: true });

module.exports = mongoose.model("Order", order);
