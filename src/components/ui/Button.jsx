// FILE: src/components/ui/Button.jsx

'use client';

const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', ...props }) => {
  const baseStyles = "flex items-center justify-center px-4 py-2 text-sm font-medium border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200";

  const variants = {
    primary: 'bg-primary text-white border-transparent hover:bg-primary/90 focus:ring-primary',
    secondary: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-primary',
    danger: 'bg-red-600 text-white border-transparent hover:bg-red-700 focus:ring-red-500',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;