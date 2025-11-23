import dbConnect from '@/lib/dbConnect';
import Booking from '@/models/Booking';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
    await dbConnect();
    const { id } = await params;

    try {
        const body = await request.json();
        const booking = await Booking.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!booking) {
            return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: booking });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(request, { params }) {
    await dbConnect();
    const { id } = await params;

    try {
        const deletedBooking = await Booking.findByIdAndDelete(id);

        if (!deletedBooking) {
            return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
