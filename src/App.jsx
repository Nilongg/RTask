// Base imports
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';

// Page imports
import HomePage from './Home';
import AboutPage from './About';
import SettingsPage from './Settings';




function App() {  
  
  
  const loadSavedStyles = () => {
    const savedColor = localStorage.getItem('navFontColor');
    const savedBgColor = localStorage.getItem('navBgColor');
    const nav = document.getElementById('Navigation');
    if (savedColor) {
      Array.from(nav.children).forEach(child => {
        if (child.tagName === 'A') {
          child.style.color = savedColor;
        }
      });
    }
    if (savedBgColor) {
      nav.style.backgroundColor = savedBgColor;
    }

    
  };
  useEffect(() => {
    loadSavedStyles();
    refreshTasks();
  })
  
  return (
    <BrowserRouter>
      <nav id='Navigation'>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/settings">Settings</Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;