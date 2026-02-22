import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for this event.'],
        maxlength: [60, 'Title cannot be more than 60 characters'],
    },
    titleHi: { type: String },
    titleMl: { type: String },
    dateType: {
        type: String,
        enum: ['single', 'range'],
        default: 'single',
    },
    date: {
        type: Date,
        required: [true, 'Please provide a date for this event.'],
    },
    dateEnd: { type: Date },
    time: {
        type: String,
        required: false,
    },
    location: {
        type: String,
        required: [true, 'Please provide a location for this event.'],
    },
    locationHi: { type: String },
    locationMl: { type: String },
    category: { type: String },
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

// Avoid recompiling with stale schema (e.g. category was required before)
if (mongoose.models.Event) delete mongoose.models.Event;
export default mongoose.model('Event', EventSchema);
