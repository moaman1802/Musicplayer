// MusicPlayer.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  FaPlay, 
  FaPause, 
  FaStepForward, 
  FaStepBackward, 
  FaVolumeUp, 
  FaVolumeMute,
  FaExpand,
  FaCompress,
  FaHeart,
  FaRegHeart,
  FaUser,
  FaSignOutAlt
} from 'react-icons/fa';
import { 
  IoShuffle, 
  IoRepeat, 
  IoMusicalNotes 
} from 'react-icons/io5';
import './MusicPlayer.css';
import AdminAccessButton from './AdminAccessButton';

const MusicPlayer = () => {
  const [user, setUser] = useState(null);
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  const profileDropdownRef = useRef(null);

  // Load user from JWT token and fetch songs
  useEffect(() => {
    const initializePlayer = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        window.location.href = '/login';
        return;
      }

      try {
        // Decode JWT token to get user info
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          username: payload.username,
          email: payload.email,
          role: payload.role
        });

        // Fetch songs from backend
        await fetchSongs(token);
      } catch (error) {
        console.error('Error initializing player:', error);
        setError('Failed to load music player');
        // Redirect to login if token is invalid
        localStorage.removeItem('token');
        window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    };

    initializePlayer();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchSongs = async (token) => {
    try {
      const response = await axios.get('http://localhost:8080/api/songs', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setSongs(response.data);
      if (response.data.length > 0) {
        setCurrentSong(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching songs:', error);
      setError('Failed to load songs. Please try again.');
      throw error;
    }
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // Audio event handlers
  const togglePlay = () => {
    if (!currentSong) return;

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
        //   setError('Error playing audio file');
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleProgressClick = (e) => {
    if (progressBarRef.current && audioRef.current && audioRef.current.duration) {
      const progressBar = progressBarRef.current;
      const rect = progressBar.getBoundingClientRect();
      const clickPosition = (e.clientX - rect.left) / progressBar.offsetWidth;
      const newTime = clickPosition * audioRef.current.duration;
      
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? volume : 0;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const playSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    // Use setTimeout to ensure state updates before playing
    setTimeout(() => {
      audioRef.current?.play().catch(error => {
        console.error('Error playing song:', error);
        // setError('Error playing audio file');
        setIsPlaying(false);
      });
    }, 0);
  };

  const playNext = () => {
    if (songs.length === 0) return;
    
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    playSong(songs[nextIndex]);
  };

  const playPrevious = () => {
    if (songs.length === 0) return;
    
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    const prevIndex = currentIndex === 0 ? songs.length - 1 : currentIndex - 1;
    playSong(songs[prevIndex]);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your music...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button 
          className="retry-btn"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={`music-player ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* Header with User Profile */}
      <header className="player-header">
        <div className="header-content">
            
          <div className="app-brand">
            
            <IoMusicalNotes className="app-logo" />
            <h1 className="app-title">MusicStream</h1>
          </div>
          
          {/* User Profile with Dropdown */}
          <div className="user-profile-container" ref={profileDropdownRef}>
            <div className="user-profile-trigger" onClick={toggleProfileDropdown}>
              <div className="user-avatar">
                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="username-text">{user?.username}</span>
              <AdminAccessButton></AdminAccessButton>
            </div>
            

            {showProfileDropdown && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <div className="dropdown-avatar">
                    {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="dropdown-user-info">
                    <div className="dropdown-username">{user?.username}</div>
                    <div className="dropdown-email">{user?.email}</div>
                    <div className="dropdown-role">{user?.role}</div>
                  </div>
                </div>
                
                <div className="dropdown-divider"></div>
                
                <div className="dropdown-section">
                  <div className="dropdown-item">
                    <FaUser className="dropdown-icon" />
                    <span>Profile Settings</span>
                  </div>
                  <div className="dropdown-item">
                    <FaHeart className="dropdown-icon" />
                    <span>Favorite Songs</span>
                  </div>
                </div>
                
                <div className="dropdown-divider"></div>
                
                <button className="logout-btn" onClick={handleLogout}>
                  <FaSignOutAlt className="logout-icon" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="player-container">
        {/* Main Content */}
        <main className="main-content">
          {/* Now Playing Section */}
          {currentSong && (
            <section className="now-playing-section">
              <div className="now-playing-card">
                <div className="album-art">
                  <div className="album-placeholder">
                    <span>{currentSong.artist?.charAt(0) || 'A'}</span>
                  </div>
                </div>
                <div className="track-info">
                  <h2 className="track-title">{currentSong.title}</h2>
                  <p className="track-artist">{currentSong.artist}</p>
                  <p className="track-album">{currentSong.album}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="progress-container">
                <span className="time-current">{formatTime(currentTime)}</span>
                <div 
                  className="progress-bar" 
                  ref={progressBarRef}
                  onClick={handleProgressClick}
                >
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${(currentTime / (currentSong.durationSeconds || 1)) * 100}%` 
                    }}
                  ></div>
                </div>
                <span className="time-total">
                  {formatTime(currentSong.durationSeconds)}
                </span>
              </div>

              {/* Controls */}
              <div className="player-controls">
                <button className="control-btn shuffle">
                  <IoShuffle />
                </button>
                <button className="control-btn prev" onClick={playPrevious}>
                  <FaStepBackward />
                </button>
                <button className="control-btn play-pause" onClick={togglePlay}>
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </button>
                <button className="control-btn next" onClick={playNext}>
                  <FaStepForward />
                </button>
                <button className="control-btn repeat">
                  <IoRepeat />
                </button>
              </div>

              {/* Volume Control */}
              <div className="volume-control">
                <button className="volume-btn" onClick={toggleMute}>
                  {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                />
              </div>
            </section>
          )}

          {/* Songs List */}
          <section className="songs-section">
            <div className="section-header">
              <h2>Your Songs ({songs.length})</h2>
              <div className="header-actions">
                <button className="fullscreen-btn" onClick={toggleFullscreen}>
                  {isFullscreen ? <FaCompress /> : <FaExpand />}
                </button>
              </div>
            </div>
            
            {songs.length === 0 ? (
              <div className="empty-state">
                <IoMusicalNotes className="empty-icon" />
                <p>No songs available</p>
              </div>
            ) : (
              <div className="songs-list">
                {songs.map((song, index) => (
                  <div
                    key={song.id}
                    className={`song-item ${currentSong?.id === song.id ? 'active' : ''}`}
                    onClick={() => playSong(song)}
                  >
                    <div className="song-number">
                      {currentSong?.id === song.id && isPlaying ? (
                        <div className="playing-indicator">
                          <IoMusicalNotes />
                        </div>
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="song-info">
                      <div className="song-title">{song.title}</div>
                      <div className="song-artist">{song.artist}</div>
                    </div>
                    <div className="song-album">{song.album}</div>
                    <div className="song-duration">
                      {formatTime(song.durationSeconds)}
                    </div>
                    <button className="favorite-btn">
                      <FaRegHeart />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentSong?.fileUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={playNext}
        onError={(e) => {
          console.error('Audio error:', e);
        //   setError('Error playing audio file');
          setIsPlaying(false);
        }}
        onLoadedMetadata={() => {
          setCurrentTime(0);
        }}
      />
    </div>
  );
};

export default MusicPlayer;