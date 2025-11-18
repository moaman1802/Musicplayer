import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SongTable = ({ songs, onEdit, onDelete, loading }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterArtist, setFilterArtist] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Get unique artists for filter
  const artists = useMemo(() => {
    return [...new Set(songs.map(song => song.artist).filter(Boolean))];
  }, [songs]);

  // Filter and search songs
  const filteredSongs = useMemo(() => {
    return songs.filter(song => {
      const matchesSearch = song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (song.album && song.album.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesArtist = !filterArtist || song.artist === filterArtist;
      return matchesSearch && matchesArtist;
    });
  }, [songs, searchTerm, filterArtist]);

  // Sort songs
  const sortedSongs = useMemo(() => {
    if (!sortConfig.key) return filteredSongs;

    return [...filteredSongs].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle null/undefined values
      if (aValue == null) aValue = '';
      if (bValue == null) bValue = '';

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredSongs, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "-";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Simple Clean Spinner
  const SimpleSpinner = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-purple-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-purple-600 rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-gray-600 font-medium">Loading your music...</p>
    </div>
  );

  // Table row animation variants
  const tableRowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.4
      }
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Search and Filter Header */}
      <motion.div 
        className="flex flex-col lg:flex-row gap-4 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search songs, artists, albums..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={loading}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              🔍
            </div>
          </div>
        </div>
        
        <select
          value={filterArtist}
          onChange={(e) => setFilterArtist(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          disabled={loading}
        >
          <option value="">All Artists</option>
          {artists.map(artist => (
            <option key={artist} value={artist}>{artist}</option>
          ))}
        </select>

        <div className="text-sm text-gray-500 flex items-center">
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
              <span>Loading songs...</span>
            </div>
          ) : (
            `Showing ${sortedSongs.length} of ${songs.length} songs`
          )}
        </div>
      </motion.div>

      {/* Loading State */}
      <AnimatePresence mode="wait">
        {loading && songs.length === 0 ? (
          <motion.div
            key="spinner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border border-gray-200 rounded-xl p-8"
          >
            <SimpleSpinner />
          </motion.div>
        ) : (
          /* Table Content */
          <motion.div
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden rounded-xl border border-gray-200"
          >
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <motion.th 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => handleSort('title')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Song</span>
                      <span className="text-xs">{getSortIcon('title')}</span>
                    </div>
                  </motion.th>
                  <motion.th 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => handleSort('artist')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Artist</span>
                      <span className="text-xs">{getSortIcon('artist')}</span>
                    </div>
                  </motion.th>
                  <motion.th 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => handleSort('album')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Album</span>
                      <span className="text-xs">{getSortIcon('album')}</span>
                    </div>
                  </motion.th>
                  <motion.th 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => handleSort('durationSeconds')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Duration</span>
                      <span className="text-xs">{getSortIcon('durationSeconds')}</span>
                    </div>
                  </motion.th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              
              <tbody className="bg-white divide-y divide-gray-200">
                <AnimatePresence mode="popLayout">
                  {loading && songs.length > 0 ? (
                    // Loading row when refreshing existing data
                    <motion.tr
                      key="loading-row"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td colSpan="5" className="px-6 py-8">
                        <div className="flex items-center justify-center space-x-3">
                          <div className="w-6 h-6 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                          <span className="text-gray-600">Updating library...</span>
                        </div>
                      </td>
                    </motion.tr>
                  ) : sortedSongs.length > 0 ? (
                    sortedSongs.map((song, index) => (
                      <motion.tr
                        key={song.id}
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                        className="hover:bg-gray-50 transition-colors group"
                        whileHover={{ 
                          backgroundColor: "rgba(249, 250, 251, 1)",
                          scale: 1.002
                        }}
                        transition={{ 
                          layout: { duration: 0.3 },
                          hover: { duration: 0.2 }
                        }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <motion.div 
                              className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-4 shadow-sm"
                              whileHover={{ scale: 1.1 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <span className="text-white text-lg">🎵</span>
                            </motion.div>
                            <div>
                              <div className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                                {song.title}
                              </div>
                              <div className="text-sm text-gray-500 font-mono">ID: {song.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900 font-medium">{song.artist}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-700">{song.album || 
                            <span className="text-gray-400 italic">No album</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-700 font-mono">
                            {formatDuration(song.durationSeconds)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <motion.div 
                            className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            whileHover={{ opacity: 1 }}
                          >
                            <motion.button
                              onClick={() => onEdit(song)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 shadow-sm"
                              title="Edit song"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <span>✏️</span>
                              <span className="text-sm">Edit</span>
                            </motion.button>
                            <motion.button
                              onClick={() => onDelete(song.id, song.title)}
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 shadow-sm"
                              title="Delete song"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <span>🗑️</span>
                              <span className="text-sm">Delete</span>
                            </motion.button>
                          </motion.div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <motion.tr
                      key="empty-state"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <td colSpan="5" className="px-6 py-12">
                        <motion.div 
                          className="text-center"
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <motion.div 
                            className="text-6xl mb-4"
                            animate={{ 
                              scale: [1, 1.1, 1],
                              rotate: [0, 5, -5, 0]
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              repeatType: "reverse"
                            }}
                          >
                            🎵
                          </motion.div>
                          <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            {songs.length === 0 ? "No songs yet" : "No songs found"}
                          </h3>
                          <p className="text-gray-500">
                            {songs.length === 0 
                              ? "Start by uploading your first song to the library" 
                              : "Try adjusting your search or filter criteria"}
                          </p>
                        </motion.div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SongTable;