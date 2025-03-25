import React from 'react';
import { classNames } from '../utils/helpers';

export const InputLabel = ({ children, className = '', ...props }) => {
  return (
    <label
      className={classNames(
        'block text-sm font-medium text-gray-700',
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
};

export const TextInput = ({
  name,
  label,
  type = 'text',
  placeholder = '',
  required = false,
  className = '',
  leftIcon = null,
  value,
  onChange,
  onKeyPress,
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && <InputLabel htmlFor={name}>{label}{required && ' *'}</InputLabel>}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          className={classNames(
            'w-full p-3 border rounded-lg focus:ring-2 focus:ring-main focus:border-main',
            leftIcon ? 'pl-10' : '',
            className
          )}
          value={value}
          onChange={onChange}
          onKeyPress={onKeyPress}
          {...props}
        />
      </div>
    </div>
  );
};

export const Checkbox = ({
  name,
  label,
  icon = null,
  checked = false,
  onChange,
  className = '',
  ...props
}) => {
  return (
    <label className={classNames("flex items-center gap-2", className)}>
      <input
        type="checkbox"
        name={name}
        className="h-5 w-5 text-main rounded"
        checked={checked}
        onChange={onChange}
        {...props}
      />
      <span className="text-sm text-gray-700">{label}</span>
      {icon && <span className="h-4 w-4 text-gray-500">{icon}</span>}
    </label>
  );
};