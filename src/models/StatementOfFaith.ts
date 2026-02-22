import mongoose from 'mongoose';

const StatementOfFaithSchema = new mongoose.Schema({
    content: { type: String, required: true },
    contentHi: { type: String },
    contentMl: { type: String },
    order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.StatementOfFaith || mongoose.model('StatementOfFaith', StatementOfFaithSchema);
