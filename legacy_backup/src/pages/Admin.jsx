import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import * as XLSX from 'xlsx';
import { getBookingsByDateRange, updatePaymentStatus, deleteBooking, createBooking } from '../services/bookingService';
import AddBookingModal from '../components/AddBookingModal';
import './Admin.css';

const Admin = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Simple hardcoded password for demo purposes
    const ADMIN_PASSWORD = "Signature18";

    useEffect(() => {
        if (isAuthenticated) {
            fetchBookings();
        }
    }, [isAuthenticated, startDate, endDate]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
        } else {
            alert("Incorrect password");
        }
    };

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const data = await getBookingsByDateRange(startDate, endDate);
            // Sort by date
            data.sort((a, b) => new Date(a.date) - new Date(b.date));
            setBookings(data);
        } catch (error) {
            console.error("Error fetching bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentToggle = async (booking) => {
        if (!window.confirm(`Mark ${booking.bookedBy}'s booking as ${booking.isPaid ? 'Unpaid' : 'Paid'}?`)) return;

        try {
            await updatePaymentStatus(booking.date, !booking.isPaid);
            // Optimistic update
            setBookings(bookings.map(b =>
                b.date === booking.date ? { ...b, isPaid: !b.isPaid } : b
            ));
        } catch (error) {
            alert("Failed to update payment status");
        }
    };

    const handleDelete = async (booking) => {
        if (!window.confirm(`Are you sure you want to delete the booking for ${booking.date}?`)) return;

        try {
            await deleteBooking(booking.date);
            setBookings(bookings.filter(b => b.date !== booking.date));
        } catch (error) {
            alert("Failed to delete booking");
        }
    };

    const handleAddBooking = async (data) => {
        setIsSubmitting(true);
        try {
            await createBooking(data.date, { bookedBy: data.bookedBy, flatNumber: data.flatNumber });
            await fetchBookings();
            setIsAddModalOpen(false);
            alert("Booking added successfully");
        } catch (error) {
            alert("Failed to add booking: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const downloadReport = () => {
        const data = bookings.map(b => ({
            Date: b.date,
            "Booked By": b.bookedBy,
            "Flat Number": b.flatNumber,
            "Payment Status": b.isPaid ? "Paid" : "Pending",
            "Created At": b.createdAt?.toDate ? b.createdAt.toDate().toLocaleString() : ''
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Bookings");
        XLSX.writeFile(wb, `bookings_${startDate}_to_${endDate}.xlsx`);
    };

    if (!isAuthenticated) {
        return (
            <div className="admin-login-container">
                <div className="card login-card">
                    <h2>Admin Login</h2>
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter admin password"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Login</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h2>Admin Dashboard</h2>
                <div className="controls">
                    <div className="date-filters">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <span>to</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-secondary" onClick={fetchBookings}>Refresh</button>
                    <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>Add Booking</button>
                    <button className="btn btn-success" onClick={downloadReport} style={{ backgroundColor: 'var(--success-color)', color: 'white' }}>Excel</button>
                </div>
            </div>

            <div className="bookings-table-container card">
                {loading ? (
                    <p>Loading bookings...</p>
                ) : bookings.length === 0 ? (
                    <p>No bookings found for this period.</p>
                ) : (
                    <table className="bookings-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Booked By</th>
                                <th>Flat Number</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.date}>
                                    <td>{booking.date}</td>
                                    <td>{booking.bookedBy}</td>
                                    <td>{booking.flatNumber}</td>
                                    <td>
                                        <span className={`status-badge ${booking.isPaid ? 'available' : 'booked'}`}
                                            style={{ backgroundColor: booking.isPaid ? '#d1fae5' : '#fee2e2', color: booking.isPaid ? '#065f46' : '#991b1b' }}>
                                            {booking.isPaid ? 'Paid' : 'Pending'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn btn-sm"
                                                onClick={() => handlePaymentToggle(booking)}
                                                style={{ border: '1px solid var(--border-color)', marginRight: '0.5rem' }}
                                            >
                                                {booking.isPaid ? 'Unpaid' : 'Paid'}
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDelete(booking)}
                                                style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <AddBookingModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onConfirm={handleAddBooking}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};

export default Admin;
