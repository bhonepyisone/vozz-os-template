// FILE: src/app/(auth)/layout.jsx

export default function AuthLayout({ children }) {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
        {children}
      </div>
    </main>
  );
}
