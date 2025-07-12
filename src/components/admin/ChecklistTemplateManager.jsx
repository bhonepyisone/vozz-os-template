// FILE: src/components/admin/ChecklistTemplateManager.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { PlusCircle, Trash2, ListChecks } from 'lucide-react';
import NeumorphismInput from '@/components/ui/NeumorphismInput';
import NeumorphismButton from '@/components/ui/NeumorphismButton';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

export default function ChecklistTemplateManager() {
  const [templates, setTemplates] = useState([]);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newItemText, setNewItemText] = useState({});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const templatesCollection = collection(db, 'checklist_templates');
    const unsubscribe = onSnapshot(templatesCollection, (snapshot) => {
      const templateList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTemplates(templateList);
    });
    return () => unsubscribe();
  }, []);

  const handleAddTemplate = async () => {
    if (!newTemplateName.trim()) return;
    await addDoc(collection(db, 'checklist_templates'), {
      name: newTemplateName,
      items: [],
    });
    setNewTemplateName('');
  };

  const handleAddItem = async (templateId) => {
    const text = newItemText[templateId];
    if (!text || !text.trim()) return;
    const templateRef = doc(db, 'checklist_templates', templateId);
    await updateDoc(templateRef, {
      items: arrayUnion(text)
    });
    setNewItemText(prev => ({ ...prev, [templateId]: '' }));
  };

  const handleDeleteClick = (templateId, itemText) => {
    setItemToDelete({ templateId, itemText });
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      const { templateId, itemText } = itemToDelete;
      const templateRef = doc(db, 'checklist_templates', templateId);
      await updateDoc(templateRef, {
        items: arrayRemove(itemText)
      });
      setItemToDelete(null);
      setIsConfirmOpen(false);
    }
  };

  return (
    <>
      <div className="bg-neo-bg p-6 rounded-2xl shadow-neo-lg text-gray-700">
        <h2 className="text-xl font-semibold mb-4">Checklist Templates</h2>
        <div className="mb-6 flex space-x-2">
          <NeumorphismInput
            type="text"
            value={newTemplateName}
            onChange={(e) => setNewTemplateName(e.target.value)}
            placeholder="New template name (e.g., Onboarding)"
          />
          <NeumorphismButton onClick={handleAddTemplate} className="!w-auto !px-4 !py-2.5 !text-green-600"><PlusCircle/></NeumorphismButton>
        </div>
        <div className="space-y-6">
          {templates.map(template => (
            <div key={template.id} className="p-4 border border-neo-dark/20 rounded-lg">
              <h3 className="font-bold text-lg mb-2">{template.name}</h3>
              <ul className="space-y-2">
                {template.items.map((item, index) => (
                  <li key={index} className="flex justify-between items-center bg-neo-bg p-2 rounded-md shadow-neo-sm">
                    <span className="flex items-center"><ListChecks className="w-4 h-4 mr-2 text-primary"/>{item}</span>
                    <button onClick={() => handleDeleteClick(template.id, item)} className="p-1 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex space-x-2">
                <NeumorphismInput
                  type="text"
                  value={newItemText[template.id] || ''}
                  onChange={(e) => setNewItemText(prev => ({ ...prev, [template.id]: e.target.value }))}
                  placeholder="Add new checklist item"
                />
                <NeumorphismButton onClick={() => handleAddItem(template.id)} className="!w-auto !px-4 !py-2.5 !text-green-600"><PlusCircle/></NeumorphismButton>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Checklist Item"
      >
        Are you sure you want to remove this item: &quot;{itemToDelete?.itemText}&quot;?
      </ConfirmationModal>
    </>
  );
}
