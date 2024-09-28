import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    public_key: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    is_verified: {
        type: Boolean,
        default: false,
    },
    encrypted_private_key: {
        type: String,
        required: true,
    },
    otp: {
        code: String,
        createdAt: Date
    },
    user_type: {
        type: String,
        enum: ['user', 'institution', 'admin']
    }
}, { timestamps: true });

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
