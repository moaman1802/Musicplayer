import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    FaUser,
    FaLock,
    FaEnvelope,
    FaExclamationTriangle
} from 'react-icons/fa';
import {
    IoMusicalNotes,
    IoLogIn,
    IoPersonAdd
} from 'react-icons/io5';

const LoginComponent = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isRegister, setIsRegister] = useState(false);

    const [loginForm, setLoginForm] = useState({
        username: '',
        password: ''
    });

    const API_BASE_URL = "https://musicplayer-rc7u.onrender.com";

    const [registerForm, setRegisterForm] = useState({
        username: '',
        email: '',
        password: ''
    });

    // Create axios instance with base configuration
    const api = axios.create({
        baseURL: API_BASE_URL,
        headers: {
            'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 seconds timeout
    });

    // Add response interceptor for error handling
    useEffect(() => {
        const responseInterceptor = api.interceptors.response.use(
            (response) => response,
            (error) => {
                console.error('API Error:', error);
                
                if (error.code === 'ECONNABORTED') {
                    throw new Error('Request timeout. Please check your internet connection.');
                }
                
                if (!error.response) {
                    throw new Error('Network error. Please check your connection.');
                }
                
                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.response.eject(responseInterceptor);
        };
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Basic validation
            if (!loginForm.username.trim() || !loginForm.password.trim()) {
                throw new Error('Please fill in all fields');
            }

            const response = await api.post('/api/auth/login', loginForm);
            const data = response.data;

            // Store token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            
            console.log('Login successful:', data);
            
            // Redirect to music player
            navigate('/music');

        } catch (err) {
            console.error('Login error:', err);
            
            let errorMessage = 'Login failed. Please try again.';
            
            if (err.response) {
                // Server responded with error status
                const status = err.response.status;
                switch (status) {
                    case 400:
                        errorMessage = 'Invalid request. Please check your input.';
                        break;
                    case 401:
                        errorMessage = 'Invalid username or password.';
                        break;
                    case 404:
                        errorMessage = 'Login service unavailable.';
                        break;
                    case 500:
                        errorMessage = 'Server error. Please try again later.';
                        break;
                    default:
                        errorMessage = err.response.data?.message || `Login failed (${status})`;
                }
            } else if (err.request) {
                // Request was made but no response received
                errorMessage = 'Unable to connect to server. Please check your internet connection.';
            } else {
                // Something else happened
                errorMessage = err.message || 'An unexpected error occurred.';
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Enhanced validation
            if (!registerForm.username.trim() || !registerForm.email.trim() || !registerForm.password.trim()) {
                throw new Error('Please fill in all fields');
            }

            if (registerForm.username.length < 3) {
                throw new Error('Username must be at least 3 characters long');
            }

            if (registerForm.password.length < 6) {
                throw new Error('Password must be at least 6 characters long');
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(registerForm.email)) {
                throw new Error('Please enter a valid email address');
            }

            const response = await api.post('/api/auth/register', registerForm);
            
            console.log('Registration successful:', response.data);
            
            // Registration successful
            setError('');
            setIsRegister(false);
            setRegisterForm({ username: '', email: '', password: '' });

            // Show success message
            setError('Registration successful! Please login with your credentials.');

        } catch (err) {
            console.error('Registration error:', err);
            
            let errorMessage = 'Registration failed. Please try again.';
            
            if (err.response) {
                const status = err.response.status;
                switch (status) {
                    case 400:
                        errorMessage = err.response.data?.message || 'Invalid registration data.';
                        break;
                    case 409:
                        errorMessage = 'Username or email already exists.';
                        break;
                    case 422:
                        errorMessage = 'Validation failed. Please check your input.';
                        break;
                    case 500:
                        errorMessage = 'Server error. Please try again later.';
                        break;
                    default:
                        errorMessage = err.response.data?.message || `Registration failed (${status})`;
                }
            } else if (err.request) {
                errorMessage = 'Unable to connect to server. Please check your internet connection.';
            } else {
                errorMessage = err.message || 'An unexpected error occurred.';
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (isRegister) {
            setRegisterForm(prev => ({
                ...prev,
                [name]: value
            }));
        } else {
            setLoginForm(prev => ({
                ...prev,
                [name]: value
            }));
        }
        
        // Clear error when user starts typing
        if (error) {
            setError('');
        }
    };

    const toggleMode = () => {
        setIsRegister(!isRegister);
        setError('');
        setLoginForm({ username: '', password: '' });
        setRegisterForm({ username: '', email: '', password: '' });
    };

    // If user is already logged in, redirect to music
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/music');
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-2xl transform hover:scale-[1.01] transition-all duration-300">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-xl">
                                <IoMusicalNotes className="text-3xl text-white" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                            MusicStream Pro
                        </h2>
                        <p className="text-gray-400 mt-2">
                            {isRegister ? 'Create your account' : 'Sign in to your music account'}
                        </p>
                    </div>

                    {/* Error/Success Message */}
                    {error && (
                        <div className={`mb-6 p-4 ${error.includes('successful')
                                ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                                : 'bg-red-500/10 border border-red-500/30 text-red-400'
                            } rounded-lg text-sm flex items-start space-x-3`}>
                            <FaExclamationTriangle className={`mt-0.5 flex-shrink-0 ${error.includes('successful') ? 'text-green-400' : 'text-red-400'}`} />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            {/* Username Field */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaUser className="text-gray-500" />
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    value={isRegister ? registerForm.username : loginForm.username}
                                    onChange={handleInputChange}
                                    placeholder="Enter your username"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            {/* Email Field (Register only) */}
                            {isRegister && (
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaEnvelope className="text-gray-500" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={registerForm.email}
                                        onChange={handleInputChange}
                                        placeholder="Enter your email"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            )}

                            {/* Password Field */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="text-gray-500" />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    value={isRegister ? registerForm.password : loginForm.password}
                                    onChange={handleInputChange}
                                    placeholder={isRegister ? "Create your password (min. 6 characters)" : "Enter your password"}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                    required
                                    minLength={isRegister ? 6 : 1}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    <span>{isRegister ? 'Creating Account...' : 'Signing in...'}</span>
                                </>
                            ) : (
                                <>
                                    {isRegister ? <IoPersonAdd className="text-lg" /> : <IoLogIn className="text-lg" />}
                                    <span>{isRegister ? 'Create Account' : 'Sign In to MusicStream'}</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Toggle between Login and Register */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={toggleMode}
                            disabled={loading}
                            className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isRegister
                                ? 'Already have an account? Sign in'
                                : "Don't have an account? Register now"
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginComponent;