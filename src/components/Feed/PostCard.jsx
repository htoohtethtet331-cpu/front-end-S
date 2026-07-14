import React, { useContext, useState } from 'react';
import { AuthContext, API_BASE_URL } from '../../context/AuthContext';
import axios from 'axios';
import CommentSheet from './CommentSheet';

function PostCard({ post }) {
    const { currentUser } = useContext(AuthContext);
    const date = new Date(post.created_at).toLocaleString();
    const isActive = post.is_active;
    const [showComments, setShowComments] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/posts/${post.id}`);
            window.location.reload();
        } catch (error) {
            console.error("Error deleting post", error);
        }
    };

    const [hasLiked, setHasLiked] = useState(post.has_liked);
    const [likeCount, setLikeCount] = useState(post.like_count || 0);
    const [hasFavorited, setHasFavorited] = useState(post.has_favorited);

    const toggleLike = async () => {
        if (!currentUser) return;
        const newHasLiked = !hasLiked;
        setHasLiked(newHasLiked);
        setLikeCount(prev => newHasLiked ? prev + 1 : Math.max(0, prev - 1));
        try {
            await axios.post(`${API_BASE_URL}/posts/${post.id}/like`, { user_id: currentUser.id });
        } catch (error) {
            console.error("Error toggling like", error);
            setHasLiked(!newHasLiked);
            setLikeCount(prev => !newHasLiked ? prev + 1 : Math.max(0, prev - 1));
        }
    };

    const toggleFavorite = async () => {
        if (!currentUser) return;
        const newHasFavorited = !hasFavorited;
        setHasFavorited(newHasFavorited);
        try {
            await axios.post(`${API_BASE_URL}/posts/${post.id}/favorite`, { user_id: currentUser.id });
        } catch (error) {
            console.error("Error toggling favorite", error);
            setHasFavorited(!newHasFavorited);
        }
    };

    return (
        <div className="post-item" id={`post-${post.id}`}>
            <div className="post-header">
                <div className="avatar-wrapper">
                    <div className="avatar" style={{width: '40px', height: '40px', borderRadius: '50%', background: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        {post.photo_url ? (
                            <img src={post.photo_url} alt="Avatar" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                        ) : (
                            <span>{(post.display_name || post.username).charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                    {isActive && <div className="active-dot"></div>}
                </div>
                <div className="post-meta">
                    <span className="post-author clickable-user">
                        {post.display_name || post.username}
                    </span>
                    <span className="post-date">{date}</span>
                </div>
                {currentUser && currentUser.id === post.user_id && (
                    <button className="delete-post-btn" onClick={handleDelete} style={{marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#ff4d4f', padding: '5px'}}>
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                    </button>
                )}
            </div>

            <div className="post-body">
                {post.content}
            </div>

            {post.image_urls && post.image_urls.length > 0 ? (
                <div className={`preview-images-container ${post.image_urls.length > 1 ? 'preview-grid-2' : 'preview-grid-1'}`}>
                    {post.image_urls.slice(0, 2).map((url, i) => (
                        <div key={i} style={{position: 'relative', width: '100%', height: '100%', cursor: 'pointer'}}>
                            <img src={url} className={`post-grid-img img-${i}`} alt="Post Media" loading="lazy" />
                            {i === 1 && post.image_urls.length > 2 && (
                                <div className="more-images-overlay">+{post.image_urls.length - 2}</div>
                            )}
                        </div>
                    ))}
                </div>
            ) : post.image_url ? (
                <img src={post.image_url} className="post-image" alt="Post Media" loading="lazy" />
            ) : null}
            
            <div className="post-actions-fb" style={{paddingTop: '10px'}}>
                <div role="button" className={`fb-interaction-btn heart-btn ${hasLiked ? 'liked' : ''}`} onClick={toggleLike} style={{display: 'flex', gap: '5px', alignItems: 'center'}}>
                    <svg viewBox="0 0 24 24" width="20" height="20" className="heart-icon"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    <span>{likeCount}</span>
                </div>
                <div role="button" className="fb-interaction-btn comment-btn" onClick={() => setShowComments(true)} style={{display: 'flex', gap: '5px', alignItems: 'center'}}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style={{pointerEvents: 'none'}}><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/></svg>
                    <span>{post.comment_count || 0}</span>
                </div>
                <div role="button" className={`fb-interaction-btn fav-btn ${hasFavorited ? 'favorited' : ''}`} onClick={toggleFavorite} style={{display: 'flex', gap: '5px', alignItems: 'center'}}>
                    <svg viewBox="0 0 24 24" width="20" height="20" className="fav-icon"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                    <span>Favorite</span>
                </div>
            </div>
            
            {showComments && <CommentSheet post={post} onClose={() => setShowComments(false)} />}
        </div>
    );
}

export default PostCard;
