// FILE: src/app/(main)/hrm/page.jsx

'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/auth';

// Import all the components for the HRM page
import StaffTable from '@/components/hrm/StaffTable';
import PayrollCalculator from '@/components/hrm/PayrollCalculator';
import LeaveManager from '@/components/hrm/LeaveManager';
import AttendanceLog from '@/components/hrm/AttendanceLog';
import SalaryManager from '@/components/hrm/SalaryManager';
import StaffChecklistManager from '@/components/hrm/StaffChecklistManager';
import PerformanceReviewManager from '@/components/hrm/PerformanceReviewManager';
import KudosForm from '@/components/hrm/KudosForm';
import TipCalculator from '@/components/hrm/TipCalculator';
import ReimbursementManager from '@/components/hrm/ReimbursementManager';
import EditStaffModal from '@/components/hrm/EditStaffModal';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import SuccessModal from '@/components/ui/SuccessModal';
import EditSalaryModal from '@/components/hrm/EditSalaryModal';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';


// A new component to render the navigation tabs for managers
const ManagerTabs = ({ activeTab, setActiveTab }) => {
    const tabs = [
        'Directory', 'Checklists', 'Performance', 'Attendance', 
        'Salary', 'Leave', 'Reimbursements', 'Tips', 'Kudos', 'Payroll'
    ];
    return (
        // FIX: Themed container for the tabs
        <div className="flex flex-wrap bg-neo-bg p-1 rounded-lg shadow-neo-inset-active">
            {tabs.map(tab => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    // FIX: Themed styles for active and inactive tabs
                    className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all duration-200 ${
                        activeTab === tab 
                        ? 'bg-neo-bg shadow-neo-md text-primary' 
                        : 'text-gray-600'
                    }`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};

export default function HrmPage() {
  const { user } = useAuthStore();
  const isManager = user?.role === 'Admin' || user?.role === 'Management';
  
  // State to manage the active tab
  const [activeTab, setActiveTab] = useState('Directory');
  
  // State for all modals
  const [isEditStaffModalOpen, setIsEditStaffModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditSalaryModalOpen, setIsEditSalaryModalOpen] = useState(false);
  const [staffForSalary, setStaffForSalary] = useState(null);

  const handleEditStaffClick = (staff) => {
    setSelectedStaff(staff);
    setIsEditStaffModalOpen(true);
  };

  const handleDeleteStaffClick = (staff) => {
    setStaffToDelete(staff);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (staffToDelete) {
      await deleteDoc(doc(db, 'users', staffToDelete.id));
      setStaffToDelete(null);
      setIsConfirmModalOpen(false);
    }
  };

  const handleEditSalaryClick = (staff) => {
    setStaffForSalary(staff);
    setIsEditSalaryModalOpen(true);
  };

  // This function renders only the component for the currently active tab
  const renderManagerContent = () => {
      switch (activeTab) {
          case 'Directory': return <StaffTable onEdit={handleEditStaffClick} onDelete={handleDeleteStaffClick} />;
          case 'Checklists': return <StaffChecklistManager />;
          case 'Performance': return <PerformanceReviewManager />;
          case 'Attendance': return <AttendanceLog />;
          case 'Salary': return <SalaryManager onEdit={handleEditSalaryClick} />;
          case 'Leave': return <LeaveManager />;
          case 'Reimbursements': return <ReimbursementManager />;
          case 'Tips': return <TipCalculator />;
          case 'Kudos': return <KudosForm />;
          case 'Payroll': return <PayrollCalculator />;
          default: return <StaffTable onEdit={handleEditStaffClick} onDelete={handleDeleteStaffClick} />;
      }
  };

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-gray-700 mb-6" style={{textShadow: '1px 1px 1px #ffffff'}}>Human Resource Management</h1>
        
        {isManager ? (
          // Manager View with Tabs
          <div>
            <ManagerTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="mt-8">
              {renderManagerContent()}
            </div>
          </div>
        ) : (
          // Regular Staff View (Simplified)
          <div className="space-y-8">
            <AttendanceLog />
            <KudosForm />
          </div>
        )}
      </div>

      {/* All modals are kept here at the top level of the page */}
      <EditStaffModal 
        isOpen={isEditStaffModalOpen}
        onClose={() => setIsEditStaffModalOpen(false)}
        staffMember={selectedStaff}
      />
      <EditSalaryModal
        isOpen={isEditSalaryModalOpen}
        onClose={() => setIsEditSalaryModalOpen(false)}
        staffMember={staffForSalary}
        onSuccess={setSuccessMessage}
      />
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Staff Member"
      >
        Are you sure you want to remove {staffToDelete?.name}? This action is permanent.
      </ConfirmationModal>
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
