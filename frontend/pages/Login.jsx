import React from 'react'
import { useState } from "react";
import {loginUser} from '../api/authApi';

function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const result = await loginUser({ email, password });
      localStorage.setItem("token", result.token);
      window.location.reload();
    } catch (error) {
      alert("Login failed");
    }
  }
  return (
    <>
      <h2>Login</h2>
      <input type="email" placeholder='Enter Email' onChange={(e) => setEmail(e.target.value)}/>
      <input type="password" placeholder='Enter password' onChange={(e) => setPassword(e.target.value)} />

      <button onClick={handleLogin}>Login</button>
    </>
  )
}

export default Login;