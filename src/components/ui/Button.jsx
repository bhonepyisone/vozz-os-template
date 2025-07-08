// FILE: src/components/ui/Button.jsx

'use client';

const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', ...props }) => {
  // Base style for all Neumorphism buttons
  const baseStyles = "flex items-center justify-center px-4 py-2 text-sm font-bold border-transparent rounded-lg shadow-neo-md bg-neo-bg transition-all active:shadow-neo-inset disabled:opacity-50";

  // Variants now control the text color
  const variants = {
    primary: 'text-primary hover:text-indigo-600',
    secondary: 'text-gray-700 hover:text-gray-900',
    danger: 'text-red-600 hover:text-red-700',
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
