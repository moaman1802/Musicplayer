import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaLock, 
  FaEnvelope
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

    const [registerForm, setRegisterForm] = useState({
        username: '',
        email: '',
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
            
            // Redirect to music player
            navigate('/music');
            console.log("loged in");
            
            
        } catch (err) {
            setError('Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Basic validation
        if (registerForm.password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        if (!registerForm.email.includes('@')) {
            setError('Please enter a valid email address');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerForm)
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Registration failed');
            }

            // Registration successful, switch to login
            setError('');
            setIsRegister(false);
            setRegisterForm({ username: '', email: '', password: '' });
            
            // Show success message
            setError('Registration successful! Please login with your credentials.');
            
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        if (isRegister) {
            setRegisterForm({
                ...registerForm,
                [e.target.name]: e.target.value
            });
        } else {
            setLoginForm({
                ...loginForm,
                [e.target.name]: e.target.value
            });
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
                        <div className={`mb-6 p-4 ${
                            error.includes('successful') 
                                ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
                                : 'bg-red-500/10 border border-red-500/30 text-red-400'
                        } rounded-lg text-sm flex items-center space-x-2`}>
                            <div className={`w-2 h-2 rounded-full ${
                                error.includes('successful') ? 'bg-green-400' : 'bg-red-400'
                            }`}></div>
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
                                    placeholder={isRegister ? "Create your password" : "Enter your password"}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                    required
                                    minLength={isRegister ? 6 : 1}
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
                                    {isRegister ? <IoPersonAdd /> : <IoLogIn />}
                                    <span>{isRegister ? 'Create Account' : 'Sign In to MusicStream'}</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Toggle between Login and Register */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={toggleMode}
                            className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 text-sm font-medium"
                        >
                            {isRegister 
                                ? 'Already have an account? Sign in' 
                                : "Don't have an account? Register now"
                            }
                        </button>
                    </div>

                    {/* Sample Credentials (Login only) */}
                    {!isRegister && (
                        <div className="mt-8 p-4 bg-gray-750 rounded-lg border border-gray-600">
                            <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center space-x-2">
                                <span className="w-1 h-1 bg-cyan-400 rounded-full"></span>
                                <span>Sample Credentials</span>
                            </h4>
                            <div className="space-y-2 text-sm text-gray-400">
                                <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                                    <span className="text-cyan-300">Users:</span>
                                    <span>john_doe / password123</span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                                    <span className="text-yellow-300">Admin:</span>
                                    <span>admin / admin123</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginComponent;