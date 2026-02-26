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
    mapUrl: { type: String, default: '' }, // Google Maps link for this address
}, { timestamps: true });

// Avoid using a cached model that might not have mapUrl (e.g. from before schema change)
if (mongoose.models.Location) {
    delete mongoose.models.Location;
}
export default mongoose.model('Location', LocationSchema);
