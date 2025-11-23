import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import { getBooking, createBooking } from '../services/bookingService';
import BookingModal from '../components/BookingModal';
import 'react-calendar/dist/Calendar.css';
import './Home.css';

const Home = () => {
    const [date, setDate] = useState(new Date());
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const dateStr = format(date, 'yyyy-MM-dd');

    useEffect(() => {
        fetchBooking();
    }, [dateStr]);

    const fetchBooking = async () => {
        setLoading(true);
        try {
            const data = await getBooking(dateStr);
            setBooking(data);
        } catch (error) {
            console.error("Error fetching booking:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async (bookingData) => {
        setIsSubmitting(true);
        try {
            await createBooking(dateStr, bookingData);
            await fetchBooking();
            setIsModalOpen(false);
            alert('Booking successful!');
        } catch (error) {
            alert('Failed to book: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
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
                />
            </div>

            <div className="details-section card">
                <h2>Details for {format(date, 'MMMM d, yyyy')}</h2>

                {loading ? (
                    <p>Loading...</p>
                ) : booking ? (
                    <div className="booking-info">
                        <div className="status-badge booked">Booked</div>
                        <div className="info-row">
                            <span className="label">Booked By:</span>
                            <span className="value">{booking.bookedBy}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Flat Number:</span>
                            <span className="value">{booking.flatNumber}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Payment Status:</span>
                            <span className={`value status-${booking.isPaid ? 'paid' : 'pending'}`}>
                                {booking.isPaid ? 'Paid' : 'Pending'}
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
