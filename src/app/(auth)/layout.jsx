// FILE: src/app/(auth)/layout.jsx

export default function AuthLayout({ children }) {
  return (
    <main className="flex items-center justify-center min-h-screen bg-neo-bg p-4">
      {/* The main container with the Neumorphism shadow */}
      <div className="w-full max-w-sm p-8 bg-neo-bg rounded-2xl shadow-neo-lg">
        {children}
      </div>
    </main>
  );
}
