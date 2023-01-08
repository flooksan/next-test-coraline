import { useEffect } from "react";
import connect from "../../lib/mongodb";
import User from "../../model/schema"
import cookie from 'cookie';
import jwt from "jsonwebtoken"
const bcrypt = require("bcryptjs");



connect()

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" })
}

export default async function loginHandler(req, res) {
    const { email, password } = req.body

    // Validate Request
    if (!email || !password) {
        res.status(400)
        res.json({message:"Please add email and password"});
    }

    // Check if user exists
    const user = await User.findOne({ email })

    if (!user) {
        res.status(400).json({ message: "Not found user" })
    }

    // Check ban
    if (user.ban) {
        const banTime = user.banTime;
        const now = new Date();
        console.log(now - banTime , now , banTime)
        if (now - banTime >= (5 * 60 * 1000)) {
            // if (now >= banTime) {
            const update = await User.updateOne({ email }, { ban: false, banTime: null, loginFalseCount: 0 })
            if (update) {

                // Check password 
                const passCompare = await bcrypt.compare(password, user.password)
                if (passCompare) {
                    
                    const updateLoginCount = await User.findOneAndUpdate({ email },
                        { $inc: { loginCount: 1 } }, { new: true })
                    
                    updateLoginCount.loginFalseStartTime=null;
                    updateLoginCount.save();
                    // gen token
                    const token = generateToken(updateLoginCount._id);

                    // Set Cookie
                    res.setHeader("Set-Cookie", cookie.serialize("token", token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV !== "development",
                        maxAge: 60 * 60, // 60 min
                        sameSite: "strict",
                        path: "/",
                    }))

                    // Success
                    res.redirect("/homepage");

                } else {

                    res.status(400)
                    res.json({message:"Password is not correct!!"})
                }
            }

        } else {
            res.json({message:"You are baned in 5 min"})
        }

        

    } else {
            // Check password 
            const passCompare = await bcrypt.compare(password, user.password)
                if (passCompare) {
                    const updateLoginCount = await User.findOneAndUpdate({ email },
                        { $inc: { loginCount: 1 } }, { new: true });

                    updateLoginCount.ban = false;
                    updateLoginCount.banTime = null;
                    updateLoginCount.loginFalseCount = 0;
                    updateLoginCount.loginFalseStartTime=null;
                    updateLoginCount.save();

                    // gen token
                    const token = generateToken(updateLoginCount._id);

                    // Set Cookie
                    res.setHeader("Set-Cookie", cookie.serialize("token", token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV !== "development",
                        maxAge: 60 * 60, // 60 min
                        sameSite: "strict",
                        path: "/",
                    }))

                    // Success
                    res.redirect("/homepage");

                } else {
                    const now = Date.now();
                    

                    // Check try to login test around 60 min
                    if(!user.loginFalseStartTime) {
                        //Check loginFalseCount =3 and 
                        if (user.loginFalseCount + 1 >= 3) {
                            user.loginFalseCount += 1;
                            user.ban = true;
                            user.banTime= Date.now() + (5*60*1000);
                            // user.banTime = now.setMinutes(now.getMinutes() + 5);
                            user.loginFalseStartTime = null;
                            user.save()
                            res.json({ message: "You are ban in 5 min" })
                        } else {
                            user.loginFalseStartTime = now;
                            user.loginFalseCount += 1;
                            user.save();
                        }
                          
                    } else if (user.loginFalseStartTime <= (now60min)) {
                        if (user.loginFalseCount + 1 >= 3) {
                            user.loginFalseCount += 1;
                            user.ban = true;
                            user.banTime= Date.now() + (5*60*1000);
                            // user.banTime = now.setMinutes(now.getMinutes() + 5);
                            user.loginFalseStartTime = null;
                            user.save()
                            res.json({ message: "You are ban in 5 min" })
                        } else {
                            user.loginFalseCount += 1;
                            user.save();
                        }
                    }
                    

                    res.status(400)
                    res.redirect("/")
                }

    }





}


