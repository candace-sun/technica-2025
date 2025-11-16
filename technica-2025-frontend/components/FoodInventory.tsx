import { useState } from 'react';
import { Apple, AlertCircle, CheckCircle, Clock, Plus, Search, Camera, Scan, Receipt, PenSquare, ChefHat, Sparkles } from 'lucide-react';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

interface FoodItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  expiryDate: string;
  daysUntilExpiry: number;
}

interface Recipe {
  id: string;
  name: string;
  emoji: string;
  ingredients: string[];
  wasteReduction: string;
}

export function FoodInventory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  const foodItems: FoodItem[] = [
    { id: '1', name: 'Organic Milk', category: 'Dairy', quantity: 1, expiryDate: 'Nov 18, 2025', daysUntilExpiry: 3 },
    { id: '2', name: 'Fresh Strawberries', category: 'Fruits', quantity: 1, expiryDate: 'Nov 16, 2025', daysUntilExpiry: 1 },
    { id: '3', name: 'Cheddar Cheese', category: 'Dairy', quantity: 1, expiryDate: 'Nov 25, 2025', daysUntilExpiry: 10 },
    { id: '4', name: 'Baby Spinach', category: 'Vegetables', quantity: 1, expiryDate: 'Nov 17, 2025', daysUntilExpiry: 2 },
    { id: '5', name: 'Greek Yogurt', category: 'Dairy', quantity: 4, expiryDate: 'Nov 22, 2025', daysUntilExpiry: 7 },
    { id: '6', name: 'Bell Peppers', category: 'Vegetables', quantity: 3, expiryDate: 'Nov 20, 2025', daysUntilExpiry: 5 },
  ];

  const recipes: Recipe[] = [
    {
      id: '1',
      name: 'Strawberry Spinach Smoothie',
      emoji: '🥤',
      ingredients: ['Strawberries', 'Spinach', 'Yogurt', 'Milk'],
      wasteReduction: 'Uses expiring strawberries & spinach!'
    },
    {
      id: '2',
      name: 'Veggie Cheese Omelette',
      emoji: '🍳',
      ingredients: ['Bell Peppers', 'Spinach', 'Cheddar', 'Milk'],
      wasteReduction: 'Perfect for expiring veggies!'
    },
    {
      id: '3',
      name: 'Greek Yogurt Parfait',
      emoji: '🥣',
      ingredients: ['Greek Yogurt', 'Strawberries'],
      wasteReduction: 'Quick & uses expiring berries!'
    }
  ];

  const getExpiryStatus = (days: number) => {
    if (days <= 1) return { color: 'bg-red-100 text-red-700 border-red-300', icon: AlertCircle, text: 'Expires Soon!' };
    if (days <= 3) return { color: 'bg-[var(--eco-yellow)] text-[var(--eco-dark)] border-[var(--eco-yellow)]', icon: Clock, text: `${days} days left` };
    return { color: 'bg-[var(--eco-mint)] text-[var(--eco-green)] border-[var(--eco-green)]/30', icon: CheckCircle, text: `${days} days left` };
  };

  const filteredItems = foodItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const expiringSoon = foodItems.filter(item => item.daysUntilExpiry <= 3).length;

  const addOptions = [
    {
      id: 'camera',
      title: 'Camera Scan',
      description: 'Take a photo of your items',
      icon: Camera,
      color: 'from-[#88B68E] to-[#7AA580]',
      emoji: '📸'
    },
    {
      id: 'barcode',
      title: 'Barcode Scan',
      description: 'Scan product barcode',
      icon: Scan,
      color: 'from-[#A8DAFF] to-[#7CB8E8]',
      emoji: '📱'
    },
    {
      id: 'receipt',
      title: 'Receipt Scan',
      description: 'Upload shopping receipt',
      icon: Receipt,
      color: 'from-[#FFD6E8] to-[#FFC2DE]',
      emoji: '🧾'
    },
    {
      id: 'manual',
      title: 'Manual Entry',
      description: 'Type in item details',
      icon: PenSquare,
      color: 'from-[#FFF281] to-[#FFE066]',
      emoji: '✏️'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div 
          className="p-4 rounded-xl text-white shadow-md"
          style={{
            background: 'linear-gradient(135deg, #88B68E 0%, #7AA580 100%)',
            border: '3px solid white'
          }}
        >
          <div className="text-2xl font-semibold">{foodItems.length}</div>
          <div className="text-xs opacity-90">Total Items</div>
        </div>
        <div 
          className="p-4 rounded-xl text-[var(--eco-dark)] shadow-md"
          style={{
            background: 'var(--eco-yellow)',
            border: '3px solid white'
          }}
        >
          <div className="text-2xl font-semibold">{expiringSoon}</div>
          <div className="text-xs opacity-80">Expiring Soon</div>
        </div>
        <div 
          className="p-4 rounded-xl text-[var(--eco-dark)] shadow-md"
          style={{
            background: 'var(--eco-pink)',
            border: '3px solid white'
          }}
        >
          <div className="text-2xl font-semibold">6</div>
          <div className="text-xs opacity-80">Categories</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--eco-dark)]/40" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search your food inventory..."
          className="pl-10 bg-white border-2 border-[var(--eco-green)]/20 focus:border-[var(--eco-green)] rounded-xl"
        />
      </div>

      {/* Zero Waste Recipe Suggestions */}
      <div 
        className="p-4 rounded-xl shadow-md"
        style={{
          background: 'linear-gradient(135deg, #FFF8DC 0%, #FFFEF7 100%)',
          border: '3px solid var(--eco-green)'
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <ChefHat className="w-5 h-5 text-[var(--eco-green)]" />
          <h3 className="font-bold text-[var(--eco-dark)]">Zero Waste Recipes</h3>
          <Sparkles className="w-4 h-4 text-[var(--eco-yellow)]" />
        </div>
        <p className="text-xs text-[var(--eco-dark)]/70 mb-3">Based on items expiring soon ♡</p>
        
        <div className="space-y-2">
          {recipes.map((recipe) => (
            <button
              key={recipe.id}
              className="w-full text-left p-3 bg-white rounded-xl border-2 border-[var(--eco-green)]/20 hover:border-[var(--eco-green)]/50 transition-all hover:scale-[1.02]"
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{recipe.emoji}</div>
                <div className="flex-1">
                  <div className="font-semibold text-[var(--eco-dark)] text-sm mb-1">{recipe.name}</div>
                  <div className="text-xs text-[var(--eco-dark)]/60 mb-1">
                    {recipe.ingredients.join(', ')}
                  </div>
                  <div className="inline-flex items-center gap-1 text-xs bg-[var(--eco-mint)] text-[var(--eco-green)] px-2 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    {recipe.wasteReduction}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Food Items List */}
      <div className="space-y-2">
        {filteredItems.map((item) => {
          const status = getExpiryStatus(item.daysUntilExpiry);
          const StatusIcon = status.icon;
          
          return (
            <div
              key={item.id}
              className="bg-white p-4 rounded-xl border-2 border-[var(--eco-green)]/10 hover:border-[var(--eco-green)]/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-[var(--eco-dark)]">{item.name}</h4>
                    {item.quantity > 1 && (
                      <Badge variant="secondary" className="text-xs bg-[var(--eco-mint)] text-[var(--eco-green)] border-0">
                        ×{item.quantity}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-[var(--eco-dark)]/60 mb-2">{item.category}</div>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border ${status.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {status.text}
                  </div>
                </div>
                <div className="text-right text-xs text-[var(--eco-dark)]/60">
                  <div>Expires</div>
                  <div className="font-medium text-[var(--eco-dark)]">{item.expiryDate}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Item Button */}
      <Button 
        onClick={() => setShowAddDialog(true)}
        className="w-full bg-[var(--eco-green)] hover:bg-[var(--eco-dark)] text-white rounded-xl h-12"
        style={{
          border: '3px solid white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        <Plus className="w-5 h-5 mr-2" />
        Add New Items
      </Button>

      {/* Add Item Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent 
          className="max-w-md"
          style={{
            borderRadius: '24px',
            border: '4px solid var(--eco-pink)',
            background: 'linear-gradient(135deg, #FFFEF7 0%, #E8F5E9 100%)'
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-center text-xl text-[var(--eco-green)] flex items-center justify-center gap-2">
              <span>✨</span>
              <span>Add New Items</span>
              <span>✨</span>
            </DialogTitle>
            <DialogDescription className="text-center text-[var(--eco-dark)]/70 text-sm">
              Choose how you'd like to add your item ♡
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-3 pt-4">
            {addOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  className="p-5 bg-white rounded-2xl border-3 border-white shadow-md hover:scale-105 transition-all"
                  style={{
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                  }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md"
                      style={{
                        background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                        border: '3px solid white'
                      }}
                      className={`bg-gradient-to-br ${option.color}`}
                    >
                      <div className="text-2xl">{option.emoji}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-sm text-[var(--eco-dark)] mb-1">
                        {option.title}
                      </div>
                      <div className="text-xs text-[var(--eco-dark)]/60">
                        {option.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-4">
            <Button
              onClick={() => setShowAddDialog(false)}
              variant="outline"
              className="w-full rounded-xl border-2 border-[var(--eco-green)]/30 hover:bg-[var(--eco-mint)]"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
