import React, { useState, useEffect } from 'react';
import './LoginComponent.css';

const LoginComponent = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [songs, setSongs] = useState([]);
    const [songsLoading, setSongsLoading] = useState(false);
    
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
            setIsLoggedIn(true);
            fetchSongs(data.token); // Fetch songs after login
            
        } catch (err) {
            setError('Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    const fetchSongs = async (token) => {
        setSongsLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/songs', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch songs');
            }

            const songsData = await response.json();
            setSongs(songsData);
        } catch (err) {
            setError('Failed to load songs');
        } finally {
            setSongsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUserData(null);
        setSongs([]);
        setLoginForm({ username: '', password: '' });
    };

    const handleInputChange = (e) => {
        setLoginForm({
            ...loginForm,
            [e.target.name]: e.target.value
        });
    };

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Check if user is already logged in on component mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (token && user) {
            setIsLoggedIn(true);
            setUserData(JSON.parse(user));
            fetchSongs(token);
        }
    }, []);

    if (isLoggedIn && userData) {
        return (
            <div className="user-dashboard">
                <div className="dashboard-container">
                    {/* User Info Card */}
                    <div className="user-card">
                        <h2>🎵 Welcome to Music Player!</h2>
                        <div className="user-info">
                            <div className="info-item">
                                <strong>Username:</strong> {userData.username}
                            </div>
                            <div className="info-item">
                                <strong>Email:</strong> {userData.email}
                            </div>
                            <div className="info-item">
                                <strong>Role:</strong> <span className={`role ${userData.role.toLowerCase()}`}>
                                    {userData.role}
                                </span>
                            </div>
                            <div className="info-item">
                                <strong>User ID:</strong> {userData.id}
                            </div>
                        </div>
                        <button onClick={handleLogout} className="logout-btn">
                            Logout
                        </button>
                    </div>

                    {/* Songs List */}
                    <div className="songs-section">
                        <div className="songs-header">
                            <h3>🎶 Available Songs ({songs.length})</h3>
                            {songsLoading && <div className="loading">Loading songs...</div>}
                        </div>

                        {!songsLoading && songs.length === 0 && (
                            <div className="no-songs">No songs available</div>
                        )}

                        {!songsLoading && songs.length > 0 && (
                            <div className="songs-list">
                                {songs.map((song) => (
                                    <div key={song.id} className="song-card">
                                        <div className="song-info">
                                            <div className="song-title">{song.title}</div>
                                            <div className="song-artist">{song.artist}</div>
                                            <div className="song-album">{song.album}</div>
                                            <div className="song-details">
                                                <span className="duration">
                                                    ⏱️ {formatDuration(song.durationSeconds)}
                                                </span>
                                                <span className="song-id">ID: {song.id}</span>
                                            </div>
                                        </div>
                                        <div className="song-actions">
                                            <button className="play-btn">
                                                ▶ Play
                                            </button>
                                            <button className="add-btn">
                                                ➕ Add to Playlist
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
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