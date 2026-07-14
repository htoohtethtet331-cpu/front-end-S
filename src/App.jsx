import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
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
      <h2>Welcome to Unify</h2>
      <p>Hello, {currentUser?.display_name || currentUser?.username}!</p>
      <p>The React Post Feed migration is currently in progress...</p>
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
