import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaMusic, 
  FaHeadphones, 
  FaPlay, 
  FaUser, 
  FaUserShield,
  FaArrowRight
} from 'react-icons/fa';
import { 
  IoMusicalNotes,
  IoSparkles
} from 'react-icons/io5';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Music Notes */}
        <div className="absolute top-1/4 left-1/4 animate-float">
          <IoMusicalNotes className="text-purple-400/20 text-6xl" />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-float delay-1000">
          <FaMusic className="text-pink-400/20 text-4xl" />
        </div>
        <div className="absolute bottom-1/4 left-1/3 animate-float delay-2000">
          <FaHeadphones className="text-cyan-400/20 text-5xl" />
        </div>
        <div className="absolute top-1/2 right-1/3 animate-float delay-1500">
          <FaPlay className="text-purple-400/20 text-3xl" />
        </div>
        
        {/* Animated Circles */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-500/10 rounded-full animate-pulse-slow"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-pink-500/10 rounded-full animate-pulse-slow delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full animate-ping-slow"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo & Header */}
          <div className="mb-8 animate-fade-in-down">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse-glow">
                  <IoMusicalNotes className="text-4xl text-white" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <IoSparkles className="text-yellow-400 text-xl animate-spin-slow" />
                </div>
              </div>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
              MusicStream
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-2 animate-fade-in-up">
              Experience Music Like Never Before
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto animate-fade-in-up delay-300">
              Discover millions of songs, create your perfect playlists, and enjoy high-quality audio streaming anywhere, anytime.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-fade-in-up delay-500">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300">
              <div className="text-3xl font-bold text-cyan-400 mb-2">10K+</div>
              <div className="text-gray-400">Songs</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-pink-500/50 transition-all duration-300">
              <div className="text-3xl font-bold text-pink-400 mb-2">5K+</div>
              <div className="text-gray-400">Artists</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300">
              <div className="text-3xl font-bold text-purple-400 mb-2">1M+</div>
              <div className="text-gray-400">Listeners</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up delay-700">
            {/* User Login Button */}
            <button
              onClick={() => navigate('/login')}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center space-x-3">
                <FaUser className="text-xl" />
                <span>Start Listening</span>
                <FaArrowRight className="transform group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </button>

            {/* Admin Login Button */}
            <button
              onClick={() => navigate('/admin')}
              className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-2xl font-bold text-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg border border-cyan-400/50 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center space-x-3">
                <FaUserShield className="text-xl" />
                <span>Admin Access</span>
                <FaArrowRight className="transform group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 animate-fade-in-up delay-1000">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30 hover:border-purple-500/30 transition-all duration-300 group hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
                <FaHeadphones className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">High Quality Audio</h3>
              <p className="text-gray-400">Experience crystal clear sound with our premium audio streaming.</p>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30 hover:border-cyan-500/30 transition-all duration-300 group hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:from-cyan-600 group-hover:to-blue-600 transition-all duration-300">
                <IoMusicalNotes className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Unlimited Songs</h3>
              <p className="text-gray-400">Access millions of songs from artists all around the world.</p>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30 hover:border-pink-500/30 transition-all duration-300 group hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:from-pink-600 group-hover:to-purple-600 transition-all duration-300">
                <FaPlay className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Create Playlists</h3>
              <p className="text-gray-400">Build your perfect playlists and share them with friends.</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 animate-fade-in-up delay-1200">
            <p className="text-gray-500 text-sm">
              Join millions of music lovers worldwide
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;