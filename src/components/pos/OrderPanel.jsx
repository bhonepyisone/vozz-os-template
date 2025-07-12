// FILE: src/components/pos/OrderPanel.jsx

'use client';

import { X, User, MinusCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import NeumorphismButton from '@/components/ui/NeumorphismButton';
import NeumorphismInput from '@/components/ui/NeumorphismInput';

export default function OrderPanel({ 
  orderItems, 
  onProcessPayment, 
  onRemoveItem, 
  selectedCustomer,
  onSelectCustomerClick,
  selectedTable,
  onClearOrder,
  taxPercent,
  onTaxChange,
  subtotal,
  taxAmount,
  total,
}) {
  const { t } = useTranslation('common');

  return (
    <div className="bg-neo-bg p-6 rounded-2xl shadow-neo-lg flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">{t('CurrentOrder')}</h2>
        {selectedTable && (
          <span className="px-3 py-1 text-sm font-bold bg-neo-bg text-primary rounded-full shadow-neo-md">
            {t('Table')}: {selectedTable.name}
          </span>
        )}
      </div>
      
      <div className="mb-4 p-3 border border-neo-dark/20 rounded-lg flex justify-between items-center">
        <div className="flex items-center">
          <User className="w-5 h-5 mr-3 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">
            {selectedCustomer ? selectedCustomer.name : t('WalkInCustomer')}
          </span>
        </div>
        <button onClick={onSelectCustomerClick} className="text-sm text-primary hover:underline">
          {selectedCustomer ? t('Change') : t('Select')}
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto">
        {orderItems.length > 0 ? (
          orderItems.map((item, index) => (
            <div key={`${item.id}-${index}`} className="flex items-center">
              <div className="flex-1">
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {item.quantity} x {item.price.toLocaleString()}
                </p>
              </div>
              <p className="font-semibold w-24 text-right">{(item.price * item.quantity).toLocaleString()}</p>
              <button onClick={() => onRemoveItem(index)} className="ml-2 p-1 text-gray-400 hover:text-red-500">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-10">
            <p>{t('SelectItemsPrompt')}</p>
          </div>
        )}
      </div>
      <div className="mt-4 border-t border-neo-dark/20 pt-4 space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>{t('Subtotal')}</span>
          <span>{subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center">
            <span className="mr-1">{t('Tax')}</span>
            <NeumorphismInput 
              type="number"
              value={taxPercent}
              onChange={onTaxChange}
              className="!w-12 !p-1 !my-0 text-center"
              placeholder="0"
            />
            <span className="ml-1">%</span>
          </div>
          <span>{taxAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
        </div>
        <div className="flex justify-between text-xl font-bold text-gray-900">
          <span>{t('Total')}</span>
          <span>{total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
        </div>
        <div className="flex space-x-2 mt-4">
          <NeumorphismButton 
            onClick={onClearOrder}
            disabled={orderItems.length === 0}
            className="!w-1/4 !text-red-600"
          >
            <MinusCircle className="w-5 h-5"/>
          </NeumorphismButton>
          <NeumorphismButton 
            onClick={onProcessPayment}
            disabled={orderItems.length === 0}
            className="!w-3/4"
          >
            {t('ProcessPayment')}
          </NeumorphismButton>
        </div>
      </div>
    </div>
  );
}
