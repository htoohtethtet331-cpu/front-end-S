import React, { useContext, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import PostFeed from './components/Feed/PostFeed';
import BottomNav from './components/Navigation/BottomNav';
import TopNav from './components/Navigation/TopNav';
import CreatePostModal from './components/Feed/CreatePostModal';
import './style.css'; 
import './glass.css'; 

function Home() {
  const { currentUser, loading } = useContext(AuthContext);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // We need to pass the new post event down to PostFeed. 
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
        <TopNav />
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
