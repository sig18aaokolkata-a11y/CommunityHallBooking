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
    startTime: {
        type: String,
        required: [true, 'Please provide a start time.'],
    },
    endTime: {
        type: String,
        required: [true, 'Please provide an end time.'],
    },
    eventType: {
        type: String,
        required: [true, 'Please provide the type of event.'],
    },
    guestCount: {
        type: Number,
        required: [true, 'Please provide the approximate number of guests.'],
        min: [1, 'Guest count must be at least 1'],
        max: [500, 'Guest count cannot exceed 500'],
    },
    parkingCount: {
        type: Number,
        required: [true, 'Please provide the approximate number of guest cars.'],
        min: [1, 'Parking count must be at least 1'],
        max: [20, 'Parking count cannot exceed 20'],
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
