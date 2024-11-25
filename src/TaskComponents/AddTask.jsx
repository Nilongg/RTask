import React, { useState } from "react";

const AddTask = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [additionalData, setAdditionalData] = useState("");

  const handleAdd = () => {
    onAdd(name, additionalData);
    setName("");
    setAdditionalData("");
  };

  return (
    <div>
      <h2>Lisää uusi tehtävä</h2>
      <input
        type="text"
        placeholder="Nimi"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Lisätiedot"
        value={additionalData}
        onChange={(e) => setAdditionalData(e.target.value)}
      />
      <button onClick={handleAdd}>Lisää</button>
    </div>
  );
};

export default AddTask;