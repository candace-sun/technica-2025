import { useState } from 'react';
import { Thermometer, Snowflake } from 'lucide-react';
import { Slider } from './ui/slider';

export function TemperatureControl() {
  const [fridgeTemp, setFridgeTemp] = useState(38);
  const [freezerTemp, setFreezerTemp] = useState(0);

  return (
    <div className="space-y-6">
      {/* Fridge Temperature */}
      <div 
        className="p-6"
        style={{
          background: 'linear-gradient(135deg, #E8F5E9 0%, #D4EBD9 100%)',
          borderRadius: '20px',
          border: '4px solid white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-md"
            style={{
              background: 'linear-gradient(135deg, #88B68E 0%, #7AA580 100%)',
              border: '3px solid white'
            }}
          >
            <Thermometer className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-[var(--eco-dark)] font-bold">Fridge Temp</h3>
            <p className="text-xs text-[var(--eco-dark)]/70">Keep it fresh! ✿</p>
          </div>
        </div>
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <Slider
              value={[fridgeTemp]}
              onValueChange={(value) => setFridgeTemp(value[0])}
              min={32}
              max={45}
              step={1}
              className="[&_[role=slider]]:bg-[var(--eco-green)] [&_[role=slider]]:border-[var(--eco-green)]"
            />
          </div>
          <div className="text-4xl font-semibold text-[var(--eco-green)] min-w-[80px] text-right">
            {fridgeTemp}°F
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-[var(--eco-dark)]/60">
          <span>32°F</span>
          <span>45°F</span>
        </div>
      </div>

      {/* Freezer Temperature */}
      <div 
        className="p-6"
        style={{
          background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
          borderRadius: '20px',
          border: '4px solid white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-md"
            style={{
              background: 'linear-gradient(135deg, #64B5F6 0%, #42A5F5 100%)',
              border: '3px solid white'
            }}
          >
            <Snowflake className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-[#1565C0] font-bold">Freezer Temp</h3>
            <p className="text-xs text-[#1565C0]/70">Stay frozen! ❄️</p>
          </div>
        </div>
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <Slider
              value={[freezerTemp]}
              onValueChange={(value) => setFreezerTemp(value[0])}
              min={-10}
              max={10}
              step={1}
              className="[&_[role=slider]]:bg-[#2196F3] [&_[role=slider]]:border-[#2196F3]"
            />
          </div>
          <div className="text-4xl font-semibold text-[#2196F3] min-w-[80px] text-right">
            {freezerTemp}°F
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-[#1565C0]/60">
          <span>-10°F</span>
          <span>10°F</span>
        </div>
      </div>

      {/* Quick Status */}
      <div className="grid grid-cols-2 gap-4">
        <div 
          className="p-4"
          style={{
            background: 'white',
            borderRadius: '16px',
            border: '3px solid var(--eco-mint)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}
        >
          <div className="text-xs text-[var(--eco-dark)]/60 mb-1">Fridge Status</div>
          <div className="font-bold text-[var(--eco-green)]">Optimal ✓</div>
        </div>
        <div 
          className="p-4"
          style={{
            background: 'white',
            borderRadius: '16px',
            border: '3px solid #BBDEFB',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}
        >
          <div className="text-xs text-[#1565C0]/60 mb-1">Freezer Status</div>
          <div className="font-bold text-[#2196F3]">Perfect ✓</div>
        </div>
      </div>
    </div>
  );
}