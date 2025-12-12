import mongoose from 'mongoose';

const OwnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide the owner name.'],
        trim: true,
    },
    flatNumber: {
        type: String,
        required: [true, 'Please provide the flat number.'],
        unique: true,
        trim: true,
        uppercase: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Owner || mongoose.model('Owner', OwnerSchema);
