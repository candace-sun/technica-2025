import { useState } from 'react';
import { ShoppingCart, Plus, Check, Sparkles, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';

interface ShoppingItem {
  id: string;
  name: string;
  completed: boolean;
  suggested?: boolean;
}

export function ShoppingList() {
  const [newItem, setNewItem] = useState('');
  const [items, setItems] = useState<ShoppingItem[]>([
    { id: '1', name: 'Organic Milk', completed: false, suggested: false },
    { id: '2', name: 'Fresh Strawberries', completed: false, suggested: true },
    { id: '3', name: 'Eggs', completed: false, suggested: false },
    { id: '4', name: 'Greek Yogurt', completed: true, suggested: true },
    { id: '5', name: 'Baby Spinach', completed: false, suggested: true },
    { id: '6', name: 'Whole Grain Bread', completed: false, suggested: false },
  ]);

  const suggestions = [
    'Bell Peppers',
    'Cherry Tomatoes',
    'Avocados',
    'Blueberries',
  ];

  const toggleItem = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const addItem = () => {
    if (newItem.trim()) {
      setItems([
        { id: Date.now().toString(), name: newItem, completed: false, suggested: false },
        ...items,
      ]);
      setNewItem('');
    }
  };

  const addSuggestion = (suggestion: string) => {
    setItems([
      { id: Date.now().toString(), name: suggestion, completed: false, suggested: true },
      ...items,
    ]);
  };

  const activeItems = items.filter(item => !item.completed);
  const completedItems = items.filter(item => item.completed);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-br from-[var(--eco-green)] to-[var(--eco-dark)] p-6 rounded-2xl text-white">
        <div className="flex items-center gap-3 mb-2">
          <ShoppingCart className="w-8 h-8" />
          <h2>Shopping List</h2>
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-semibold">{activeItems.length}</div>
          <div className="text-sm opacity-90">items to buy</div>
        </div>
      </div>

      {/* Add New Item */}
      <div className="flex gap-2">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addItem()}
          placeholder="Add item to shopping list..."
          className="flex-1 bg-white border-2 border-[var(--eco-green)]/20 focus:border-[var(--eco-green)] rounded-xl"
        />
        <Button
          onClick={addItem}
          className="bg-[var(--eco-green)] hover:bg-[var(--eco-dark)] text-white rounded-xl px-4"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {/* AI Suggestions */}
      <div className="bg-gradient-to-br from-[var(--eco-pink)] to-[var(--eco-yellow)] p-4 rounded-2xl">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-[var(--eco-dark)]" />
          <h3 className="text-sm font-semibold text-[var(--eco-dark)]">Smart Suggestions</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => addSuggestion(suggestion)}
              className="px-3 py-1.5 bg-white/80 hover:bg-white text-sm text-[var(--eco-dark)] rounded-full border-2 border-white/50 transition-all hover:scale-105"
            >
              + {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Active Items */}
      {activeItems.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-[var(--eco-dark)]/60 px-1">To Buy</h3>
          {activeItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 bg-white p-4 rounded-xl border-2 border-[var(--eco-green)]/10 hover:border-[var(--eco-green)]/30 transition-colors group"
            >
              <Checkbox
                checked={item.completed}
                onCheckedChange={() => toggleItem(item.id)}
                className="border-2 border-[var(--eco-green)] data-[state=checked]:bg-[var(--eco-green)]"
              />
              <div className="flex-1 flex items-center gap-2">
                <span className="text-[var(--eco-dark)]">{item.name}</span>
                {item.suggested && (
                  <Sparkles className="w-3.5 h-3.5 text-[var(--eco-pink)]" />
                )}
              </div>
              <button
                onClick={() => deleteItem(item.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Completed Items */}
      {completedItems.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-[var(--eco-dark)]/60 px-1">Completed</h3>
          {completedItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 bg-[var(--eco-mint)]/50 p-4 rounded-xl group"
            >
              <Checkbox
                checked={item.completed}
                onCheckedChange={() => toggleItem(item.id)}
                className="border-2 border-[var(--eco-green)] data-[state=checked]:bg-[var(--eco-green)]"
              />
              <div className="flex-1 flex items-center gap-2">
                <span className="text-[var(--eco-dark)]/60 line-through">{item.name}</span>
                <Check className="w-4 h-4 text-[var(--eco-green)]" />
              </div>
              <button
                onClick={() => deleteItem(item.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
