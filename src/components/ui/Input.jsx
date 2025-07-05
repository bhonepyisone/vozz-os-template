// FILE: src/components/ui/Input.jsx

'use client';

const Input = ({ id, name, type = 'text', placeholder, className = '', ...props }) => {
  const baseStyles = "w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-primary focus:border-primary sm:text-sm";
  
  return (
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      className={`${baseStyles} ${className}`}
      {...props}
    />
  );
};

export default Input;