'use client';

import React, { useState } from 'react';

const BookingModal = ({ isOpen, onClose, onConfirm, dateStr, isSubmitting }) => {
    const [name, setName] = useState('');
    const [flatNumber, setFlatNumber] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !flatNumber.trim() || !startTime || !endTime) {
            setError('Please fill in all fields');
            return;
        }
        onConfirm({ bookedBy: name, flatNumber, startTime, endTime });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Book Hall for {dateStr}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
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
                            placeholder="Enter your flat number"
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="startTime">Start Time</label>
                        <input
                            type="time"
                            id="startTime"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="endTime">End Time</label>
                        <input
                            type="time"
                            id="endTime"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>
                    {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</p>}
                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;
