import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authLogin, authRegister } from './api';
import './Login.css';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        const res = await authRegister({ 
          username: credentials.username, 
          email: credentials.email, 
          password: credentials.password 
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/');
      } else {
        const res = await authLogin({ 
          username: credentials.username, 
          password: credentials.password 
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/');
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Authentication failed. Please try again.');
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setCredentials({ username: '', email: '', password: '' });
    setErrorMsg('');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">{isRegistering ? 'NEW_ENTITY_REGISTRATION' : 'SYSTEM_ACCESS'}</h2>
        <p className="login-sub">{isRegistering ? 'ENTER CREDENTIALS TO JOIN THE GRID' : 'PLEASE AUTHENTICATE TO CONTINUE'}</p>
        
        {errorMsg && <div className="error-msg" style={{ color: '#ff4444', marginBottom: '15px', fontFamily: 'JetBrains Mono', fontSize: '0.85rem', textAlign: 'left', borderLeft: '2px solid #ff4444', paddingLeft: '10px' }}>[!] ERROR: {errorMsg}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input 
              type="text" 
              name="username"
              placeholder="USERNAME" 
              value={credentials.username}
              onChange={handleChange}
              required 
            />
            <span className="scan-line"></span>
          </div>
          {isRegistering && (
            <div className="input-group">
              <input 
                type="email" 
                name="email"
                placeholder="EMAIL_ADDRESS" 
                value={credentials.email}
                onChange={handleChange}
                required 
              />
              <span className="scan-line"></span>
            </div>
          )}
          <div className="input-group">
            <input 
              type="password" 
              name="password"
              placeholder="PASSWORD" 
              value={credentials.password}
              onChange={handleChange}
              required 
            />
            <span className="scan-line"></span>
          </div>
          <button type="submit" className="login-btn">
            {isRegistering ? 'INITIALIZE_REGISTRATION //' : 'INITIALIZE_LOGIN //'}
          </button>
        </form>
        
        <div className="toggle-mode">
          <span className="toggle-text">
            {isRegistering ? 'ALREADY_HAVE_ACCESS?' : 'NEW_TO_THE_GRID?'}
          </span>
          <button type="button" onClick={toggleMode} className="toggle-btn">
            {isRegistering ? 'AUTHENTICATE_HERE' : 'REGISTER_NEW_ENTITY'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
