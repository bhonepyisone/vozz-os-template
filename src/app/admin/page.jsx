// FILE: src/app/admin/page.jsx

'use client';

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-100 mb-6">Admin Panel</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder card for Shop Management */}
        <div className="bg-gray-700 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-2">Shop Management</h2>
          <p className="text-gray-300">
            Create, view, and manage all shop accounts in the system.
          </p>
          <button className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
            Manage Shops
          </button>
        </div>

        {/* Placeholder card for User Management */}
        <div className="bg-gray-700 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-2">User Management</h2>
          <p className="text-gray-300">
            Pre-register new users, assign roles, and manage user access.
          </p>
          <button className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
            Manage Users
          </button>
        </div>

        {/* Placeholder card for System Settings */}
        <div className="bg-gray-700 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-2">System Settings</h2>
          <p className="text-gray-300">
            Configure system-wide settings, security policies, and API integrations.
          </p>
           <button className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
            Configure Settings
          </button>
        </div>
      </div>
    </div>
  );
}
