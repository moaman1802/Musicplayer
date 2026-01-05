import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminAccessButton = ({ 
  className = "", 
  variant = "default",
  size = "md",
  showIcon = true 
}) => {
  const navigate = useNavigate();

  const handleAdminAccess = () => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    
    if (!userData) {
      toast.warning("Please login first to access admin panel");
      return;
    }


    try {
      const user = JSON.parse(userData);
      
      if (user.role === 'ADMIN' || user.role === 'admin') {
        // Admin user - redirect to admin panel
        navigate('/admin');
        toast.success("Welcome to Admin Panel!");
      } else {
        // Regular user - show warning
        toast.warning("Don't try to be oversmart! Admin access only.");
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      toast.error("Error verifying user role");
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg'
  };

  // Variant classes
  const variantClasses = {
    default: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
    outline: 'border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600',
    premium: 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600'
  };

  return (
    <button
      onClick={handleAdminAccess}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        text-white font-semibold rounded-lg transition-all duration-300 
        transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl
        flex items-center justify-center space-x-2 disabled:opacity-50 
        disabled:cursor-not-allowed disabled:transform-none
        ${className}
      `}
      title="Access Admin Panel"
    >
      {showIcon && (
        <FaUserShield className={size === 'sm' ? 'text-xs' : 'text-base'} />
      )}
      <span>Admin Panel</span>
    </button>
  );
};

export default AdminAccessButton;