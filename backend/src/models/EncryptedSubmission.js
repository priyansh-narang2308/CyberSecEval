import mongoose from 'mongoose';

const encryptedSubmissionSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    examId: {
        type: String,
        required: true
    },
    // The actual submission content (answers), encrypted with AES
    encryptedData: {
        type: String, // Hex string
        required: true
    },
    // The Initialization Vector used for the AES encryption (must be unique per record)
    iv: {
        type: String, // Hex string
        required: true
    },
    // The AES key used to encrypt the data, ITSELF encrypted with the Server's RSA Public Key.
    // This creates the "Hybrid" envelope.
    encryptedSessionKey: {
        type: String, // Hex string
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const EncryptedSubmission = mongoose.model('EncryptedSubmission', encryptedSubmissionSchema);
export default EncryptedSubmission;
