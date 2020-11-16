import * as mongoose from 'mongoose';
import { model } from 'mongoose'

const addressSchema = new mongoose.Schema(
    {

        location: { type: String, required: true },
        updated_at: { type: Date, required: true },
        created_at: { type: Date, required: true }
    }
);

export default model('address', addressSchema);