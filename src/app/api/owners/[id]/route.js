import dbConnect from '@/lib/dbConnect';
import Owner from '@/models/Owner';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
    await dbConnect();
    const { id } = await params;

    try {
        const body = await request.json();
        const owner = await Owner.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!owner) {
            return NextResponse.json({ success: false, error: 'Owner not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: owner });
    } catch (error) {
        if (error.code === 11000) {
            return NextResponse.json({ success: false, error: 'Flat number already exists' }, { status: 400 });
        }
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(request, { params }) {
    await dbConnect();
    const { id } = await params;

    try {
        const deletedOwner = await Owner.findByIdAndDelete(id);

        if (!deletedOwner) {
            return NextResponse.json({ success: false, error: 'Owner not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
