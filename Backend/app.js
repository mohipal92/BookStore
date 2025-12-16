const express = require("express");

const app = express();
require("dotenv").config();
require("./connection/connection");
const cors = require("cors")
const user = require("./routes/user");
const Books = require("./routes/book");
const Favourites = require("./routes/favourite.js");
const Cart = require("./routes/cart.js")
const Order = require("./routes/order.js")

app.use(cors());
app.use(express.json());
//routes
app.use("/api/v1",user);
app.use("/api/v1",Books);
app.use("/api/v1",Favourites);
app.use("/api/v1",Cart);
app.use("/api/v1",Order);
app.get('/',(req,res)=>{
    res.send({
        activeStatus:true,
        error:false,

    })
})
// creating port
// const port = process.env.PORT || 3000;  // Make sure there is no trailing comma

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
// module.exports = app;
