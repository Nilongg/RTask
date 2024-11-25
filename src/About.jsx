import React, { useEffect } from 'react';

const AboutPage = () => {
  useEffect(() => {
    console.log('AboutPage is active');
    document.body.style.backgroundColor = 'green';

    return () => {
      console.log('AboutPage is unmounted');
      document.body.style.backgroundColor = ''; // Cleanup
    };
  }, []);



  return <div id='AboutContainer'>
    <h1>About Us</h1>
    <p id='companyInfo'>Our company is the best in the world!!!</p>
    <img src="../guy.jpg" alt="" />

  </div> 
};

export default AboutPage;