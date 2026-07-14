import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import PostFeed from './components/Feed/PostFeed';
import './style.css'; 
import './glass.css'; 

function Home() {
  const { currentUser, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="app-container" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
      <div className="loading-spinner"></div>
    </div>;
  }

  return (
    <div className="app-container">
      <div style={{padding: '15px', paddingBottom: '0'}}>
        <h2 style={{margin: '0 0 10px 0'}}>Unify Feed</h2>
        <p style={{margin: '0 0 15px 0', color: 'var(--text-color)', opacity: 0.8}}>Hello, {currentUser?.display_name || currentUser?.username}!</p>
      </div>
      <PostFeed />
    </div>
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
