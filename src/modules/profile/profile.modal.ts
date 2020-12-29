import * as mongoose from 'mongoose';
import { model } from 'mongoose';

const profileSchema = new mongoose.Schema({

    doj: { type: Date, required: false },
    panCard: { type: String, required: false },
    adharCard: { type: String, required: false },
    designation: { type: String, required: false },
    income: { type: String, required: false }

});

export default model('profileDetail', profileSchema);