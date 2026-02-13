import mongoose from 'mongoose';

const SocialSettingsSchema = new mongoose.Schema({
    facebookUrl: {
        type: String,
        default: '',
    },
    youtubeUrl: {
        type: String,
        default: '',
    },
    instagramUrl: {
        type: String,
        default: '',
    },
    whatsappUrl: {
        type: String,
        default: '',
    },
}, { timestamps: true });

// Prevent overwrite if model already exists
export default mongoose.models.SocialSettings || mongoose.model('SocialSettings', SocialSettingsSchema);
