import connect from "../../lib/mongodb";
import jwt from "jsonwebtoken";
import User from "../../model/schema";

connect()

export default async function findUserHandler (req, res) {
    
    try {
        const {token} = req.query
        if (!token) {
            
            res.status(401) // Not authorized
            throw new Error("Not authorized, please login")

        }
        //  Verify Token
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        // console.log("verified",verified)
       
        // find user data
        const user = await User.findById(verified.id).select("-password")
        

        if(!user) {
            res.status(401) // Not authorized
            throw new Error("User not found")
        }

        res.json(user)
        
    } catch (error) {
        throw new Error(error)
    }
}

