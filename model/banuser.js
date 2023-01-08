import mongoose from "mongoose";


const banSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    loginFalse: {
        type: Number,
        default: 0,
    },
    updatedAt: {
        type: Date,
    },
    expiresAt: {
        type: Date,
    }
}, { timestamps: true });

// ถ้าไม่เขียนแบบนี้มันจะขึ้นว่า OverwriteModelError: Cannot overwrite `User` model once compiled.
module.exports = mongoose.models.BanUser || mongoose.model('BanUser',banSchema)