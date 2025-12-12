'use client';

import React, { useState, useEffect } from 'react';

export default function OwnersPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOwner, setEditingOwner] = useState(null);
    const [formData, setFormData] = useState({ name: '', flatNumber: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        const auth = localStorage.getItem('adminAuth');
        if (auth !== 'true') {
            window.location.href = '/admin';
        } else {
            setIsAuthenticated(true);
            fetchOwners();
        }
    }, []);

    const fetchOwners = async () => {
        try {
            const res = await fetch('/api/owners');
            const data = await res.json();
            if (data.success) {
                setOwners(data.data);
            }
        } catch (err) {
            console.error('Error fetching owners:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (owner) => {
        setEditingOwner(owner);
        setFormData({ name: owner.name, flatNumber: owner.flatNumber });
        setError('');
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this owner?')) return;
        try {
            const res = await fetch(`/api/owners/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchOwners();
            } else {
                alert('Failed to delete owner');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name.trim() || !formData.flatNumber.trim()) {
            setError('Please fill in both fields');
            return;
        }

        const url = editingOwner ? `/api/owners/${editingOwner._id}` : '/api/owners';
        const method = editingOwner ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success) {
                setIsModalOpen(false);
                setEditingOwner(null);
                setFormData({ name: '', flatNumber: '' });
                fetchOwners();
            } else {
                setError(data.error || 'Operation failed');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className="container">
            <header className="header-responsive" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <a href="/admin" style={{ textDecoration: 'none', color: '#1a1a1a', fontSize: '1.2rem' }}>← Back</a>
                    <h1 style={{ margin: 0 }}>Manage Owners</h1>
                </div>
                <button className="btn btn-primary" onClick={() => {
                    setEditingOwner(null);
                    setFormData({ name: '', flatNumber: '' });
                    setError('');
                    setIsModalOpen(true);
                }}>Add Owner</button>
            </header>

            <div className="card">
                {loading ? <p>Loading...</p> : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                                <th style={{ padding: '1rem' }}>Flat No</th>
                                <th style={{ padding: '1rem' }}>Owner Name</th>
                                <th style={{ padding: '1rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {owners.length === 0 ? (
                                <tr><td colSpan="3" style={{ padding: '1rem', textAlign: 'center' }}>No owners found</td></tr>
                            ) : (
                                owners.map(owner => (
                                    <tr key={owner._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                        <td style={{ padding: '1rem' }}>{owner.flatNumber}</td>
                                        <td style={{ padding: '1rem' }}>{owner.name}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <button
                                                onClick={() => handleEdit(owner)}
                                                style={{ marginRight: '0.5rem', background: 'none', border: 'none', color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(owner._id)}
                                                style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', textDecoration: 'underline' }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{editingOwner ? 'Edit Owner' : 'Add New Owner'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Flat Number</label>
                                <input
                                    type="text"
                                    value={formData.flatNumber}
                                    onChange={e => setFormData({ ...formData, flatNumber: e.target.value.toUpperCase() })}
                                    placeholder="e.g., 4C"
                                />
                            </div>
                            <div className="form-group">
                                <label>Owner Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., John Doe"
                                />
                            </div>
                            {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
