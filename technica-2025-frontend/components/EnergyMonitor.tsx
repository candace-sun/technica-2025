import { Zap, TrendingDown, Leaf, Lightbulb } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function EnergyMonitor() {
  const weeklyData = [
    { day: 'Mon', usage: 2.4 },
    { day: 'Tue', usage: 2.2 },
    { day: 'Wed', usage: 2.6 },
    { day: 'Thu', usage: 2.3 },
    { day: 'Fri', usage: 2.1 },
    { day: 'Sat', usage: 2.5 },
    { day: 'Sun', usage: 2.0 },
  ];

  const hourlyData = [
    { hour: '12am', usage: 1.8 },
    { hour: '4am', usage: 1.6 },
    { hour: '8am', usage: 2.4 },
    { hour: '12pm', usage: 3.2 },
    { hour: '4pm', usage: 2.8 },
    { hour: '8pm', usage: 2.6 },
  ];

  const tips = [
    {
      icon: Leaf,
      title: 'Great job!',
      description: 'Your fridge is running 15% more efficiently than last month!',
      color: 'bg-[var(--eco-green)]',
    },
    {
      icon: Lightbulb,
      title: 'Pro Tip',
      description: 'Keep your fridge 70-80% full for optimal energy efficiency.',
      color: 'bg-[var(--eco-yellow)]',
    },
    {
      icon: TrendingDown,
      title: 'Save More',
      description: 'Clean condenser coils quarterly to improve efficiency by up to 30%.',
      color: 'bg-[var(--eco-pink)]',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Current Usage */}
      <div className="bg-gradient-to-br from-[var(--eco-green)] to-[var(--eco-dark)] p-6 rounded-2xl text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h2>Energy Usage</h2>
            <p className="text-sm opacity-90">Real-time monitoring</p>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-5xl font-semibold">2.0</div>
          <div className="text-xl opacity-90">kWh/day</div>
        </div>
        <div className="mt-2 text-sm opacity-75">↓ 12% lower than average</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border-2 border-[var(--eco-green)]/20 text-center">
          <div className="text-2xl font-semibold text-[var(--eco-green)]">$8.50</div>
          <div className="text-xs text-[var(--eco-dark)]/60 mt-1">This Week</div>
        </div>
        <div className="bg-white p-4 rounded-xl border-2 border-[var(--eco-yellow)]/40 text-center">
          <div className="text-2xl font-semibold text-[var(--eco-dark)]">92%</div>
          <div className="text-xs text-[var(--eco-dark)]/60 mt-1">Efficiency</div>
        </div>
        <div className="bg-white p-4 rounded-xl border-2 border-[var(--eco-pink)]/40 text-center">
          <div className="text-2xl font-semibold text-[var(--eco-dark)]">18kg</div>
          <div className="text-xs text-[var(--eco-dark)]/60 mt-1">CO₂ Saved</div>
        </div>
      </div>

      {/* Weekly Usage Chart */}
      <div className="bg-white p-4 rounded-2xl border-2 border-[var(--eco-green)]/10">
        <h3 className="mb-4 text-[var(--eco-dark)]">Weekly Usage Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={weeklyData}>
            <defs>
              <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4BA258" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4BA258" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0F5D7" />
            <XAxis dataKey="day" stroke="#2D5F3C" style={{ fontSize: '12px' }} />
            <YAxis stroke="#2D5F3C" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '2px solid #4BA258',
                borderRadius: '12px',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey="usage"
              stroke="#4BA258"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorUsage)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Today's Usage */}
      <div className="bg-white p-4 rounded-2xl border-2 border-[var(--eco-green)]/10">
        <h3 className="mb-4 text-[var(--eco-dark)]">Today's Usage Pattern</h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0F5D7" />
            <XAxis dataKey="hour" stroke="#2D5F3C" style={{ fontSize: '12px' }} />
            <YAxis stroke="#2D5F3C" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '2px solid #4BA258',
                borderRadius: '12px',
                fontSize: '12px',
              }}
            />
            <Line
              type="monotone"
              dataKey="usage"
              stroke="#4BA258"
              strokeWidth={3}
              dot={{ fill: '#4BA258', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Efficiency Tips */}
      <div className="space-y-3">
        <h3 className="px-1 text-[var(--eco-dark)]">Efficiency Tips</h3>
        {tips.map((tip, index) => {
          const Icon = tip.icon;
          return (
            <div
              key={index}
              className="bg-white p-4 rounded-xl border-2 border-[var(--eco-green)]/10 hover:border-[var(--eco-green)]/30 transition-colors"
            >
              <div className="flex gap-3">
                <div className={`w-10 h-10 ${tip.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--eco-dark)] mb-1">{tip.title}</h4>
                  <p className="text-sm text-[var(--eco-dark)]/70">{tip.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
