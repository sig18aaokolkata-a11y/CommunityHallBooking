'use client';

import React, { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { useParams } from 'next/navigation';
import TermsAndConditions from '@/components/TermsAndConditions';

export default function PrintPage() {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/bookings/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setBooking(data.data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div>Loading booking details...</div>;
    if (!booking) return <div>Booking not found.</div>;

    const formattedDate = format(parseISO(booking.date), 'dd/MM/yy');

    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':');
        const h = parseInt(hours, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return `${h12}:${minutes} ${ampm}`;
    };

    // Mimic the image layout
    return (
        <div style={{
            fontFamily: 'Arial, sans-serif',
            maxWidth: '800px',
            margin: '0 auto',
            padding: '20px', // Reduced padding
            color: '#000',
            lineHeight: '1.3' // Reduced line height
        }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ width: '60px', marginRight: '15px' }}>
                    <img src="/logo.jpg" alt="Signature 18" style={{ maxWidth: '100%', height: 'auto' }} />
                </div>
                <div style={{ flex: 1, textAlign: 'center', paddingTop: '5px' }}>
                    <h1 style={{ textDecoration: 'underline', marginBottom: '5px', fontSize: '1.2rem' }}>Community Hall Booking Form</h1>
                </div>
            </div>

            <p style={{ fontStyle: 'italic', marginBottom: '15px', fontSize: '0.9rem' }}>
                Hand over the signed form to Facility Manager:
            </p>

            <div style={{ marginBottom: '15px', fontSize: '0.9rem' }}>
                <div style={{ marginBottom: '5px' }}>
                    <strong>Flat Number:</strong> <span style={{ textDecoration: 'underline' }}>{booking.flatNumber}</span>
                </div>
                <div style={{ marginBottom: '5px' }}>
                    <strong>Owner Name:</strong> <span style={{ textDecoration: 'underline', textTransform: 'uppercase' }}>{booking.bookedBy}</span>
                </div>
                <div style={{ marginBottom: '5px' }}>
                    <strong>Event Date:</strong> <span style={{ textDecoration: 'underline' }}>{formattedDate}</span>
                </div>
                <div style={{ marginBottom: '5px' }}>
                    <strong>Start and End Time:</strong> <span style={{ textDecoration: 'underline' }}>{formatTime(booking.startTime)} to {formatTime(booking.endTime)}</span>
                </div>
                <div style={{ marginBottom: '5px' }}>
                    <strong>Event Type:</strong> <span style={{ textDecoration: 'underline' }}>{booking.eventType}</span>
                </div>
                <div style={{ marginBottom: '5px' }}>
                    <strong>Approx. No of Guests:</strong> <span style={{ textDecoration: 'underline' }}>{booking.guestCount}</span>
                </div>
                <div style={{ marginBottom: '5px' }}>
                    <strong>Approx. No. of Car parking spots required:</strong> <span style={{ textDecoration: 'underline' }}>{booking.parkingCount}</span>
                </div>
            </div>

            <TermsAndConditions style={{ fontSize: '0.75rem', marginBottom: '20px' }} />

            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <div>
                    <div style={{ marginBottom: '5px' }}>
                        <strong>Owner's Signature:</strong> ____________________________
                    </div>
                    <div>
                        <strong>Date:</strong> ____________________________
                    </div>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '20px', color: '#666', fontSize: '0.8rem' }}>
                Thank you for booking Signature 18 Community Hall
            </div>

            <div className="no-print" style={{ textAlign: 'center', marginTop: '20px' }}>
                <button
                    onClick={() => window.print()}
                    style={{ padding: '8px 16px', fontSize: '0.9rem', cursor: 'pointer', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '4px' }}
                >
                    Print Form
                </button>
            </div>

            <style jsx global>{`
                @media print {
                    @page {
                        size: A4;
                        margin: 1cm;
                    }
                    .no-print {
                        display: none !important;
                    }
                    body {
                        background: #fff;
                        font-size: 11pt; /* slightly larger for readability on A4 */
                        -webkit-print-color-adjust: exact;
                    }
                    /* Ensure container takes full width but respects margins */
                    div[style*="max-width: 800px"] {
                        max-width: 100% !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                }
            `}</style>
        </div>
    );
}
