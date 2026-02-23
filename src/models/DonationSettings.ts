import mongoose from 'mongoose';

const DonationSettingsSchema = new mongoose.Schema({
    accountName: {
        type: String,
        required: [true, 'Please provide an account name.'],
    },
    accountNumber: {
        type: String,
        required: [true, 'Please provide an account number.'],
    },
    bankName: {
        type: String,
        required: [true, 'Please provide a bank name.'],
    },
    ifscCode: {
        type: String,
        required: [true, 'Please provide an IFSC code.'],
    },
    micrCode: {
        type: String,
        required: false,
    },
    swiftCode: {
        type: String,
        required: false,
    },
    branchName: {
        type: String,
        required: false,
    },
    qrCodeUrl: {
        type: String,
        required: false, // Optional, can be text or URL
    },
}, { timestamps: true });

export default mongoose.models.DonationSettings || mongoose.model('DonationSettings', DonationSettingsSchema);
