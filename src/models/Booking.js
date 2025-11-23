import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
    date: {
        type: String,
        required: [true, 'Please provide a date for this booking.'],
        unique: true, // Ensure one booking per date
        match: [/^\d{4}-\d{2}-\d{2}$/, 'Please provide a valid date in YYYY-MM-DD format'],
    },
    bookedBy: {
        type: String,
        required: [true, 'Please provide the name of the person booking.'],
        maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    flatNumber: {
        type: String,
        required: [true, 'Please provide the flat number.'],
        maxlength: [20, 'Flat number cannot be more than 20 characters'],
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
