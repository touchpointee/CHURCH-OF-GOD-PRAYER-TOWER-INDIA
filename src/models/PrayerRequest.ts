import mongoose from 'mongoose';

const PrayerRequestSchema = new mongoose.Schema({
    name: String,
    contact: String,
    message: { type: String, required: true },
    isConfidential: { type: Boolean, default: false },
    read: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.PrayerRequest || mongoose.model('PrayerRequest', PrayerRequestSchema);
