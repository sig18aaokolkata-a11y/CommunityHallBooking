'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';

import AdminBookingModal from '@/components/AdminBookingModal';

export default function Admin() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const auth = localStorage.getItem('adminAuth');
        if (auth === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchBookings();
        }
    }, [isAuthenticated]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'BosePukur@Kolkata42') {
            setIsAuthenticated(true);
            localStorage.setItem('adminAuth', 'true');
        } else {
            alert('Invalid password');
        }
    };

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/bookings');
            const data = await res.json();
            if (data.success) {
                setBookings(data.data);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddBooking = async (bookingData) => {
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to add booking');
            }

            await fetchBookings();
            setIsAddModalOpen(false);
            alert('Booking added successfully!');
        } catch (error) {
            alert('Failed to add booking: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const togglePayment = async (booking) => {
        if (!confirm(`Mark ${booking.bookedBy}'s booking as ${booking.isPaid ? 'Unpaid' : 'Paid'}?`)) return;

        try {
            const res = await fetch(`/api/bookings/${booking._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isPaid: !booking.isPaid }),
            });
            const data = await res.json();
            if (data.success) {
                fetchBookings();
            } else {
                alert('Failed to update: ' + data.error);
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    const deleteBooking = async (id) => {
        if (!confirm('Are you sure you want to delete this booking? This cannot be undone.')) return;

        try {
            const res = await fetch(`/api/bookings/${id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success) {
                fetchBookings();
            } else {
                alert('Failed to delete: ' + data.error);
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');

    const initiateDeleteAll = () => {
        if (confirm('WARNING: Are you sure you want to DELETE ALL bookings? This will wipe the entire calendar and CANNOT be undone.')) {
            setDeletePassword('');
            setIsDeleteModalOpen(true);
        }
    };

    const confirmDeleteAll = async (e) => {
        e.preventDefault();
        if (deletePassword !== 'BosePukur@Kolkata42') {
            alert('Incorrect password.');
            return;
        }

        try {
            const res = await fetch('/api/bookings?action=deleteAll', {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success) {
                fetchBookings();
                setIsDeleteModalOpen(false);
                alert('All bookings have been deleted.');
            } else {
                alert('Failed to delete all: ' + data.error);
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    const getFilteredBookings = () => {
        return bookings.filter(b => {
            if (startDate && b.date < startDate) return false;
            if (endDate && b.date > endDate) return false;
            return true;
        });
    };

    const downloadReport = () => {
        const filteredBookings = getFilteredBookings();

        const ws = XLSX.utils.json_to_sheet(filteredBookings.map(b => ({
            Date: b.date,
            'Time Slot': `${b.startTime} - ${b.endTime}`,
            'Event Type': b.eventType || 'N/A',
            'Guests': b.guestCount || 'N/A',
            'Parking': b.parkingCount || 'N/A',
            'Booked By': b.bookedBy,
            'Flat Number': b.flatNumber,
            'Payment Status': b.isPaid ? 'Paid' : 'Pending',
            'Created At': format(new Date(b.createdAt), 'yyyy-MM-dd HH:mm:ss')
        })));

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Bookings");
        XLSX.writeFile(wb, "community_hall_bookings.xlsx");
    };

    if (!isAuthenticated) {
        return (
            <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                    <h2 style={{ textAlign: 'center' }}>Admin Login</h2>
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
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
                    </form>
                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <a href="/" style={{ color: 'var(--primary-color)' }}>Back to Home</a>
                    </div>
                </div>
            </div>
        );
    }

    const filteredBookings = getFilteredBookings();

    return (
        <div className="container">
            <header className="header-responsive">
                <h1>Admin Dashboard</h1>
                <div>
                    <a href="/admin/owners" className="btn btn-secondary" style={{ marginRight: '1rem' }}>Manage Owners</a>
                    <a href="/" className="btn btn-secondary" style={{ marginRight: '1rem' }}>Back to Home</a>
                    <button onClick={() => {
                        setIsAuthenticated(false);
                        localStorage.removeItem('adminAuth');
                    }} className="btn btn-danger">Logout</button>
                </div>
            </header>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h2>All Bookings</h2>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary">Add Booking</button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <label style={{ fontWeight: '500' }}>From:</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <label style={{ fontWeight: '500' }}>To:</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                            />
                        </div>
                        <button onClick={downloadReport} className="btn btn-success" style={{ marginRight: '1rem' }}>Download Report</button>
                        <button onClick={initiateDeleteAll} className="btn btn-danger">Delete All Bookings</button>
                    </div>
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                                    <th style={{ padding: '1rem' }}>Date</th>
                                    <th style={{ padding: '1rem' }}>Time Slot</th>
                                    <th style={{ padding: '1rem' }}>Event Type</th>
                                    <th style={{ padding: '1rem' }}>Guests</th>
                                    <th style={{ padding: '1rem' }}>Parking</th>
                                    <th style={{ padding: '1rem' }}>Booked By</th>
                                    <th style={{ padding: '1rem' }}>Flat No</th>
                                    <th style={{ padding: '1rem' }}>Status</th>
                                    <th style={{ padding: '1rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" style={{ padding: '1rem', textAlign: 'center' }}>No bookings found</td>
                                    </tr>
                                ) : (
                                    filteredBookings.map((booking) => (
                                        <tr key={booking._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                            <td style={{ padding: '1rem' }}>{booking.date}</td>
                                            <td style={{ padding: '1rem' }}>{booking.startTime} - {booking.endTime}</td>
                                            <td style={{ padding: '1rem' }}>{booking.eventType}</td>
                                            <td style={{ padding: '1rem' }}>{booking.guestCount}</td>
                                            <td style={{ padding: '1rem' }}>{booking.parkingCount}</td>
                                            <td style={{ padding: '1rem' }}>{booking.bookedBy}</td>
                                            <td style={{ padding: '1rem' }}>{booking.flatNumber}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '9999px',
                                                    fontSize: '0.8rem',
                                                    backgroundColor: booking.isPaid ? '#d1fae5' : '#fee2e2',
                                                    color: booking.isPaid ? '#065f46' : '#991b1b'
                                                }}>
                                                    {booking.isPaid ? 'Paid' : 'Pending'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <button
                                                    onClick={() => togglePayment(booking)}
                                                    className="btn btn-secondary"
                                                    style={{ marginRight: '0.5rem', fontSize: '0.8rem' }}
                                                >
                                                    {booking.isPaid ? 'Unconfirm Pay' : 'Confirm Pay'}
                                                </button>
                                                <button
                                                    onClick={() => deleteBooking(booking._id)}
                                                    className="btn btn-danger"
                                                    style={{ fontSize: '0.8rem' }}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <AdminBookingModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onConfirm={handleAddBooking}
                isSubmitting={isSubmitting}
            />

            {isDeleteModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '400px' }}>
                        <h2>Confirm Deletion</h2>
                        <p style={{ marginBottom: '1rem', color: 'var(--danger)' }}>
                            This will delete ALL bookings permanently.
                        </p>
                        <form onSubmit={confirmDeleteAll}>
                            <div className="form-group">
                                <label>Enter Admin Password</label>
                                <input
                                    type="password"
                                    value={deletePassword}
                                    onChange={(e) => setDeletePassword(e.target.value)}
                                    placeholder="Password"
                                    autoFocus
                                />
                            </div>
                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setIsDeleteModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-danger">
                                    Confirm Delete
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
