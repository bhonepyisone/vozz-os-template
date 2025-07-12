// FILE: src/components/crm/LoyaltyStatus.jsx

'use client';

import { Star, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Card from '@/components/ui/Card';

const TIERS = {
  BRONZE: { name: 'Bronze', minSpend: 0, color: 'text-orange-700' },
  SILVER: { name: 'Silver', minSpend: 20000, color: 'text-gray-600' },
  GOLD: { name: 'Gold', minSpend: 50000, color: 'text-yellow-600' },
};

const getNextTier = (currentSpend) => {
  if (currentSpend < TIERS.SILVER.minSpend) return TIERS.SILVER;
  if (currentSpend < TIERS.GOLD.minSpend) return TIERS.GOLD;
  return null;
};

export default function LoyaltyStatus({ customerName, currentSpend, currentTier }) {
  const { t } = useTranslation('common');
  const nextTier = getNextTier(currentSpend);
  
  let progress = 0;
  let spendToNext = 0;

  if (nextTier) {
    const previousTierMinSpend = currentTier === 'Silver' ? TIERS.BRONZE.minSpend : TIERS.SILVER.minSpend;
    const spendInCurrentTier = currentSpend - previousTierMinSpend;
    const spendNeededForNextTier = nextTier.minSpend - previousTierMinSpend;
    progress = Math.min((spendInCurrentTier / spendNeededForNextTier) * 100, 100);
    spendToNext = nextTier.minSpend - currentSpend;
  }

  return (
    <Card title={t('LoyaltyStatus')}>
      <h2 className="text-xl font-semibold text-gray-800 mb-1">{customerName}</h2>
      <p className="text-sm text-gray-500 mb-4">{t('Status')}</p>

      <div className="flex items-center mb-4">
        <Star className={`w-10 h-10 mr-4 ${TIERS[currentTier.toUpperCase()]?.color || 'text-gray-400'}`} />
        <div>
          <p className="text-2xl font-bold text-gray-900">{currentTier}</p>
          <p className="text-sm text-gray-600">{t('CurrentSpend')}: {currentSpend.toLocaleString()}</p>
        </div>
      </div>

      {nextTier ? (
        <div>
          <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
            <span>{t('Progress to')} {t(nextTier.name)}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-neo-bg rounded-full h-2.5 shadow-neo-inset">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            {t('Spend')} {spendToNext.toLocaleString()} {t('more to reach')} {t(nextTier.name)} {t('tier')}!
          </p>
        </div>
      ) : (
        <div className="text-center text-sm text-green-600 font-semibold flex items-center justify-center">
          <TrendingUp className="w-4 h-4 mr-2"/> {t('You are at the highest tier!')}
        </div>
      )}
    </Card>
  );
}
