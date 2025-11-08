import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCog, FaUserCog } from 'react-icons/fa';
import { IoSettingsSharp } from 'react-icons/io5';

// Reusable handleSettings function that can be used anywhere
export const handleSettings = (navigate) => {
  // Check if user is logged in
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token || !user) {
    // You can add a toast notification here if needed
    console.warn('User not logged in');
    return false;
  }
  
  // Navigate to settings page
  navigate('/settings');
  return true;
};

// Settings Button Component
const SettingsButton = ({ 
  variant = "default",
  size = "md",
  showIcon = true,
  showText = true,
  className = "",
  iconOnly = false
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    handleSettings(navigate);
  };

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg'
  };

  // Variant classes
  const variantClasses = {
    default: 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600',
    primary: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
    outline: 'border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white',
    ghost: 'text-gray-400 hover:text-white hover:bg-gray-750'
  };

  // Icon based on variant
  const getIcon = () => {
    switch (variant) {
      case 'primary':
        return <IoSettingsSharp className={size === 'sm' ? 'text-xs' : 'text-base'} />;
      case 'outline':
        return <FaUserCog className={size === 'sm' ? 'text-xs' : 'text-base'} />;
      default:
        return <FaCog className={size === 'sm' ? 'text-xs' : 'text-base'} />;
    }
  };

  const buttonContent = iconOnly ? (
    getIcon()
  ) : (
    <>
      {showIcon && getIcon()}
      {showText && <span>Settings</span>}
    </>
  );

  return (
    <button
      onClick={handleClick}
      className={`
        ${!iconOnly ? sizeClasses[size] : 'p-3'}
        ${variantClasses[variant]}
        text-white font-semibold rounded-lg transition-all duration-300 
        transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl
        flex items-center justify-center space-x-2 disabled:opacity-50 
        disabled:cursor-not-allowed disabled:transform-none
        ${className}
      `}
      title="Account Settings"
    >
      {buttonContent}
    </button>
  );
};

export default SettingsButton;