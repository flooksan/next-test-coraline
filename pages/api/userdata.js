import connect from "../../lib/mongodb";
import jwt from "jsonwebtoken";
import User from "../../model/schema";

connect()

export default async function findUserHandler (req, res) {
    // console.log(req.query)
    // res.status(200).send({message: "Success Get !"})
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
        // console.log("user data",user)

        if(!user) {
            res.status(401) // Not authorized
            throw new Error("User not found")
        }

        res.json(user)
        
    } catch (error) {
        throw new Error(error)
    }
}

