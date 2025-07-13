'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CustomerTable from '@/components/crm/CustomerTable';
import LoyaltyStatus from '@/components/crm/LoyaltyStatus';
import EditCustomerModal from '@/components/crm/EditCustomerModal';
import SuccessModal from '@/components/ui/SuccessModal';

export default function CrmPage() {
  const { t } = useTranslation('common');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Placeholder data for the LoyaltyStatus component
  const featuredCustomer = {
    name: 'John Smith',
    spend: 52500,
    tier: 'Gold',
  };

  const handleEditClick = (customer) => {
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-gray-700 mb-6" style={{textShadow: '1px 1px 1px #ffffff'}}>{t('CRM')}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2">
            <CustomerTable onEdit={handleEditClick} />
          </div>

          <div className="space-y-8">
            <LoyaltyStatus 
              customerName={featuredCustomer.name}
              currentSpend={featuredCustomer.spend}
              currentTier={featuredCustomer.tier}
            />
          </div>

        </div>
      </div>

      <EditCustomerModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        customer={selectedCustomer}
        onSuccess={setSuccessMessage}
      />

      <SuccessModal
        isOpen={!!successMessage}
        onClose={() => setSuccessMessage('')}
        title="Success!"
      >
        {successMessage}
      </SuccessModal>
    </>
  );
}