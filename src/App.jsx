import React, { useContext, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import PostFeed from './components/Feed/PostFeed';
import BottomNav from './components/Navigation/BottomNav';
import CreatePostModal from './components/Feed/CreatePostModal';
import './style.css'; 
import './glass.css'; 

function Home() {
  const { currentUser, loading } = useContext(AuthContext);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // We need to pass the new post event down to PostFeed. 
  // For simplicity, we can use an event system or just trigger a reload since optimistic UI is not fully wired yet.
  // We'll just let PostFeed handle it by fetching again, or we can use a key to remount it.
  const [feedKey, setFeedKey] = useState(0);

  const handlePostCreated = () => {
    setFeedKey(prev => prev + 1);
  };

  if (loading) {
    return <div className="app-container" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
      <div className="loading-spinner"></div>
    </div>;
  }

  return (
    <>
      <div className="app-container">
        <div style={{padding: '15px', paddingBottom: '0'}}>
          <h2 style={{margin: '0 0 10px 0'}}>Unify Feed</h2>
          <p style={{margin: '0 0 15px 0', color: 'var(--text-color)', opacity: 0.8}}>Hello, {currentUser?.display_name || currentUser?.username}!</p>
        </div>
        <PostFeed key={feedKey} />
      </div>
      
      <BottomNav onOpenCreateModal={() => setIsCreateModalOpen(true)} />
      <CreatePostModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onPostCreated={handlePostCreated}
      />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
