import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext, API_BASE_URL } from '../../context/AuthContext';
import PostCard from './PostCard'; 

function PostFeed() {
    const { currentUser } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/posts`, {
                    params: { user_id: currentUser?.id }
                });
                if (response.data.posts) {
                    setPosts(response.data.posts);
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [currentUser]);

    const handleNewPost = (newPost) => {
        setPosts(prev => [newPost, ...prev]);
    };

    if (loading) {
        return (
            <div className="feed-container" style={{display: 'flex', justifyContent: 'center', padding: '20px'}}>
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="feed-container" style={{paddingBottom: '80px'}}>
            {posts.map(post => (
                <PostCard key={post.id} post={post} />
            ))}
            {posts.length === 0 && <p style={{textAlign: 'center', marginTop: '20px'}}>No posts yet.</p>}
        </div>
    );
}

export default PostFeed;
