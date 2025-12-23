
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { TrendingUp, Package, MoveDown, MoveUp, AlertCircle } from 'lucide-react';
import { InventoryRecord, RecordType } from '../types';

interface DashboardProps {
  records: InventoryRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ records }) => {
  const inwardCount = records.filter(r => r.type === RecordType.INWARD).length;
  const outwardCount = records.filter(r => r.type === RecordType.OUTWARD).length;
  const pendingCount = records.filter(r => r.status === 'PENDING').length;

  // Transform data for chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    return {
      name: dateStr.slice(5),
      inward: records.filter(r => r.date === dateStr && r.type === RecordType.INWARD).length,
      outward: records.filter(r => r.date === dateStr && r.type === RecordType.OUTWARD).length,
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Movements" 
          value={records.length.toString()} 
          icon={<Package className="text-indigo-600" />} 
          trend="+12%" 
          color="indigo" 
        />
        <StatCard 
          title="Inward Logs" 
          value={inwardCount.toString()} 
          icon={<MoveDown className="text-emerald-600" />} 
          trend="+5%" 
          color="emerald" 
        />
        <StatCard 
          title="Outward Logs" 
          value={outwardCount.toString()} 
          icon={<MoveUp className="text-amber-600" />} 
          trend="+8%" 
          color="amber" 
        />
        <StatCard 
          title="Pending Verification" 
          value={pendingCount.toString()} 
          icon={<AlertCircle className="text-rose-600" />} 
          trend="-2%" 
          color="rose" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Movement Trends (Last 7 Days)</h3>
            <div className="flex gap-4 text-sm font-medium">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Inward</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-indigo-500"></span> Outward</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={last7Days}>
                <defs>
                  <linearGradient id="colorInward" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOutward" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="inward" stroke="#10b981" fillOpacity={1} fill="url(#colorInward)" strokeWidth={2} />
                <Area type="monotone" dataKey="outward" stroke="#6366f1" fillOpacity={1} fill="url(#colorOutward)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Mini List */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Live Logs</h3>
          <div className="space-y-6">
            {records.slice(0, 5).map(record => (
              <div key={record.id} className="flex items-start gap-3">
                <div className={`mt-1 p-2 rounded-lg ${record.type === RecordType.INWARD ? 'bg-emerald-50' : 'bg-indigo-50'}`}>
                  {record.type === RecordType.INWARD ? <MoveDown size={16} className="text-emerald-600" /> : <MoveUp size={16} className="text-indigo-600" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{record.entityName}</p>
                  <p className="text-xs text-slate-500 line-clamp-1">{record.itemDescription}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{record.time} • {record.date}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-indigo-600 text-sm font-medium hover:bg-indigo-50 rounded-lg transition-colors">
            View All Logs
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend, color }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl bg-${color}-50`}>{icon}</div>
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
        {trend}
      </span>
    </div>
    <p className="text-slate-500 text-sm font-medium">{title}</p>
    <h4 className="text-3xl font-bold text-slate-900 mt-1">{value}</h4>
  </div>
);

export default Dashboard;
