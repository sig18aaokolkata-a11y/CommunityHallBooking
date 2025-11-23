'use client';

import React, { useState } from 'react';

const AdminBookingModal = ({ isOpen, onClose, onConfirm, isSubmitting }) => {
    const [date, setDate] = useState('');
    const [name, setName] = useState('');
    const [flatNumber, setFlatNumber] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!date || !name.trim() || !flatNumber.trim()) {
            setError('Please fill in all fields');
            return;
        }
        onConfirm({ date, bookedBy: name, flatNumber });
        // Reset form after submit (optional, depending on behavior)
        if (!isSubmitting) {
            // We'll let the parent handle closing, but we can clear error
            setError('');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Add New Booking</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            disabled={isSubmitting}
                            min={new Date().toISOString().split('T')[0]} // Optional: prevent past dates? Admin might need to record past bookings though. Let's remove min for admin flexibility or keep it if strict. User didn't specify. I'll keep it open.
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter full name"
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="flat">Flat Number</label>
                        <input
                            type="text"
                            id="flat"
                            value={flatNumber}
                            onChange={(e) => setFlatNumber(e.target.value)}
                            placeholder="Enter flat number"
                            disabled={isSubmitting}
                        />
                    </div>
                    {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</p>}
                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Adding...' : 'Add Booking'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminBookingModal;
