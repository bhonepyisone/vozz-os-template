// FILE: src/components/ui/NeumorphismSelect.jsx

'use client';

const NeumorphismSelect = ({ children, className = '', ...props }) => {
  return (
    <select 
      {...props}
      className={`w-full my-1 p-3 bg-neo-bg rounded-lg shadow-neo-inset focus:outline-none appearance-none text-sm ${className}`}
    >
      {children}
    </select>
  );
};

export default NeumorphismSelect;
