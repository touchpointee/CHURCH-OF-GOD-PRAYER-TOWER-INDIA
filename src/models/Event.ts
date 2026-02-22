import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for this event.'],
        maxlength: [60, 'Title cannot be more than 60 characters'],
    },
    titleHi: { type: String },
    titleMl: { type: String },
    date: {
        type: Date,
        required: [true, 'Please provide a date for this event.'],
    },
    time: {
        type: String,
        required: [true, 'Please provide a time for this event.'],
    },
    location: {
        type: String,
        required: [true, 'Please provide a location for this event.'],
    },
    locationHi: { type: String },
    locationMl: { type: String },
    category: {
        type: String,
        required: [true, 'Please provide a category for this event.'],
    },
    description: {
        type: String,
        required: [true, 'Please provide a description for this event.'],
    },
    descriptionHi: { type: String },
    descriptionMl: { type: String },
    imageUrl: {
        type: String,
        required: [true, 'Please provide an image URL for this event.'],
    },
}, { timestamps: true });

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
