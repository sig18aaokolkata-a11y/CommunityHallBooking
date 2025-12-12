import dbConnect from '@/lib/dbConnect';
import Owner from '@/models/Owner';
import { NextResponse } from 'next/server';
import ownersData from '@/data/owners.json';

export async function GET() {
    await dbConnect();

    try {
        // Option 1: Clear and Insert (Clean slate)
        // await Owner.deleteMany({});

        // Option 2: Insert and ignore duplicates (Preserve manual edits if any, but fails on first error usually unless ordered: false)
        // We will use bulkWrite for better control or just loop. 
        // Given the dataset is small (~70), loop with upsert is fine/safest.

        let count = 0;
        for (const owner of ownersData) {
            await Owner.updateOne(
                { flatNumber: owner.flatNumber },
                { $set: { name: owner.name } }, // Update name if flat exists
                { upsert: true }
            );
            count++;
        }

        return NextResponse.json({ success: true, message: `Seeded/Updated ${count} owners.` });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
