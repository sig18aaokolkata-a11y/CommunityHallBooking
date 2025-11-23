import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './Layout.css';

const Layout = () => {
    return (
        <div className="app-container">
            <header className="main-header">
                <div className="container header-content">
                    <Link to="/" className="logo">
                        Community Hall
                    </Link>
                    <nav>
                        <ul className="nav-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/admin">Admin</Link></li>
                        </ul>
                    </nav>
                </div>
            </header>
            <main className="main-content container">
                <Outlet />
            </main>
            <footer className="main-footer">
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} Community Hall Booking</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
