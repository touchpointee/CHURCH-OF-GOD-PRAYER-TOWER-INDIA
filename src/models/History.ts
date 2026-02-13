import mongoose from 'mongoose';

const HistorySchema = new mongoose.Schema({
    year: {
        type: String,
        required: [true, 'Year is required'],
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    image: {
        type: String,
        required: [true, 'Image URL is required'],
    },
    order: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.History || mongoose.model('History', HistorySchema);
