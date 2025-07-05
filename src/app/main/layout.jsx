// FILE: src/app/(main)/layout.jsx

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen bg-background">
      {/* We will create the Sidebar component later */}
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* We will create the Navbar component later */}
        <Navbar />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
