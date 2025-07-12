// FILE: src/app/(main)/hrm/page.jsx

'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/auth';
import { useTranslation } from 'react-i18next';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
import AnnouncementManager from '@/components/hrm/AnnouncementManager';
import EditAnnouncementModal from '@/components/hrm/EditAnnouncementModal';


// A component to render the navigation tabs for managers
const ManagerTabs = ({ activeTab, setActiveTab }) => {
    const { t } = useTranslation('common');
    const tabs = [
        'Directory', 'Checklists', 'Performance', 'Attendance', 
        'Salary', 'Leave', 'Reimbursements', 'Tips', 'Kudos', 'Payroll', 'Announcements'
    ];
    return (
        <div className="flex flex-wrap bg-neo-bg p-1 rounded-lg shadow-neo-inset-active">
            {tabs.map(tab => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all duration-200 ${
                        activeTab === tab 
                        ? 'bg-neo-bg shadow-neo-md text-primary' 
                        : 'text-gray-600'
                    }`}
                >
                    {t(tab)}
                </button>
            ))}
        </div>
    );
};

export default function HrmPage() {
  const { t } = useTranslation('common');
  const { user } = useAuthStore();
  const isManager = user?.role === 'Admin' || user?.role === 'Management';
  
  const [activeTab, setActiveTab] = useState('Directory');
  
  // State for all modals
  const [isEditStaffModalOpen, setIsEditStaffModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditSalaryModalOpen, setIsEditSalaryModalOpen] = useState(false);
  const [staffForSalary, setStaffForSalary] = useState(null);
  const [confirmState, setConfirmState] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  
  // New state for announcement modals
  const [isEditAnnounceModalOpen, setIsEditAnnounceModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

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

  const handleEditAnnouncementClick = (ann) => {
    setSelectedAnnouncement(ann);
    setIsEditAnnounceModalOpen(true);
  };

  const handleDeleteAnnouncementClick = (ann) => {
    setConfirmState({
      isOpen: true,
      title: 'Delete Announcement',
      message: 'Are you sure you want to delete this announcement?',
      onConfirm: async () => {
        await deleteDoc(doc(db, 'announcements', ann.id));
        setConfirmState({ isOpen: false });
      }
    });
  };

  // This function renders only the component for the currently active tab
  const renderManagerContent = () => {
      switch (activeTab) {
          case 'Directory': return <StaffTable onEdit={handleEditStaffClick} onDelete={handleDeleteStaffClick} />;
          case 'Checklists': return <StaffChecklistManager setSuccessMessage={setSuccessMessage} />;
          case 'Performance': return <PerformanceReviewManager setSuccessMessage={setSuccessMessage} />;
          case 'Attendance': return <AttendanceLog />;
          case 'Salary': return <SalaryManager onEdit={handleEditSalaryClick} />;
          case 'Leave': return <LeaveManager setConfirmState={setConfirmState} setSuccessMessage={setSuccessMessage} />;
          case 'Reimbursements': return <ReimbursementManager setConfirmState={setConfirmState} setSuccessMessage={setSuccessMessage} />;
          case 'Tips': return <TipCalculator />;
          case 'Kudos': return <KudosForm setSuccessMessage={setSuccessMessage} />;
          case 'Payroll': return <PayrollCalculator setSuccessMessage={setSuccessMessage} />;
          case 'Announcements': return <AnnouncementManager setSuccessMessage={setSuccessMessage} onEdit={handleEditAnnouncementClick} onDelete={handleDeleteAnnouncementClick} />;
          default: return <StaffTable onEdit={handleEditStaffClick} onDelete={handleDeleteStaffClick} />;
      }
  };

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-gray-700 mb-6" style={{textShadow: '1px 1px 1px #ffffff'}}>{t('HumanResourceManagement')}</h1>
        
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
            <KudosForm setSuccessMessage={setSuccessMessage} />
          </div>
        )}
      </div>

      {/* All modals are kept here at the top level of the page */}
      <EditStaffModal 
        isOpen={isEditStaffModalOpen}
        onClose={() => setIsEditStaffModalOpen(false)}
        staffMember={selectedStaff}
        onSuccess={setSuccessMessage}
      />
      <EditSalaryModal
        isOpen={isEditSalaryModalOpen}
        onClose={() => setIsEditSalaryModalOpen(false)}
        staffMember={staffForSalary}
        onSuccess={setSuccessMessage}
      />
      <EditAnnouncementModal
        isOpen={isEditAnnounceModalOpen}
        onClose={() => setIsEditAnnounceModalOpen(false)}
        announcement={selectedAnnouncement}
        onSuccess={setSuccessMessage}
      />
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={t('DeleteStaffMember')}
      >
        {t('DeleteStaffConfirm', { name: staffToDelete?.name })}
      </ConfirmationModal>
      <ConfirmationModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState({ isOpen: false })}
        onConfirm={confirmState.onConfirm}
        title={t(confirmState.title)}
      >
        {t(confirmState.message, confirmState.options)}
      </ConfirmationModal>
      <SuccessModal
        isOpen={!!successMessage}
        onClose={() => setSuccessMessage('')}
        title={t('Success')}
      >
        {t(successMessage.key || successMessage, successMessage.options)}
      </SuccessModal>
    </>
  );
}
