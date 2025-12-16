
const mongoose = require("mongoose");

const user = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    
    address:{
        type:String,
        required:true,
        unique:true,
    },
    avatar:{
        type:String,
        default:"/public/avatar.jpg"
    },
    role:{
        type:String,
        default:"user",
        enum:["user","admin"],
    },
    favourites:[
        {
            type: mongoose.Types.ObjectId,
            ref:"books",
        },
    ],
    cart:[{type: mongoose.Types.ObjectId,
            ref:"books",
        },
    ],
    orders:[{type: mongoose.Types.ObjectId,
            ref:"Order",
        },
    ],
},
{timestamps:true}
);
module.exports = mongoose.model("User",user)