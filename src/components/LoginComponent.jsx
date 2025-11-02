import React, { useState } from 'react';
import './LoginComponent.css';

const LoginComponent = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [loginForm, setLoginForm] = useState({
        username: '',
        password: ''
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginForm)
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            
            // Store token in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            
            setUserData(data);
            console.log(data);
            
            setIsLoggedIn(true);
            
        } catch (err) {
            setError('Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUserData(null);
        setLoginForm({ username: '', password: '' });
    };

    const handleInputChange = (e) => {
        setLoginForm({
            ...loginForm,
            [e.target.name]: e.target.value
        });
    };

    // Check if user is already logged in on component mount
    React.useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (token && user) {
            setIsLoggedIn(true);
            setUserData(JSON.parse(user));
        }
    }, []);

    if (isLoggedIn && userData) {
        return (
            <div className="user-dashboard">
                
                <div className="user-card">
                    <h2>🎵 Welcome to Music Player!</h2>
                    <div className="user-info">
                        <div className="info-item">
                            <strong>Username:</strong> <span className='data'> {userData.username}</span> 
                        </div>
                        <div className="info-item">
                            <strong>Email:</strong> <span className='data'>{userData.email} </span>
                        </div>
                        <div className="info-item">
                            <strong>Role:</strong> <span className={`role ${userData.role.toLowerCase()}`}>
                                {userData.role}
                            </span>
                        </div>
                        <div className="info-item">
                            <strong>User ID:</strong>  <span className='data'>{userData.id}</span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="logout-btn">
                        Logout
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>🎵 Music Player Login</h2>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label>Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={loginForm.username}
                            onChange={handleInputChange}
                            placeholder="Enter username"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={loginForm.password}
                            onChange={handleInputChange}
                            placeholder="Enter password"
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="login-btn"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="sample-credentials">
                    <h4>Sample Credentials:</h4>
                    <div><strong>Users:</strong> john_doe / password123</div>
                    <div><strong>Admin:</strong> admin / admin123</div>
                </div>
            </div>
        </div>
    );
};

export default LoginComponent;