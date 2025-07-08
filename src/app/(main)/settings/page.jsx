// FILE: src/app/(main)/settings/page.jsx

'use client';

import { useAuthStore } from '@/lib/auth';
import UserProfileSettings from '@/components/settings/UserProfileSettings';
import ShopSettings from '@/components/settings/ShopSettings';

export default function SettingsPage() {
  const { user } = useAuthStore();

  const canManageShop = user?.role === 'Admin' || user?.role === 'Management';

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-700 mb-6" style={{textShadow: '1px 1px 1px #ffffff'}}>Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <UserProfileSettings />
        {canManageShop && <ShopSettings />}
      </div>
    </div>
  );
}
