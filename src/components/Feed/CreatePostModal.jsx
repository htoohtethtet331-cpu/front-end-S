import React from 'react';
import CreatePost from './CreatePost';

function CreatePostModal({ isOpen, onClose, onPostCreated }) {
    if (!isOpen) return null;

    const handlePostCreated = (post) => {
        if (onPostCreated) onPostCreated(post);
        onClose(); // Close modal on success
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 4000, 
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'
        }} onClick={onClose}>
            <div className="modal-content glass-panel" style={{
                borderTopLeftRadius: '20px', borderTopRightRadius: '20px', 
                padding: '0', display: 'flex', flexDirection: 'column',
                backgroundColor: 'var(--bg-color)',
                width: '100%',
                maxWidth: '600px',
                margin: '0 auto',
                animation: 'slideUp 0.3s ease-out forwards'
            }} onClick={e => e.stopPropagation()}>
                <div className="fb-modal-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', borderBottom: '1px solid var(--border-color)'}}>
                    <div style={{width: '36px'}}></div>
                    <h2 style={{margin: 0, fontSize: '1.2rem', textAlign: 'center'}}>Create Post</h2>
                    <button onClick={onClose} style={{background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--text-color)', width: '36px', display: 'flex', justifyContent: 'flex-end'}}>&times;</button>
                </div>
                <div style={{padding: '15px'}}>
                    {/* We reuse CreatePost here. To prevent duplicate UI issues, we can tweak CreatePost slightly or just use it. */}
                    <CreatePost onPostCreated={handlePostCreated} />
                </div>
            </div>
        </div>
    );
}

export default CreatePostModal;
