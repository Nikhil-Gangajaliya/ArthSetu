import React from 'react';
import Login from '../pages/Login.jsx';

function App() {
  const token = localStorage.getItem("token");
  
  if (!token) {
    return <Login />
  }
  return (
    <h1>Dashboard (Login Successful)</h1>
  )
}

export default App;