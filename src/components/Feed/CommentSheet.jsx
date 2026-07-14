import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext, API_BASE_URL } from '../../context/AuthContext';

function CommentSheet({ post, onClose }) {
    const { currentUser } = useContext(AuthContext);
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/posts/${post.id}/comments`);
                setComments(res.data.comments || []);
            } catch (error) {
                console.error("Error fetching comments:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchComments();
    }, [post.id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() || !currentUser) return;
        
        setSubmitting(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/posts/${post.id}/comments`, {
                user_id: currentUser.id,
                content: content
            });
            if (res.data.comment) {
                setComments(prev => [...prev, res.data.comment]);
                setContent('');
            }
        } catch (error) {
            console.error("Error submitting comment:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, 
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'
        }}>
            <div className="glass-panel" style={{
                height: '80vh', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', 
                padding: '20px', display: 'flex', flexDirection: 'column',
                backgroundColor: 'var(--bg-color)'
            }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                    <h3 style={{margin: 0}}>Comments</h3>
                    <button onClick={onClose} style={{background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--text-color)'}}>&times;</button>
                </div>
                
                <div style={{flex: 1, overflowY: 'auto', marginBottom: '15px'}}>
                    {loading ? (
                        <div style={{display: 'flex', justifyContent: 'center', padding: '20px'}}><div className="loading-spinner"></div></div>
                    ) : comments.length === 0 ? (
                        <p style={{textAlign: 'center', opacity: 0.6}}>No comments yet. Be the first!</p>
                    ) : (
                        comments.map(c => (
                            <div key={c.id} style={{marginBottom: '15px', display: 'flex', gap: '10px'}}>
                                <div className="avatar" style={{width: '35px', height: '35px', borderRadius: '50%', background: '#ccc', flexShrink: 0, overflow: 'hidden'}}>
                                    {c.photo_url ? <img src={c.photo_url} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : null}
                                </div>
                                <div style={{backgroundColor: 'var(--comment-bg, rgba(0,0,0,0.05))', padding: '10px 15px', borderRadius: '15px', flex: 1}}>
                                    <div className="comment-author-name" style={{fontWeight: 600, fontSize: '0.9rem', color: 'var(--primary-color)', marginBottom: '2px'}}>{c.display_name || c.username}</div>
                                    <div style={{fontSize: '0.95rem'}}>{c.content}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <form onSubmit={handleSubmit} style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                    <div className="avatar" style={{width: '40px', height: '40px', borderRadius: '50%', background: '#ccc', flexShrink: 0, overflow: 'hidden'}}>
                        {currentUser?.photo_url ? <img src={currentUser.photo_url} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : null}
                    </div>
                    <input 
                        type="text" 
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write a comment..." 
                        style={{flex: 1, padding: '10px 15px', borderRadius: '20px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-color)', outline: 'none'}}
                    />
                    <button type="submit" disabled={submitting || !content.trim()} style={{background: 'var(--primary-color)', color: 'white', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: (submitting || !content.trim()) ? 0.5 : 1}}>
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CommentSheet;
