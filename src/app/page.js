'use client';

import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import 'react-calendar/dist/Calendar.css';
import BookingModal from '@/components/BookingModal';

export default function Home() {
  const [date, setDate] = useState(new Date());
  const [bookingsMap, setBookingsMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStartDate, setActiveStartDate] = useState(new Date());

  const dateStr = format(date, 'yyyy-MM-dd');
  const selectedBooking = bookingsMap[dateStr];

  useEffect(() => {
    fetchBookingsForMonth(activeStartDate);
  }, [activeStartDate]);

  const fetchBookingsForMonth = async (currentDate) => {
    setLoading(true);
    try {
      const start = format(startOfMonth(currentDate), 'yyyy-MM-dd');
      const end = format(endOfMonth(currentDate), 'yyyy-MM-dd');
      const res = await fetch(`/api/bookings?start=${start}&end=${end}`);
      const data = await res.json();

      if (data.success) {
        const newMap = {};
        data.data.forEach(b => {
          newMap[b.date] = b;
        });
        setBookingsMap(prev => ({ ...prev, ...newMap }));
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (bookingData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: dateStr,
          ...bookingData,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to book');
      }

      // Refresh current month data
      await fetchBookingsForMonth(activeStartDate);
      setIsModalOpen(false);
      alert('Booking successful!');
    } catch (error) {
      alert('Failed to book: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dStr = format(date, 'yyyy-MM-dd');
      const booking = bookingsMap[dStr];
      if (booking) {
        return booking.isPaid ? 'calendar-tile-paid' : 'calendar-tile-booked';
      }
    }
    return null;
  };

  return (
    <div className="container">
      <header className="header-responsive">
        <h1>Signature18 Community Hall Booking</h1>
        <a href="/admin" className="btn btn-secondary">Admin Login</a>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div className="card">
          <h2>Check Availability</h2>
          <Calendar
            onChange={setDate}
            value={date}
            minDate={new Date()}
            className="custom-calendar"
            onActiveStartDateChange={({ activeStartDate }) => setActiveStartDate(activeStartDate)}
            tileClassName={tileClassName}
          />
          <div className="legend">
            <div className="legend-item"><span className="dot available"></span> Available</div>
            <div className="legend-item"><span className="dot booked"></span> Booked (Unpaid)</div>
            <div className="legend-item"><span className="dot paid"></span> Booked (Paid)</div>
          </div>
        </div>

        <div className="card">
          <h2>Details for {format(date, 'MMMM d, yyyy')}</h2>

          {loading && Object.keys(bookingsMap).length === 0 ? (
            <p>Loading...</p>
          ) : selectedBooking ? (
            <div className="booking-info">
              <div style={{
                padding: '0.5rem',
                borderRadius: '4px',
                backgroundColor: selectedBooking.isPaid ? '#d1fae5' : '#fee2e2',
                color: selectedBooking.isPaid ? '#065f46' : '#991b1b',
                fontWeight: 'bold',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                {selectedBooking.isPaid ? 'Booked (Paid)' : 'Booked (Pending)'}
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '600' }}>Booked By:</span> {selectedBooking.bookedBy}
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '600' }}>Flat Number:</span> {selectedBooking.flatNumber}
              </div>
              <div>
                <span style={{ fontWeight: '600' }}>Payment Status:</span> {selectedBooking.isPaid ? 'Paid' : 'Pending'}
              </div>
              {!selectedBooking.isPaid && (
                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                  <p style={{ marginBottom: '0.5rem', fontWeight: '500' }}>Scan to Pay</p>
                  <img
                    src="/upi-qr.jpg"
                    alt="UPI QR Code"
                    style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="booking-info">
              <div style={{
                padding: '0.5rem',
                borderRadius: '4px',
                backgroundColor: '#e2e8f0',
                color: '#1e293b',
                fontWeight: 'bold',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                Available
              </div>
              <p style={{ marginBottom: '0.5rem' }}>This date is available for booking.</p>
              <p style={{ marginBottom: '1rem', fontWeight: '500' }}>Booking amount is Rs4500</p>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setIsModalOpen(true)}>
                Book Now
              </button>
            </div>
          )}
        </div>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleBooking}
        dateStr={dateStr}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
