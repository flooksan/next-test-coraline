import connect from "../../lib/mongodb";
import jwt from "jsonwebtoken";
import User from "../../model/schema";
import cookie from 'js-cookie';


connect()

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"})
}

export default async function registerHandler(req, res) {
    try {
        const {email, password, username} = req.body;
        
        // const user = await User.create(req.body);
        const user = await User.create({email, password, username});
        
        
        // Generate Token
        const token = generateToken(user._id);
        // console.log(token)


        res.status(201).json({message: "Success please login!"})
       
        // .redirect('/')

        if(!user) {
            return res.status(400).json({message: "User not created"})
        }
    } catch (error) {
        res.status(400).json({message: "Not able to create a new user."})
    }
}