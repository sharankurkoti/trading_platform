import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from "../context/AuthContext";
import './Login.css'; // import new styles

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState([]);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError([]);

    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await api.post('/authToken', formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token } = response.data;
      login(access_token);
      localStorage.setItem('authToken', access_token);
      navigate('/');
    } catch (err) {
      const data = err.response?.data;
      if (Array.isArray(data)) {
        const messages = data.map((e) =>
          `${e.loc?.join('.')} - ${e.msg}`
        );
        setError(messages);
      } else if (typeof data?.detail === 'string') {
        setError([data.detail]);
      } else {
        setError(['Login failed. Please try again.']);
      }
    }
  };

  return (
    <div className="login-wrapper">
      <div className="image-side">
        <img src="/ai-trading-image.png" alt="AI Trading" />
        <div className="image-overlay">
          <h1>TradeX - Supports Domestic & International</h1>
          <p>Experience the future of trading powered by AI.</p>
        </div>
      </div>
      <div className="form-side">
        <form onSubmit={handleLogin} className="login-form">
          <h2>Login</h2>

          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            placeholder="Enter your username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          {error.length > 0 && (
            <div className="error-messages">
              {error.map((errMsg, idx) => (
                <p key={idx}>{errMsg}</p>
              ))}
            </div>
          )}

          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;