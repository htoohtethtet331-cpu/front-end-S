import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './style.css'; // Global styles
import './glass.css'; // Default theme

function Home() {
  return (
    <div className="app-container">
      <h2>Welcome to Unify</h2>
      <p>The React migration is in progress...</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
