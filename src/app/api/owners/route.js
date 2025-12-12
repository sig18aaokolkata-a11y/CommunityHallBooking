import dbConnect from '@/lib/dbConnect';
import Owner from '@/models/Owner';
import { NextResponse } from 'next/server';

export async function GET() {
    await dbConnect();

    try {
        const owners = await Owner.find({}).sort({ flatNumber: 1 });
        return NextResponse.json({ success: true, data: owners });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(request) {
    await dbConnect();

    try {
        const body = await request.json();
        const owner = await Owner.create(body);
        return NextResponse.json({ success: true, data: owner }, { status: 201 });
    } catch (error) {
        if (error.code === 11000) {
            return NextResponse.json({ success: false, error: 'Flat number already exists' }, { status: 400 });
        }
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
