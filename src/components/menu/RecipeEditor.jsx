// FILE: src/components/menu/RecipeEditor.jsx

'use client';

import { Save, PlusCircle } from 'lucide-react';

export default function RecipeEditor({ selectedItem = "Signature Burger" }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Recipe for: <span className="text-primary">{selectedItem}</span>
      </h2>
      <form className="space-y-4">
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Ingredients</h3>
          <div className="space-y-2">
            {/* Placeholder for ingredient list */}
            <div className="flex items-center space-x-2">
              <input type="text" defaultValue="Beef Patty" className="flex-1 px-3 py-2 border border-gray-300 rounded-md" />
              <input type="number" defaultValue="1" className="w-20 px-3 py-2 border border-gray-300 rounded-md" />
              <input type="text" defaultValue="piece" className="w-24 px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div className="flex items-center space-x-2">
              <input type="text" defaultValue="Burger Bun" className="flex-1 px-3 py-2 border border-gray-300 rounded-md" />
              <input type="number" defaultValue="1" className="w-20 px-3 py-2 border border-gray-300 rounded-md" />
              <input type="text" defaultValue="piece" className="w-24 px-3 py-2 border border-gray-300 rounded-md" />
            </div>
          </div>
          <button type="button" className="mt-2 flex items-center text-sm text-primary hover:underline">
            <PlusCircle className="w-4 h-4 mr-1" /> Add Ingredient
          </button>
        </div>
        <div>
          <label htmlFor="instructions" className="block font-medium text-gray-700 mb-2">Instructions</label>
          <textarea id="instructions" rows="4" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., Grill patty, toast bun..."></textarea>
        </div>
        <button type="submit" className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90">
          <Save className="w-5 h-5 mr-2" /> Save Recipe
        </button>
      </form>
    </div>
  );
}