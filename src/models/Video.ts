import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for this video.'],
    },
    youtubeUrl: {
        type: String,
        required: [true, 'Please provide a YouTube URL.'],
    },
    category: {
        type: String,
        required: false,
        default: 'General'
    },
    thumbnailUrl: {
        type: String,
        required: [false, 'Thumbnail URL will be auto-generated if possible.'],
    },
}, { timestamps: true });

export default mongoose.models.Video || mongoose.model('Video', VideoSchema);
