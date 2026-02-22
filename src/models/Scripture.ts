import mongoose from 'mongoose';

const ScriptureSchema = new mongoose.Schema({
    text: { type: String, required: true },
    textHi: { type: String },
    textMl: { type: String },
    reference: { type: String, required: true },
    referenceHi: { type: String },
    referenceMl: { type: String },
    key: { type: String, required: true, unique: true }, // e.g., 'statement-of-faith'
}, { timestamps: true });

export default mongoose.models.Scripture || mongoose.model('Scripture', ScriptureSchema);
