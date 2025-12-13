import dbConnect from '@/lib/dbConnect';
import Booking from '@/models/Booking';
import { NextResponse } from 'next/server';

export async function GET(request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    let query = {};
    if (start && end) {
        query.date = { $gte: start, $lte: end };
    }

    try {
        const bookings = await Booking.find(query).sort({ date: 1 });
        return NextResponse.json({ success: true, data: bookings });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(request) {
    await dbConnect();

    try {
        const body = await request.json();
        const booking = await Booking.create(body);
        return NextResponse.json({ success: true, data: booking }, { status: 201 });
    } catch (error) {
        if (error.code === 11000) {
            return NextResponse.json({ success: false, error: 'Date is already booked' }, { status: 409 });
        }
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action !== 'deleteAll') {
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }

    try {
        await Booking.deleteMany({});
        return NextResponse.json({ success: true, message: 'All bookings deleted' });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
