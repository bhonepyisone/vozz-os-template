// FILE: src/components/menu/EditMenuModal.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, updateDoc, collection, onSnapshot } from 'firebase/firestore';
import { Save, PlusCircle, Trash2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import NeumorphismInput from '@/components/ui/NeumorphismInput';
import NeumorphismButton from '@/components/ui/NeumorphismButton';
import NeumorphismSelect from '@/components/ui/NeumorphismSelect';

export default function EditMenuModal({ isOpen, onClose, menuItem }) {
  // State for form fields
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [recipe, setRecipe] = useState([]);
  
  // State for data from Firestore
  const [inventoryItems, setInventoryItems] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all available inventory items and categories for dropdowns
  useEffect(() => {
    const invUnsub = onSnapshot(collection(db, 'inventory'), (snapshot) => {
      setInventoryItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const catUnsub = onSnapshot(collection(db, 'categories'), (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      invUnsub();
      catUnsub();
    };
  }, []);

  // When the modal opens, populate the form with the selected menu item's data
  useEffect(() => {
    if (menuItem) {
      setName(menuItem.name || '');
      setPrice(menuItem.price || '');
      setCategory(menuItem.category || '');
      setImage(menuItem.image || '');
      setRecipe(menuItem.recipe || []);
    }
  }, [menuItem]);

  const handleAddIngredient = () => {
    setRecipe([...recipe, { inventoryId: '', name: '', quantity: 1 }]);
  };

  const handleRemoveIngredient = (index) => {
    setRecipe(recipe.filter((_, i) => i !== index));
  };

  const handleRecipeChange = (index, field, value) => {
    const newRecipe = [...recipe];
    if (field === 'inventoryId') {
      const selectedItem = inventoryItems.find(item => item.id === value);
      newRecipe[index].name = selectedItem?.name || '';
    }
    newRecipe[index][field] = value;
    setRecipe(newRecipe);
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!menuItem) return;
    if (Number(price) < 0 || recipe.some(ing => Number(ing.quantity) < 0)) {
      alert("Price and ingredient quantities cannot be negative.");
      return;
    }
    setIsLoading(true);
    try {
      const menuDocRef = doc(db, 'menu', menuItem.id);
      await updateDoc(menuDocRef, {
        name,
        price: Number(price),
        category,
        image,
        recipe,
      });
      alert("Menu item updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating menu item:", error);
      alert("Failed to update menu item.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit: ${menuItem?.name}`}>
      <form onSubmit={handleSaveChanges} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Item Name</label>
          <NeumorphismInput type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <NeumorphismInput type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <NeumorphismSelect value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select a category</option>
            {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
          </NeumorphismSelect>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Image (Emoji)</label>
          <NeumorphismInput type="text" value={image} onChange={(e) => setImage(e.target.value)} />
        </div>

        <div className="border-t border-neo-dark/20 pt-4">
          <h3 className="font-semibold text-gray-800 mb-2">Recipe Ingredients</h3>
          <div className="space-y-2">
            {recipe.map((ing, index) => (
              <div key={index} className="flex items-center space-x-2">
                <NeumorphismSelect value={ing.inventoryId} onChange={(e) => handleRecipeChange(index, 'inventoryId', e.target.value)} className="flex-1 !my-0">
                  <option value="">Select Ingredient</option>
                  {inventoryItems.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                </NeumorphismSelect>
                <NeumorphismInput type="number" min="0" value={ing.quantity} onChange={(e) => handleRecipeChange(index, 'quantity', Number(e.target.value))} className="!w-20 !my-0" placeholder="Qty" />
                <NeumorphismButton type="button" onClick={() => handleRemoveIngredient(index)} className="!w-auto !p-3 !rounded-full !text-red-600"><Trash2 className="w-4 h-4" /></NeumorphismButton>
              </div>
            ))}
          </div>
          <button type="button" onClick={handleAddIngredient} className="mt-2 flex items-center text-sm text-primary hover:underline">
            <PlusCircle className="w-4 h-4 mr-1" /> Add Ingredient
          </button>
        </div>

        <div className="pt-4">
          <NeumorphismButton type="submit" disabled={isLoading}>
            <Save className="w-5 h-5" />
            <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
          </NeumorphismButton>
        </div>
      </form>
    </Modal>
  );
}
