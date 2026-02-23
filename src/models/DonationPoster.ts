import mongoose from 'mongoose';

const DonationPosterSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false,
    },
    imageUrl: {
        type: String,
        required: [true, 'Poster image is required.'],
    },
    paymentLink: {
        type: String,
        required: false,
    },
    order: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

// Avoid using cached model with outdated schema (e.g. when paymentLink was required)
if (mongoose.models.DonationPoster) {
    delete mongoose.models.DonationPoster;
}
export default mongoose.model('DonationPoster', DonationPosterSchema);
