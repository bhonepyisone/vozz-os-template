// FILE: src/components/hrm/PayrollCalculator.jsx

'use client';

import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp, onSnapshot, addDoc, orderBy } from 'firebase/firestore';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Calculator, FileText } from 'lucide-react';
import Card from '@/components/ui/Card';
import NeumorphismButton from '@/components/ui/NeumorphismButton';
import ExportButton from '@/components/ui/ExportButton';

export default function PayrollCalculator({ setSuccessMessage }) {
  const { t } = useTranslation('common');
  const [staffList, setStaffList] = useState([]);
  const [thisMonthTotalSalary, setThisMonthTotalSalary] = useState(0);
  const [allStaffPayslips, setAllStaffPayslips] = useState(null);
  const [payrollHistory, setPayrollHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const calculatePayrollForPeriod = useCallback(async (staff, startDate, endDate) => {
    const startTimestamp = Timestamp.fromDate(startDate);
    const endTimestamp = Timestamp.fromDate(endDate);

    const attendanceRef = collection(db, 'attendance');
    const q = query(
      attendanceRef,
      where('staffId', '==', staff.id),
      where('scannedAt', '>=', startTimestamp),
      where('scannedAt', '<=', endTimestamp)
    );
    
    const attendanceSnapshot = await getDocs(q);
    const daysWorked = attendanceSnapshot.size;
    const standardWorkDays = 22;
    
    const baseSalary = staff.baseSalary || 0;
    const kpiBonus = staff.kpiBonus || 0;
    const proratedBase = (baseSalary / standardWorkDays) * daysWorked;
    const finalBonus = daysWorked > 0 ? kpiBonus : 0;
    const totalPay = proratedBase + finalBonus;

    return {
      staffId: staff.id,
      staffName: staff.name,
      payPeriod: `${format(startDate, 'PPP')} - ${format(endDate, 'PPP')}`,
      baseSalary,
      daysWorked,
      proratedPay: proratedBase,
      bonus: finalBonus,
      totalPay,
    };
  }, []);

  useEffect(() => {
    const usersCollection = collection(db, 'users');
    const unsubUsers = onSnapshot(usersCollection, (snapshot) => {
      setStaffList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const historyQuery = query(collection(db, 'payroll_history'), orderBy('runDate', 'desc'));
    const unsubHistory = onSnapshot(historyQuery, (snapshot) => {
        setPayrollHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubUsers();
      unsubHistory();
    };
  }, []);

  useEffect(() => {
    const calculateThisMonthTotal = async () => {
      if (staffList.length === 0) return;
      
      const now = new Date();
      const startDate = startOfMonth(now);
      const endDate = endOfMonth(now);
      let monthTotal = 0;

      for (const staff of staffList) {
        if (staff.baseSalary) {
          const payslip = await calculatePayrollForPeriod(staff, startDate, endDate);
          monthTotal += payslip.totalPay;
        }
      }
      setThisMonthTotalSalary(monthTotal);
    };
    calculateThisMonthTotal();
  }, [staffList, calculatePayrollForPeriod]);

  const handleFinalizeAll = async () => {
      setIsLoading(true);
      
      const now = new Date();
      const startDate = startOfMonth(now);
      const endDate = endOfMonth(now);
      let fullPayrollTotal = 0;
      const payslips = [];

      for (const staff of staffList) {
        if (staff.baseSalary) {
            const payslip = await calculatePayrollForPeriod(staff, startDate, endDate);
            payslips.push(payslip);
            fullPayrollTotal += payslip.totalPay;
        }
      }
      setAllStaffPayslips(payslips);

      await addDoc(collection(db, 'payroll_history'), {
          runDate: new Date(),
          period: `${format(startDate, 'MMMM yyyy')}`,
          totalAmount: fullPayrollTotal,
          payslips: payslips,
      });

      await addDoc(collection(db, 'expenses'), {
          description: `Payroll for ${format(startDate, 'MMMM yyyy')}`,
          category: 'Labor',
          amount: fullPayrollTotal,
          date: new Date(),
      });

      setSuccessMessage({ key: 'PayrollFinalized' });
      setIsLoading(false);
  };
  
  const csvHeaders = [
    { label: t('StaffName'), key: "staffName" },
    { label: t('BaseSalary'), key: "baseSalary" },
    { label: t('DaysWorkedInPeriod'), key: "daysWorked" },
    { label: t('ProratedPay'), key: "proratedPay" },
    { label: t('KPIBonus'), key: "bonus" },
    { label: t('TotalPay'), key: "totalPay" },
  ];

  return (
    <Card title={t('RunPayroll')}>
      <div className="p-4 mb-6 text-center bg-neo-bg shadow-neo-inset rounded-lg">
        <p className="text-sm text-gray-500">{t('EstimatedTotalSalaryExpenseThisMonth')}</p>
        <p className="text-3xl font-bold text-primary">{thisMonthTotalSalary.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
      </div>

      <div className="mb-6">
        <NeumorphismButton onClick={handleFinalizeAll} disabled={isLoading}>
          <Calculator className="w-5 h-5 mr-2" />
          <span>{isLoading ? t('Calculating') : t('FinalizeAndRecordPayroll')}</span>
        </NeumorphismButton>
      </div>

      {allStaffPayslips && (
        <Card title={t('ThisMonthsPayrollSummary')}>
          <div className="flex justify-end mb-4">
            <ExportButton data={allStaffPayslips} headers={csvHeaders} filename={`payroll_${format(new Date(), 'yyyy-MM')}.csv`}>
              {t('ExportToCSV')}
            </ExportButton>
          </div>
          <div className="space-y-2">
            {allStaffPayslips.map((p, i) => (
              <div key={i} className="p-3 border border-neo-dark/20 rounded-lg flex justify-between items-center">
                <span className="font-medium text-gray-800">{p.staffName}</span>
                <span className="font-bold text-gray-900">{p.totalPay.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
      
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('PayrollHistory')}</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
            {payrollHistory.map(run => (
                <Card key={run.id} className="!shadow-neo-md">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-bold">{run.period}</p>
                            <p className="text-sm text-gray-600">{t('Total')}: {run.totalAmount.toFixed(2)}</p>
                        </div>
                        <ExportButton data={run.payslips} headers={csvHeaders} filename={`payroll_${run.period.replace(' ','_')}.csv`}>
                            {t('ExportToCSV')}
                        </ExportButton>
                    </div>
                </Card>
            ))}
        </div>
      </div>
    </Card>
  );
}
