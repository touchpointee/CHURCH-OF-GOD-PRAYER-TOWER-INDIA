import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    details: { type: String }, // Can store new line separated service times
}, { timestamps: true });

export default mongoose.models.Location || mongoose.model('Location', LocationSchema);
