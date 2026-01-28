import mongoose from 'mongoose';

const signedResultSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: true
    },
    examTitle: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    // The raw data structure that was signed (for reconstruction during verification)
    resultData: {
        type: Object,
        required: true
    },
    // The SHA-256 Hash of the resultData (Integrity Check)
    hash: {
        type: String,
        required: true
    },
    // The RSA Signature of the Hash (Authenticity + Non-Repudiation)
    signature: {
        type: String,
        required: true
    },
    signedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        // Ensure only faculty can end up here via controller logic
    },
    signedAt: {
        type: Date,
        default: Date.now
    }
});

const SignedResult = mongoose.model('SignedResult', signedResultSchema);
export default SignedResult;
