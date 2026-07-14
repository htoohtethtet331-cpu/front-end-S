import React, { useState, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext, API_BASE_URL } from '../../context/AuthContext';

function CreatePost({ onPostCreated }) {
    const { currentUser } = useContext(AuthContext);
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    const handleRemoveImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() && images.length === 0) return;
        
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('user_id', currentUser.id);
            formData.append('content', content);
            
            images.forEach(image => {
                formData.append('images', image);
            });

            const response = await axios.post(`${API_BASE_URL}/posts`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.post) {
                setContent('');
                setImages([]);
                if (fileInputRef.current) fileInputRef.current.value = '';
                if (onPostCreated) onPostCreated(response.data.post);
            }
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Failed to upload post. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="create-post-container glass-panel" style={{marginBottom: '15px'}}>
            <form onSubmit={handleSubmit}>
                <div className="fb-input-area" style={{alignItems: 'flex-start', padding: 0}}>
                    <div className="avatar" style={{width: '40px', height: '40px', borderRadius: '50%', background: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '5px'}}>
                        {currentUser?.photo_url ? (
                            <img src={currentUser.photo_url} alt="Avatar" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                        ) : (
                            <span>{(currentUser?.display_name || currentUser?.username || '?').charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                    <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                        {images.length > 0 && (
                            <div className="image-preview-container" style={{marginBottom: '10px', position: 'relative', width: '100%', borderRadius: '8px', border: '1px solid var(--border-color)', padding: '12px', boxSizing: 'border-box'}}>
                                <div style={{display: 'flex', gap: '10px', overflowX: 'auto'}}>
                                    {images.map((img, index) => (
                                        <div key={index} style={{position: 'relative', minWidth: '80px', height: '80px'}}>
                                            <img src={URL.createObjectURL(img)} alt="preview" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px'}} />
                                            <button type="button" onClick={() => handleRemoveImage(index)} style={{position: 'absolute', top: '-5px', right: '-5px', background: 'white', border: '1px solid #ccc', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>&times;</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <textarea 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What's on your mind?" 
                            rows="4"
                            style={{border: 'none', background: 'transparent', padding: '8px 10px', fontSize: '1.1rem', outline: 'none', resize: 'none', color: 'var(--text-color)'}}
                        ></textarea>
                    </div>
                </div>
                <div className="post-actions-extended" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '15px', marginTop: '15px'}}>
                    <label style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#45bd62', fontWeight: 600, cursor: 'pointer'}}>
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z" />
                        </svg>
                        Photo
                        <input 
                            type="file" 
                            accept="image/*" 
                            multiple 
                            style={{display: 'none'}} 
                            onChange={handleImageChange}
                            ref={fileInputRef}
                        />
                    </label>
                    
                    <button type="submit" disabled={isSubmitting} className="btn primary-btn" style={{padding: '8px 24px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', opacity: isSubmitting ? 0.7 : 1}}>
                        {isSubmitting ? 'Uploading...' : (
                            <>
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                    <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
                                </svg>
                                Upload
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreatePost;
