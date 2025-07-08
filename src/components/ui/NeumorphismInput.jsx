// FILE: src/components/ui/NeumorphismInput.jsx

'use client';

const NeumorphismInput = ({ className = '', ...props }) => {
  return (
    <input 
      {...props}
      className={`w-full my-1 p-3 bg-neo-bg rounded-lg shadow-neo-inset focus:outline-none text-sm ${className}`} 
    />
  );
};

export default NeumorphismInput;
