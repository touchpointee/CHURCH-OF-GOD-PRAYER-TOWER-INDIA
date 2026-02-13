import mongoose from 'mongoose';

const AboutSchema = new mongoose.Schema({
    founderName: {
        type: String,
        required: [true, 'Please provide the founder name.'],
    },
    founderImage: {
        type: String,
        required: [false, 'Please provide the founder image URL.'],
    },
    title: {
        type: String,
        required: [true, 'Please provide a title.'],
    },
    content: {
        type: String,
        required: [true, 'Please provide the content.'],
    }
}, { timestamps: true });

export default mongoose.models.About || mongoose.model('About', AboutSchema);
