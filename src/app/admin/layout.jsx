// FILE: src/app/admin/layout.jsx

// We will create admin-specific layout components later
// For now, we can reuse the main ones as placeholders
import Sidebar from "@/components/layout/Sidebar"; 
import Navbar from "@/components/layout/Navbar";

export default function AdminLayout({ children }) {
  // In a real application, you would add a check here to ensure
  // only users with an 'admin' role can access this layout.
  
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* We will later create an <AdminSidebar /> component with admin links */}
      <Sidebar isAdmin={true} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* We can reuse the Navbar, or create a specific <AdminNavbar /> */}
        <Navbar />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-800 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
