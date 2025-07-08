// FILE: src/components/ui/Card.jsx

'use client';

const Card = ({ children, title, className = '', ...props }) => {
  return (
    // Apply the Neumorphism styles for the card to match your example's .container
    <div className={`bg-neo-bg p-6 rounded-2xl shadow-neo-lg ${className}`} {...props}>
      {title && (
        <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b border-neo-dark/50 pb-2">
          {title}
        </h2>
      )}
      <div className="text-gray-600">
        {children}
      </div>
    </div>
  );
};

export default Card;
