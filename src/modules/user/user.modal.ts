import * as mongoose from 'mongoose';
import { model } from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true },
        name: { type: String, required: true },
        role: { type: String, enum: ['admin', 'superAdmin', 'employee'], required: true },
        dob: { type: Date, required: true },
        password: { type: String, required: true },
        companyName: { type: String, required: true },
        profile_pic_url: { type: String, required: true },
        address: [{ type: mongoose.Types.ObjectId, ref: 'address' }],
        verified: { type: Boolean, required: true },
        
        verification_token: { type: Number, required: true },
        verification_token_time: { type: Date, required: true },

        reset_password_token: { type: Number, required: false },
        reset_password_token_time: { type: Date, required: false },


        // Single Field Indexing in email field
        // email: { type: String, required: true, index: { background: true, unique: true } },
        // password: { type: String, required: true },
        // profile_pic_url: { type: String, required: true },
        // verified: { type: Boolean, required: true },
        // verification_token: { type: Number, required: true },
        // verification_token_time: { type: Date, required: true },
        // reset_password_token: { type: Number, required: false },
        // reset_password_token_time: { type: Date, required: false },
        // username: { type: String, required: true },
        // created_at: { type: Date, required: true, default: new Date() },
        // updated_at: { type: Date, required: true, default: new Date() }
    }
);

//Make Compound Indexing 
// userSchema.index({ email: 1, password: 1 }, { background: true })

export default model('user', userSchema);