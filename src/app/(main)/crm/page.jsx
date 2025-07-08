// FILE: src/app/(main)/crm/page.jsx

'use client';

import CustomerTable from '@/components/crm/CustomerTable';
import LoyaltyStatus from '@/components/crm/LoyaltyStatus';

export default function CrmPage() {
  // Placeholder data for the LoyaltyStatus component
  const featuredCustomer = {
    name: 'John Smith',
    spend: 52500,
    tier: 'Gold',
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Customer Relationship Management</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Section: Customer Table */}
        <div className="lg:col-span-2">
          <CustomerTable />
        </div>

        {/* Right Section: Featured Customer Loyalty Status */}
        <div className="space-y-8">
          <LoyaltyStatus 
            customerName={featuredCustomer.name}
            currentSpend={featuredCustomer.spend}
            currentTier={featuredCustomer.tier}
          />
        </div>

      </div>
    </div>
  );
}
