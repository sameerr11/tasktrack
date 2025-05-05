import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/tasks`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(res.data);
      } catch (err) {
        console.error('Error fetching tasks');
      }
    };
    fetchTasks();
  }, [token]);

  return (
    <div>
      <h2>My Tasks</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
