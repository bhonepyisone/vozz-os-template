// FILE: src/components/menu/RecipeEditor.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { Save, PlusCircle, Trash2 } from 'lucide-react';
import NeumorphismInput from '@/components/ui/NeumorphismInput';
import NeumorphismButton from '@/components/ui/NeumorphismButton';
import NeumorphismSelect from '@/components/ui/NeumorphismSelect';

export default function RecipeEditor({ setSuccessMessage }) {
  const [itemName, setItemName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('🍽️');
  const [recipe, setRecipe] = useState([]);
  
  const [categories, setCategories] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const catUnsub = onSnapshot(collection(db, 'categories'), (snapshot) => {
      setCategories(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const invUnsub = onSnapshot(collection(db, 'inventory'), (snapshot) => {
      setInventoryItems(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => { catUnsub(); invUnsub(); };
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    await addDoc(collection(db, 'categories'), { name: newCategory });
    setNewCategory('');
  };

  const handleRemoveCategory = async (categoryId) => {
    if (confirm("Are you sure you want to delete this category?")) {
      await deleteDoc(doc(db, 'categories', categoryId));
    }
  };

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

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!itemName || !price || !selectedCategory) {
      alert("Please fill in name, price, and category.");
      return;
    }
    setIsLoading(true);

    try {
      await addDoc(collection(db, 'menu'), {
        name: itemName,
        category: selectedCategory,
        price: Number(price),
        image: image,
        recipe: recipe,
      });
      
      setItemName('');
      setSelectedCategory('');
      setPrice('');
      setImage('🍽️');
      setRecipe([]);
      setSuccessMessage(`${itemName} has been added to the menu!`);

    } catch (error) {
      console.error("Error adding menu item:", error);
      alert("Failed to add menu item.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-neo-bg p-6 rounded-2xl shadow-neo-lg">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Menu Item</h2>
      <form onSubmit={handleAddItem} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-600">Item Name</label>
          <NeumorphismInput type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Price</label>
          <NeumorphismInput type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Image (Emoji)</label>
          <NeumorphismInput type="text" value={image} onChange={(e) => setImage(e.target.value)} required />
        </div>

        <div className="border-t border-neo-dark/20 pt-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
          <NeumorphismSelect value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} required>
            <option value="">Select a category</option>
            {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
          </NeumorphismSelect>
          <div className="flex space-x-2 mt-2">
            <NeumorphismInput type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="New category name" className="!my-0"/>
            <NeumorphismButton type="button" onClick={handleAddCategory} className="!w-auto !p-3 !text-green-600"><PlusCircle className="w-5 h-5"/></NeumorphismButton>
          </div>
        </div>

        <div className="border-t border-neo-dark/20 pt-4">
          <h3 className="font-semibold text-gray-700 mb-2">Recipe Ingredients</h3>
          <div className="space-y-2">
            {recipe.map((ing, index) => (
              <div key={index} className="flex items-center space-x-2">
                <NeumorphismSelect value={ing.inventoryId} onChange={(e) => handleRecipeChange(index, 'inventoryId', e.target.value)} className="flex-1 !my-0">
                  <option value="">Select Ingredient</option>
                  {inventoryItems.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                </NeumorphismSelect>
                <NeumorphismInput type="number" value={ing.quantity} onChange={(e) => handleRecipeChange(index, 'quantity', Number(e.target.value))} className="!w-20 !my-0" placeholder="Qty" />
                <NeumorphismButton type="button" onClick={() => handleRemoveIngredient(index)} className="!w-auto !p-3 !rounded-full !text-red-600"><Trash2 className="w-4 h-4" /></NeumorphismButton>
              </div>
            ))}
          </div>
          <button type="button" onClick={handleAddIngredient} className="mt-2 flex items-center text-sm text-primary hover:underline">
            <PlusCircle className="w-4 h-4 mr-1" /> Add Ingredient
          </button>
        </div>

        <NeumorphismButton type="submit" disabled={isLoading}>
          <Save className="w-5 h-5" />
          <span>{isLoading ? 'Saving...' : 'Save Item'}</span>
        </NeumorphismButton>
      </form>
    </div>
  );
}
