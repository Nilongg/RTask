import React, { useEffect, useState } from 'react';
import { setOptions } from './TaskComponents/api';
import Select from 'react-select';
import { use } from 'react';

const SettingsPage = (props) => {
  const { alternativeMode, setAlternativeMode, loadOptions } = props;
  const [ selectedTheme, setSelectedTheme] = useState('default');

  const updateDbOptions = async  () => {
    setAlternativeMode(!alternativeMode)
    await setOptions(selectedTheme, alternativeMode ? 1 : 0, 'own_textual_data');
    
  }

  const options = ['blue-gray', 'wood-stone', 'black-pink'];


  useEffect(() => {
    console.log("alt mode:", alternativeMode)
  }, [alternativeMode])

  useEffect(() => {
    console.log("selected theme:", selectedTheme)
    loadOptions();
  }, [selectedTheme])

  return (
    <div>
      <h1>Settings</h1>
      <h3>Change theme</h3>
      <Select
        options={options.map((option) => ({ value: option, label: option }))}
        onChange={(e) => {setSelectedTheme(e.value); setOptions(e.value, alternativeMode, 'textual_data')}}
        placeholder='Select theme'

      />
      
      <h3>Alternative mode</h3>
      <button
        style={{ backgroundColor: alternativeMode ? 'green' : 'red', }}
        onClick={() => updateDbOptions()}>{alternativeMode ? 'Disable alternative mode' : 'Enable alternative mode'}</button>
    </div>
  );
};

export default SettingsPage;