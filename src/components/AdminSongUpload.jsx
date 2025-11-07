import React, { useState } from "react";
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
  const [loading, setLoading] = useState(false);

  // 🔹 Backend base URL (change if needed)
  const BASE_URL = "http://localhost:8080/api";

  // ---------------------------
  // 🔐 LOGIN HANDLER (JWT)
  // ---------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginData.username || !loginData.password) {
      toast.error("Please enter both username and password!");
      return;
    }

    try {
      setLoading(true);
      // Backend login API (Assuming /api/auth/login returns token)
      const res = await axios.post(`${BASE_URL}/auth/login`, loginData);
      const jwtToken = res.data.token;
      setToken(jwtToken);
      setLoggedIn(true);
      toast.success("Login successful!");
    } catch (err) {
      console.error(err);
      toast.error("Invalid credentials or server error!");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // 🎵 SONG UPLOAD HANDLER
  // ---------------------------
  const handleSongUpload = async (e) => {
    e.preventDefault();

    if (!songData.title || !songData.artist || !songData.file) {
      toast.error("Please fill in required fields (title, artist, file)");
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
      // ✅ Use your AdminController upload endpoint
      const res = await axios.post(`${BASE_URL}/admin/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("🎵 Song uploaded successfully!");
      console.log("Uploaded song:", res.data);
      setSongData({
        title: "",
        artist: "",
        album: "",
        durationSeconds: "",
        file: null,
      });
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        toast.error("Access denied! Only ADMIN can upload songs.");
      } else {
        toast.error("Upload failed! Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // 🎧 FETCH ALL SONGS (optional)
  // ---------------------------
  const fetchSongs = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/songs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("All Songs:", res.data);
      toast.info(`Fetched ${res.data.length} songs`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch songs!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <ToastContainer position="top-right" autoClose={2500} />

      {/* LOGIN FORM */}
      {!loggedIn ? (
        <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">Admin Login</h2>
          <form onSubmit={handleLogin} className="flex flex-col space-y-3">
            <input
              type="text"
              placeholder="Username"
              value={loginData.username}
              onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              className="p-2 border rounded"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      ) : (
        // ---------------------------
        // UPLOAD FORM
        // ---------------------------
        <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">Upload New Song</h2>
          <form onSubmit={handleSongUpload} className="flex flex-col space-y-3">
            <input
              type="text"
              placeholder="Title"
              value={songData.title}
              onChange={(e) => setSongData({ ...songData, title: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Artist"
              value={songData.artist}
              onChange={(e) => setSongData({ ...songData, artist: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Album (optional)"
              value={songData.album}
              onChange={(e) => setSongData({ ...songData, album: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Duration (seconds)"
              value={songData.durationSeconds}
              onChange={(e) =>
                setSongData({ ...songData, durationSeconds: e.target.value })
              }
              className="p-2 border rounded"
            />
            <input
              type="file"
              accept="audio/*"
              onChange={(e) =>
                setSongData({ ...songData, file: e.target.files[0] })
              }
              className="p-2 border rounded"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              {loading ? "Uploading..." : "Upload Song"}
            </button>
          </form>

          <div className="flex justify-between items-center mt-4">
            <button
              className="text-blue-500 hover:underline"
              onClick={fetchSongs}
            >
              View All Songs
            </button>

            <button
              className="text-sm text-gray-500 hover:text-gray-800"
              onClick={() => {
                setLoggedIn(false);
                setToken("");
                toast.info("Logged out successfully!");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
