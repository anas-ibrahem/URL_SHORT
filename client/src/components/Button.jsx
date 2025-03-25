import React from 'react';
import { classNames } from '../utils/helpers';

// For future Usage
const variants = {
  primary: 'bg-main text-white hover:bg-main-light',
  secondary: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
  success: 'bg-green-600 text-white hover:bg-green-700',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  info: 'bg-tahiti text-white hover:bg-bermuda hover:text-gray-800',
};

const sizes = {
  sm: 'py-2 px-3 text-sm',
  md: 'py-3 px-4',
  lg: 'py-4 px-6 text-lg'
};

const Button = ({
  children,
  type = 'button',
  className = '',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onClick,
  ...props
}) => {
  return (
    <button
      type={type}
      className={classNames(
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : '',
        'rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-main',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        className
      )}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;