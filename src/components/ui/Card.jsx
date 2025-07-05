// FILE: src/components/ui/Card.jsx

'use client';

const Card = ({ children, title, className = '', ...props }) => {
  return (
    <div className={`bg-white p-6 rounded-2xl shadow-lg ${className}`} {...props}>
      {title && (
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};

export default Card;