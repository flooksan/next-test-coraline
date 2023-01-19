import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    loginCount: {
        type: Number,
        default: 0,
    },
    loginFalseStartTime: {
        type: Date
    },
    ban: { 
        type: Boolean, 
        default: false 
    },
    banTime: {
        type: Date
    },
    loginFalseCount: { 
        type: Number, 
        default: 0 
    }
}, { timestamps: true });

userSchema.pre("save",async function(next) { 
    // ต้องสร้าง function ใส่ class check ว่ามีการ modify password ไหม
    if(!this.isModified("password")) {
        return next();
    }

    // Hash password
    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(this.password, salt); 
    
    this.password = hashedPassword;
    next();
});

// ถ้าไม่เขียนแบบนี้มันจะขึ้นว่า OverwriteModelError: Cannot overwrite `User` model once compiled.
module.exports = mongoose.models.User || mongoose.model('User',userSchema)