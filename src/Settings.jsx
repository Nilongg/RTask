import React, { useEffect } from 'react';

const SettingsPage = () => {
  useEffect(() => {
    console.log('SettingsPage is active');
    document.body.style.backgroundColor = 'lightcoral';

    return () => {
      console.log('SettingsPage is unmounted');
      document.body.style.backgroundColor = ''; // Cleanup
    };
  }, []);
  
  
  
  const changeFont = (e) => {
    document.body.style.fontFamily = e.target.value;
  };

  const changeNavColor = (e) => {
    const nav = document.getElementById('Navigation');
    if (nav) {
      nav.style.backgroundColor = e.target.value;
      localStorage.setItem('navBgColor', e.target.value);
    } else {
      console.warn('Navigation element not found');
    }
  };

  const changeNavFontColor = (e) => {
    const nav = document.getElementById('Navigation');
    if (nav) {
      Array.from(nav.children).forEach(child => {
        if (child.tagName === 'A') {
          child.style.color = e.target.value;
        }
      });
      localStorage.setItem('navFontColor', e.target.value);
    } else {
      console.warn('Navigation element not found');
    }
  };

  return (
    <div>
      <h1>Settings</h1>
      <label>Change font:</label>
      <select onChange={changeFont}>
        <option value="Arial">Arial</option>
        <option value="Verdana">Verdana</option>
        <option value="Courier New">Courier New</option>
      </select>
      <br />
      <label>Change navigation background color:</label>
      <input type="color" onChange={changeNavColor} />
      <br />
      <label>Change navigation font color:</label>
      <input type="color" onChange={changeNavFontColor} />
    </div>
  );
};

export default SettingsPage;