// Base imports
import React, { useEffect , useState} from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';
import { fetchOptions } from './TaskComponents/api';

// Page imports
import HomePage from './Home';
import AboutPage from './About';
import SettingsPage from './Settings';




function App() {

  //useState for the alternating mode
  const [alternativeMode, setAlternativeMode] = useState(false);

  const loadSavedStyles =  async () => {
    let options = [{}]
    // Fetch the options from the database
    options = await fetchOptions();
    
    // Set the theme and alternative mode based on the fetched options
    const theme = options[0].theme;
    const alternative = options[0].alternative;

    // Set the styles based on the theme
    switch (theme) {
      case 'blue-gray': {
        document.body.style.backgroundColor = 'lightblue';
        document.body.style.color = 'black';
        const nav = document.getElementById('Navigation');
        nav.style.backgroundColor = 'gray';
        Array.from(nav.children).forEach(child => {
          if (child.tagName === 'A') {
            child.style.color = 'white';
          }
        });
        break;
      }
      case 'wood-stone': {
        document.body.style.backgroundColor = '#ad4c26';
        document.body.style.color = 'black';
        const nav = document.getElementById('Navigation');
        Array.from(nav.children).forEach(child => {
          if (child.tagName === 'A') {
            child.style.color = '#ad4c26';
            child.style.fontWeight = 'bold';
          }
        });
        break;
      }
      case 'black-pink': {
        document.body.style.backgroundColor = '#a8324a';
        document.body.style.color = 'black';
        const nav = document.getElementById('Navigation');
        Array.from(nav.children).forEach(child => {
          if (child.tagName === 'A') {
            child.style.color = 'white';
          }
        });
        break;
      }
      default:
        // Use the first theme as default
        console.log('Default theme');
        { document.body.style.backgroundColor = 'lightblue';
        document.body.style.color = 'black';
        const nav = document.getElementById('Navigation');
        nav.style.backgroundColor = 'gray';
        Array.from(nav.children).forEach(child => {
          if (child.tagName === 'A') {
            child.style.color = 'white';
          }
        }
        );
        break; }
    }
    // Set the alternative mode based on the fetched options
    if (alternative === '1') {
      setAlternativeMode(true);
    } else {
      setAlternativeMode(false);
    }
  };

  useEffect(() => {
    loadSavedStyles();
  }, []);

  return (
    <BrowserRouter>
      <nav id='Navigation'>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/settings">Settings</Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage alternativeMode={alternativeMode}/>} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/settings" element={<SettingsPage alternativeMode={alternativeMode} setAlternativeMode={setAlternativeMode} loadOptions={loadSavedStyles} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;