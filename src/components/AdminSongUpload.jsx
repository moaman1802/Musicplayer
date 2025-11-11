import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminSongUpload() {
  const [token, setToken] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [songData, setSongData] = useState({
    title: "",
    artist: "",
    album: "",
    durationSeconds: "",
    file: null,
  });
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingSong, setEditingSong] = useState(null);
  const [activeTab, setActiveTab] = useState("songs"); // songs, upload
  const [filePreview, setFilePreview] = useState("");

  const BASE_URL = "https://musicplayer-rc7u.onrender.com";

  // Auto-fetch songs when logged in
  useEffect(() => {
    if (loggedIn && token) {
      fetchSongs();
    }
  }, [loggedIn, token]);

  // ---------------------------
  // 🔐 LOGIN HANDLER
  // ---------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginData.username || !loginData.password) {
      toast.error("Please enter both username and password!");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/api/auth/login`, loginData, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      const jwtToken = res.data.token;
      if (jwtToken) {
        setToken(jwtToken);
        setLoggedIn(true);
        localStorage.setItem('adminToken', jwtToken);
        toast.success("🎉 Welcome back, Admin!");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response?.status === 401) {
        toast.error("❌ Invalid credentials!");
      } else {
        toast.error("🚫 Login failed! Check console for details.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Check for existing token on component mount
  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      setToken(savedToken);
      setLoggedIn(true);
    }
  }, []);

  // ---------------------------
  // 📥 READ - FETCH ALL SONGS
  // ---------------------------
  const fetchSongs = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/songs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSongs(res.data);
    } catch (err) {
      console.error("Fetch songs error:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
        toast.error("Session expired! Please login again.");
      }
    }
  };

  // ---------------------------
  // 🎵 CREATE - UPLOAD SONG
  // ---------------------------
  const handleSongUpload = async (e) => {
    e.preventDefault();
    
    if (!songData.title || !songData.artist || !songData.file) {
      toast.error("Please fill title, artist and select audio file!");
      return;
    }

    const formData = new FormData();
    formData.append("file", songData.file);
    formData.append("title", songData.title);
    formData.append("artist", songData.artist);
    formData.append("album", songData.album);
    formData.append("durationSeconds", songData.durationSeconds);

    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/api/admin/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("🎵 Song uploaded successfully!");
      resetForm();
      fetchSongs();
      setActiveTab("songs");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.response?.data?.message || "Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // ✏️ UPDATE - EDIT SONG
  // ---------------------------
  const handleUpdateSong = async (e) => {
    e.preventDefault();
    
    if (!songData.title || !songData.artist) {
      toast.error("Please fill title and artist!");
      return;
    }

    try {
      setLoading(true);
      const updateData = {
        title: songData.title,
        artist: songData.artist,
        album: songData.album,
        durationSeconds: songData.durationSeconds,
      };

      await axios.put(
        `${BASE_URL}/api/admin/songs/${editingSong.id}`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("✅ Song updated successfully!");
      resetForm();
      fetchSongs();
      setActiveTab("songs");
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Update failed!");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // 🗑️ DELETE - DELETE SONG
  // ---------------------------
  const handleDeleteSong = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${BASE_URL}/api/admin/songs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("🗑️ Song deleted successfully!");
      fetchSongs();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Delete failed!");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // 🎵 FILE HANDLER
  // ---------------------------
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSongData({ ...songData, file });
      setFilePreview(file.name);
    }
  };

  // ---------------------------
  // 🔄 RESET FORM
  // ---------------------------
  const resetForm = () => {
    setSongData({
      title: "",
      artist: "",
      album: "",
      durationSeconds: "",
      file: null,
    });
    setFilePreview("");
    setEditingSong(null);
  };

  // ---------------------------
  // 🚪 LOGOUT
  // ---------------------------
  const handleLogout = () => {
    setLoggedIn(false);
    setToken("");
    localStorage.removeItem('adminToken');
    toast.info("👋 Logged out successfully!");
  };

  // ---------------------------
  // 🎵 START EDITING
  // ---------------------------
  const startEditing = (song) => {
    setEditingSong(song);
    setSongData({
      title: song.title,
      artist: song.artist,
      album: song.album || "",
      durationSeconds: song.durationSeconds || "",
      file: null,
    });
    setActiveTab("upload");
  };

  // ---------------------------
  // RENDER FUNCTIONS
  // ---------------------------

  const renderLoginForm = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎵</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Admin Portal</h2>
          <p className="text-white/70">Sign in to manage your music library</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              value={loginData.username}
              onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>🚀</span>
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );

  const renderUploadForm = () => (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">
          {editingSong ? "Edit Song" : "Upload New Song"}
        </h3>
        <button
          onClick={() => setActiveTab("songs")}
          className="text-gray-500 hover:text-gray-700 flex items-center space-x-1"
        >
          <span>← Back to Songs</span>
        </button>
      </div>

      <form onSubmit={editingSong ? handleUpdateSong : handleSongUpload} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Song Title *</label>
            <input
              type="text"
              value={songData.title}
              onChange={(e) => setSongData({ ...songData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter song title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Artist *</label>
            <input
              type="text"
              value={songData.artist}
              onChange={(e) => setSongData({ ...songData, artist: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter artist name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Album</label>
            <input
              type="text"
              value={songData.album}
              onChange={(e) => setSongData({ ...songData, album: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter album name (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration (seconds)</label>
            <input
              type="number"
              value={songData.durationSeconds}
              onChange={(e) => setSongData({ ...songData, durationSeconds: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Duration in seconds"
            />
          </div>
        </div>

        {!editingSong && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Audio File *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                required
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="space-y-2">
                  <div className="text-3xl">🎵</div>
                  <div className="text-gray-600">
                    {filePreview ? (
                      <span className="text-purple-600 font-medium">{filePreview}</span>
                    ) : (
                      "Click to upload audio file (MP3, WAV, etc.)"
                    )}
                  </div>
                  <div className="text-sm text-gray-500">Max 50MB</div>
                </div>
              </label>
            </div>
          </div>
        )}

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>{editingSong ? "Updating..." : "Uploading..."}</span>
              </>
            ) : (
              <>
                <span>{editingSong ? "💾" : "🚀"}</span>
                <span>{editingSong ? "Update Song" : "Upload Song"}</span>
              </>
            )}
          </button>
          
          {editingSong && (
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );

  const renderSongsList = () => (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Music Library</h3>
          <p className="text-gray-600">{songs.length} songs in collection</p>
        </div>
        <button
          onClick={() => { resetForm(); setActiveTab("upload"); }}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center space-x-2"
        >
          <span>➕</span>
          <span>Add New Song</span>
        </button>
      </div>

      {songs.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Song</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artist</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Album</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {songs.map((song) => (
                <tr key={song.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white text-sm">🎵</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{song.title}</div>
                        <div className="text-sm text-gray-500">ID: {song.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">{song.artist}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">{song.album || "-"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">{song.durationSeconds ? `${song.durationSeconds}s` : "-"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditing(song)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-1"
                      >
                        <span>✏️</span>
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteSong(song.id, song.title)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-1"
                      >
                        <span>🗑️</span>
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎵</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No songs yet</h3>
          <p className="text-gray-500 mb-6">Start by uploading your first song to the library</p>
          <button
            onClick={() => setActiveTab("upload")}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
          >
            Upload Your First Song
          </button>
        </div>
      )}
    </div>
  );

  const renderAdminPanel = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Music Admin</h1>
                <p className="text-sm text-gray-500">Manage your music library</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="font-medium text-gray-900">Welcome, Admin!</div>
                <div className="text-sm text-gray-500">Ready to manage your music</div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-xl transition-colors flex items-center space-x-2"
              >
                <span>🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("songs")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "songs"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              🎵 All Songs
            </button>
            <button
              onClick={() => { resetForm(); setActiveTab("upload"); }}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "upload"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              📤 Upload Song
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "upload" ? renderUploadForm() : renderSongsList()}
      </div>
    </div>
  );

  return (
    <>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {!loggedIn ? renderLoginForm() : renderAdminPanel()}
    </>
  );
}