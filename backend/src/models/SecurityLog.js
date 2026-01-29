import mongoose from 'mongoose';

const securityLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['success', 'failed', 'alert'],
        default: 'success'
    },
    details: {
        type: String
    },
    ip: {
        type: String
    }
}, {
    timestamps: true
});

const SecurityLog = mongoose.model('SecurityLog', securityLogSchema);
export default SecurityLog;
