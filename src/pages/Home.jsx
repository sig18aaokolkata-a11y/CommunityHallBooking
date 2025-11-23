import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { format, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { getBookingsByDateRange, createBooking } from '../services/bookingService';
import BookingModal from '../components/BookingModal';
import 'react-calendar/dist/Calendar.css';
import './Home.css';

const Home = () => {
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
            const data = await getBookingsByDateRange(start, end);

            const newMap = {};
            data.forEach(b => {
                newMap[b.date] = b;
            });
            setBookingsMap(prev => ({ ...prev, ...newMap }));
        } catch (error) {
            console.error("Error fetching bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async (bookingData) => {
        setIsSubmitting(true);
        try {
            await createBooking(dateStr, bookingData);
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
        <div className="home-container">
            <div className="calendar-section card">
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

            <div className="details-section card">
                <h2>Details for {format(date, 'MMMM d, yyyy')}</h2>

                {loading && Object.keys(bookingsMap).length === 0 ? (
                    <p>Loading...</p>
                ) : selectedBooking ? (
                    <div className="booking-info">
                        <div className={`status-badge ${selectedBooking.isPaid ? 'paid-badge' : 'booked'}`}>
                            {selectedBooking.isPaid ? 'Booked (Paid)' : 'Booked (Pending)'}
                        </div>
                        <div className="info-row">
                            <span className="label">Booked By:</span>
                            <span className="value">{selectedBooking.bookedBy}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Flat Number:</span>
                            <span className="value">{selectedBooking.flatNumber}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Payment Status:</span>
                            <span className={`value status-${selectedBooking.isPaid ? 'paid' : 'pending'}`}>
                                {selectedBooking.isPaid ? 'Paid' : 'Pending'}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="booking-info">
                        <div className="status-badge available">Available</div>
                        <p className="description">This date is available for booking.</p>
                        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                            Book Now
                        </button>
                    </div>
                )}
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
};

export default Home;
