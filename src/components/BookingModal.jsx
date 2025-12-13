'use client';

import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import TermsAndConditions from './TermsAndConditions';

const BookingModal = ({ isOpen, onClose, onConfirm, dateStr, isSubmitting }) => {
    const [name, setName] = useState('');
    const [flatNumber, setFlatNumber] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [eventType, setEventType] = useState('');
    const [guestCount, setGuestCount] = useState('');
    const [parkingCount, setParkingCount] = useState('');
    const [error, setError] = useState('');
    const [showTnC, setShowTnC] = useState(false);
    const [owners, setOwners] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    React.useEffect(() => {
        if (isOpen) {
            fetch('/api/owners')
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setOwners(data.data);
                    }
                })
                .catch(err => console.error('Error fetching owners:', err));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleNameChange = (e) => {
        const val = e.target.value;
        setName(val);

        if (val.length > 0) {
            const matches = owners.filter(o => o.name.toLowerCase().includes(val.toLowerCase()));
            setSuggestions(matches);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (owner) => {
        setName(owner.name);
        setFlatNumber(owner.flatNumber);
        setShowSuggestions(false);
    };

    const handleFlatChange = (e) => {
        const val = e.target.value.toUpperCase();
        setFlatNumber(val);

        // Auto-populate name if flat matches exactly
        const owner = owners.find(o => o.flatNumber === val);
        if (owner) {
            setName(owner.name);
        }
    };

    const handleGuestChange = (e) => {
        const val = e.target.value;
        if (val === '') {
            setGuestCount('');
            return;
        }
        const num = parseInt(val);
        if (num > 500) {
            setError('Guest count cannot exceed 500');
        } else {
            setError('');
            setGuestCount(val);
        }
    };

    const handleParkingChange = (e) => {
        const val = e.target.value;
        if (val === '') {
            setParkingCount('');
            return;
        }
        const num = parseInt(val);
        if (num > 20) {
            setError('Parking count cannot exceed 20');
        } else {
            setError('');
            setParkingCount(val);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !flatNumber.trim() || !startTime || !endTime || !eventType.trim() || !guestCount || !parkingCount) {
            setError('Please fill in all fields');
            return;
        }

        const guests = parseInt(guestCount);
        const parking = parseInt(parkingCount);

        if (guests < 1) {
            setError('Guest count must be at least 1');
            return;
        }

        if (parking < 1) {
            setError('Parking count must be at least 1');
            return;
        }

        onConfirm({
            bookedBy: name,
            flatNumber,
            startTime,
            endTime,
            eventType,
            guestCount: guests,
            parkingCount: parking
        });
    };

    const formattedDate = dateStr ? format(parseISO(dateStr), 'dd-MMM-yyyy') : '';

    if (showTnC) {
        return (
            <div className="modal-overlay" style={{ zIndex: 1100 }}>
                <div className="modal-content" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Terms and Conditions</h2>
                    <TermsAndConditions />
                    <div className="modal-actions" style={{ marginTop: '1rem', justifyContent: 'center' }}>
                        <button className="btn btn-primary" onClick={() => setShowTnC(false)}>Close</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Book Hall for {formattedDate}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="flat">Flat Number</label>
                        <input
                            type="text"
                            id="flat"
                            value={flatNumber}
                            onChange={handleFlatChange}
                            placeholder="Enter your flat number"
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="form-group" style={{ position: 'relative' }}>
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={handleNameChange}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            placeholder="Enter your full name"
                            disabled={isSubmitting}
                            autoComplete="off"
                        />
                        {showSuggestions && suggestions.length > 0 && (
                            <ul style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                backgroundColor: 'white',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                listStyle: 'none',
                                padding: 0,
                                margin: 0,
                                maxHeight: '150px',
                                overflowY: 'auto',
                                zIndex: 10,
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }}>
                                {suggestions.map(owner => (
                                    <li
                                        key={owner._id}
                                        onMouseDown={() => handleSuggestionClick(owner)}
                                        style={{
                                            padding: '0.5rem',
                                            cursor: 'pointer',
                                            borderBottom: '1px solid #eee'
                                        }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f9ff'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                                    >
                                        {owner.name} ({owner.flatNumber})
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="eventType">Event Type</label>
                        <input
                            type="text"
                            id="eventType"
                            value={eventType}
                            onChange={(e) => setEventType(e.target.value)}
                            placeholder="e.g., Birthday, Marriage, Meeting"
                            disabled={isSubmitting}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label htmlFor="guestCount">Approx. Number of Guests</label>
                            <input
                                type="number"
                                id="guestCount"
                                value={guestCount}
                                onChange={handleGuestChange}
                                min="1"
                                max="500"
                                placeholder="Enter guests count"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="parkingCount">Approx. Guest Car Parking</label>
                            <input
                                type="number"
                                id="parkingCount"
                                value={parkingCount}
                                onChange={handleParkingChange}
                                min="1"
                                max="20"
                                placeholder="Enter parking count"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                    </div>

                    {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</p>}

                    <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                        <span
                            style={{ color: 'var(--primary-color)', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem' }}
                            onClick={() => setShowTnC(true)}
                        >
                            View Terms and Conditions
                        </span>
                    </div>

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
