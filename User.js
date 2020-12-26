import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 5,
    },
    password: {
        type: String,
        required: true,
        min: 8,
    },
    balance: {
        type: Number,
        default: 100,
    }
})

export default mongoose.model('User', userSchema);