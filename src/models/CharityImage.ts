import mongoose from 'mongoose';

const CharityImageSchema = new mongoose.Schema({
    title: { type: String, required: false },
    imageUrl: {
        type: String,
        required: [true, 'Please provide the image URL.'],
    },
}, { timestamps: true });

export default mongoose.models.CharityImage || mongoose.model('CharityImage', CharityImageSchema);
