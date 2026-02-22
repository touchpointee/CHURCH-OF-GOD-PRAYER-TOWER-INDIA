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
    titleHi: { type: String },
    titleMl: { type: String },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    descriptionHi: { type: String },
    descriptionMl: { type: String },
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
