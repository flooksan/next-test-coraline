import { useEffect } from "react";
import connect from "../../lib/mongodb";
import User from "../../model/schema"
import cookie from 'cookie';
import jwt from "jsonwebtoken"
const bcrypt = require("bcryptjs");


connect()

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"})
}

export default async function loginHandler(req, res) {
    const { email, password } = req.body
    
    // Validate Request
    if (!email || !password) {
        res.status(400)
        throw new Error("Please add email and password");
    }

    // Check if user exists
    const user = await User.findOne({email})

    if(!user) {
        res.status(400).json({message: "Not found user"})  
    }

    // Check password 
    const passCompare = await bcrypt.compare(password,user.password)
    if (passCompare) {
        const updateLoginCount = await User.findOneAndUpdate({ email }, 
            { $inc: { loginCount: 1 } }, { new: true })

        // gen token
        const token = generateToken(updateLoginCount._id);

        // Set Cookie
        res.setHeader("Set-Cookie",cookie.serialize("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: 60*60, // 60 min
            sameSite: "strict",
            path: "/",
        }))

        // Success
        res.redirect("/homepage");
    } else {
        res.status(400)
        throw new Error("Password is not correct!!")
    }
    
    // console.log(user)
    
    
    
    
    
}


