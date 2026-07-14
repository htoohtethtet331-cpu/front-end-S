import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

function TopNav() {
    const { currentUser } = useContext(AuthContext);

    return (
        <header className="app-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px', position: 'sticky', top: 0, zIndex: 1000}}>
            {/* Left: Profile Pic */}
            <div style={{flex: 1, display: 'flex', justifyContent: 'flex-start'}}>
                <div className="avatar" style={{width: '40px', height: '40px', borderRadius: '50%', background: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer'}}>
                    {currentUser?.photo_url ? (
                        <img src={currentUser.photo_url} alt="Profile" style={{height: '100%', width: '100%', objectFit: 'cover'}} />
                    ) : (
                        <span>{(currentUser?.display_name || currentUser?.username || '?').charAt(0).toUpperCase()}</span>
                    )}
                </div>
            </div>

            {/* Center: Logo */}
            <div className="logo-container" style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', whiteSpace: 'nowrap'}}>
                <h1 style={{margin: 0, color: 'var(--primary-color)', fontSize: '2.2rem', fontFamily: "'Grand Hotel', cursive", fontWeight: 400}}>
                    Unify
                </h1>
            </div>

            {/* Right: Actions (Search, Notifications, etc.) */}
            <div style={{flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '15px', alignItems: 'center'}}>
                <div className="nav-icon" style={{cursor: 'pointer', color: 'var(--text-color)'}}>
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                    </svg>
                </div>
            </div>
        </header>
    );
}

export default TopNav;
