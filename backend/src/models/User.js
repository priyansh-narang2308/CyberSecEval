import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    universityId: {
        type: String,
        required: [true, 'University ID is required'],
        unique: true,
        trim: true
    },
    passwordHash: {
        type: String,
        required: [true, 'Password hash is required']
    },
    role: {
        type: String,
        enum: ['student', 'faculty', 'admin'],
        default: 'student'
    },
    mfaEnabled: {
        type: Boolean,
        default: false
    },
    mfaOTP: {
        type: String,
        default: null
    },
    mfaExpiry: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;
