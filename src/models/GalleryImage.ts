import mongoose from 'mongoose';

const GalleryImageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title/caption.'],
    },
    imageUrl: {
        type: String,
        required: [true, 'Please provide the MinIO image URL.'],
    },
    category: {
        type: String,
        required: [true, 'Please provide a category.'],
    },
}, { timestamps: true });

export default mongoose.models.GalleryImage || mongoose.model('GalleryImage', GalleryImageSchema);
