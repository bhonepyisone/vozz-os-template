// FILE: src/components/ui/NeumorphismButton.jsx

'use client';

const NeumorphismButton = ({ children, className = '', ...props }) => {
  return (
    <button 
      {...props}
      className={`w-full p-3 bg-neo-bg rounded-lg font-bold text-gray-700 shadow-neo-md transition-all hover:text-primary active:shadow-neo-inset disabled:opacity-50 flex items-center justify-center space-x-2 ${className}`}
    >
      {children}
    </button>
  );
};

export default NeumorphismButton;
