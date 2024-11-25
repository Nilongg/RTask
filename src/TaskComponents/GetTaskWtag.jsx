import React from "react";

const FooTasksList = ({ tasks }) => (
  <div>
    <h2>foo-tagilla varustetut tehtävät</h2>
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <strong>Nimi:</strong> {task.name}
        </li>
      ))}
    </ul>
  </div>
);

export default FooTasksList;