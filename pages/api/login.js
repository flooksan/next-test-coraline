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
        // if (now - banTime >= (5 * 60 * 1000)) { // อันนี้หมายถึง 10 min
            if (now - banTime >=0) { // ตรองนี้หมายถึงว่าเวลาครบกำหนดแบนแล้ว
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
                    // res.redirect("/homepage");

                } else {

                    res.status(400)
                    // alert('Password is not correct!!')
                    res.json({message:"Password is not correct!!"})
                }
            }

        } else {
            res.status(401).json({message:"You are baned in 5 min"})
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
                    // res.redirect("/homepage");
                    res.status(200).json({message:"Success!!"})

                } else {
                    
                    const now = Date.now();
                    const startFalse = user.loginFalseStartTime;
                    const startFalse60 = Date.now() + (60*60*1000);
                    console.log(user.loginFalseStartTime <= startFalse60);

                    // Check try to login test around 60 min
                    if(!startFalse) {
                        //Check loginFalseCount =3 and 
                        if (user.loginFalseCount + 1 >= 3) {
                            console.log("1.If loginFalseStartTime")
                            user.loginFalseCount += 1;
                            user.ban = true;
                            user.banTime= Date.now() + (5*60*1000);
                            // user.banTime = now.setMinutes(now.getMinutes() + 5);
                            user.loginFalseStartTime = null;
                            user.save()
                            res.status(401).json({ message: "You are ban in 5 min" })
                        } else {
                            console.log("2.Else loginFalseStartTime")
                            user.loginFalseStartTime = now;
                            user.loginFalseCount += 1;
                            user.save();
                            res.status(401).json({ message: "Password in correct" })
                            
                        }
                          
                    } else if (user.loginFalseStartTime <= startFalse60) {
                        if (user.loginFalseCount + 1 >= 3) {
                            console.log("3.Else if loginFalseStartTime")
                            user.loginFalseCount += 1;
                            user.ban = true;
                            user.banTime= Date.now() + (5*60*1000);
                            // user.banTime = now.setMinutes(now.getMinutes() + 5);
                            user.loginFalseStartTime = null;
                            user.save()
                            res.status(401).json({ message: "You are ban in 5 min" })
                        } else {
                            console.log("4.Else else loginFalseStartTime")
                            user.loginFalseCount += 1;
                            user.save();
                            res.status(401).json({ message: "Password in correct" })
                        }
                    }
                    

                    // res.status(400)
                    // res.redirect("/")
                }

    }





}


