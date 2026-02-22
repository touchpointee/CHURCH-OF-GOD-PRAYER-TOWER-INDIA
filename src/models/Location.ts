import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    nameHi: { type: String },
    nameMl: { type: String },
    address: { type: String, required: true },
    addressHi: { type: String },
    addressMl: { type: String },
    details: { type: String },
    detailsHi: { type: String },
    detailsMl: { type: String },
}, { timestamps: true });

export default mongoose.models.Location || mongoose.model('Location', LocationSchema);
