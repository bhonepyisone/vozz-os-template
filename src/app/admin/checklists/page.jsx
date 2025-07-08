// FILE: src/app/admin/checklists/page.jsx

'use client';

import ChecklistTemplateManager from '@/components/admin/ChecklistTemplateManager';

export default function AdminChecklistsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-100 mb-6">On/Offboarding Checklists</h1>
      <p className="text-gray-400 mb-8">
        Create and manage the master templates for your employee checklists here. These templates can then be assigned to individual staff members from the HRM page.
      </p>
      <ChecklistTemplateManager />
    </div>
  );
}
