import mongoose from 'mongoose';

const StatementOfFaithSchema = new mongoose.Schema({
    content: { type: String, required: true },
    order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.StatementOfFaith || mongoose.model('StatementOfFaith', StatementOfFaithSchema);
