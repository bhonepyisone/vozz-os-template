// FILE: src/components/hrm/StaffChecklistManager.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, doc, updateDoc, where, query } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Circle, PlusCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import NeumorphismSelect from '@/components/ui/NeumorphismSelect';
import NeumorphismButton from '@/components/ui/NeumorphismButton';

export default function StaffChecklistManager({ setSuccessMessage }) {
  const { t } = useTranslation('common');
  const [staffList, setStaffList] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [assignedChecklists, setAssignedChecklists] = useState([]);
  
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');

  useEffect(() => {
    const staffUnsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      setStaffList(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const templateUnsub = onSnapshot(collection(db, 'checklist_templates'), (snapshot) => {
      setTemplates(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => { staffUnsub(); templateUnsub(); };
  }, []);

  useEffect(() => {
    if (!selectedStaffId) {
      setAssignedChecklists([]);
      return;
    }
    const q = query(collection(db, 'assigned_checklists'), where('staffId', '==', selectedStaffId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAssignedChecklists(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, [selectedStaffId]);

  const handleAssignChecklist = async () => {
    if (!selectedStaffId || !selectedTemplateId) {
      // This alert is for immediate user feedback on a form error.
      // In a more advanced version, this could be a themed error pop-up.
      alert("Please select a staff member and a template.");
      return;
    }
    const template = templates.find(t => t.id === selectedTemplateId);
    const staff = staffList.find(s => s.id === selectedStaffId);
    if (!template || !staff) return;

    await addDoc(collection(db, 'assigned_checklists'), {
      staffId: selectedStaffId,
      staffName: staff.name,
      templateId: selectedTemplateId,
      templateName: template.name,
      items: template.items.map(itemText => ({ text: itemText, completed: false })),
      assignedAt: new Date(),
    });
    
    // FIX: Use the themed success modal
    setSuccessMessage({ key: 'ChecklistAssigned', options: { templateName: template.name, staffName: staff.name } });
  };

  const handleToggleItem = async (checklistId, itemIndex) => {
    const checklist = assignedChecklists.find(c => c.id === checklistId);
    if (!checklist) return;

    const newItems = [...checklist.items];
    newItems[itemIndex].completed = !newItems[itemIndex].completed;

    const checklistRef = doc(db, 'assigned_checklists', checklistId);
    await updateDoc(checklistRef, { items: newItems });
  };

  return (
    <Card title={t('AssignAndTrackChecklists')}>
      <div className="p-4 border border-neo-dark/20 rounded-lg mb-6 flex items-end space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('SelectStaff')}</label>
          <NeumorphismSelect value={selectedStaffId} onChange={(e) => setSelectedStaffId(e.target.value)}>
            <option value="">-- {t('SelectStaff')} --</option>
            {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </NeumorphismSelect>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('SelectTemplate')}</label>
          <NeumorphismSelect value={selectedTemplateId} onChange={(e) => setSelectedTemplateId(e.target.value)}>
            <option value="">-- {t('SelectTemplate')} --</option>
            {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </NeumorphismSelect>
        </div>
        <NeumorphismButton onClick={handleAssignChecklist} className="!w-auto !px-4 !py-2.5">
            <PlusCircle className="w-5 h-5 mr-2"/>{t('Assign')}
        </NeumorphismButton>
      </div>

      <div>
        <h3 className="font-semibold text-gray-700 mb-2">
          {selectedStaffId ? `${t('ChecklistsFor')} ${staffList.find(s=>s.id === selectedStaffId)?.name}` : t('SelectStaffToViewChecklists')}
        </h3>
        <div className="space-y-4">
          {assignedChecklists.map(checklist => (
            <div key={checklist.id} className="p-4 border border-neo-dark/20 rounded-lg">
              <p className="font-bold">{checklist.templateName}</p>
              <ul className="mt-2 space-y-2">
                {checklist.items.map((item, index) => (
                  <li key={index} onClick={() => handleToggleItem(checklist.id, index)} className="flex items-center cursor-pointer group p-2 rounded-md hover:bg-neo-bg hover:shadow-neo-inset-active">
                    {item.completed ? 
                      <CheckCircle2 className="w-5 h-5 mr-3 text-green-500"/> : 
                      <Circle className="w-5 h-5 mr-3 text-gray-400 group-hover:text-primary"/>
                    }
                    <span className={`${item.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
