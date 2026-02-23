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
        required: [true, 'Payment link is required.'],
    },
    order: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

export default mongoose.models.DonationPoster || mongoose.model('DonationPoster', DonationPosterSchema);
