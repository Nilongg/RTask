import React, { useEffect } from 'react';

import './about.css';

const AboutPage = () => {
  useEffect(() => {
    console.log('AboutPage is active');

    return () => {
      console.log('AboutPage is unmounted');
    };
  }, []);



  return <div id='AboutContainer'>
    <h1>About the project</h1>
    <h1>Author: Niilo Vanhatupa</h1>
    <h1>How to use</h1>
    <p>By clicking task you can modify them, delete them or change their activity status</p>
    <p>setting tab allows you to change the theme of the app and enable alternative mode.</p>
    <p>The theme option is a little bit buggy and might not work as intended.</p >
    <h1>Ai tools</h1>
    <p>In this project i did use Ai tools to figure out how some code works, and find bugs in my code. 
      <br />
      For example for the calendar i used Ai to make me a template for the calendar and 
      then i modified it to fit my needs <br />
      tho it did have some bugs so i fixed those myself.
      <br />
      <p>Also i used Ai to help me out with the dragging and dropping, for example giving me some examples how to use it</p>
      <p>Where i used the AI the heavist was css styling</p>
    </p>
    <h1>The hours the project took</h1>
    <p>It took me about 60 hours to make this project, the most time consuming part was the calendar and the drag and drop feature</p>
    <br />
    <h1>What was hard?</h1>
    <p>I think the hardest part was understanding the instructions the right way, but i probably* managed to understand them</p>
    <br />
    
  </div> 
};

export default AboutPage;