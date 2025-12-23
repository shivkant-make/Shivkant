
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, FileInput, FileOutput, PlusCircle, Search, Settings, LogOut, Package, ClipboardList } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import RecordModal from './components/RecordModal';
import { RecordType, InventoryRecord } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inward' | 'outward'>('dashboard');
  const [records, setRecords] = useState<InventoryRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<InventoryRecord | undefined>();
  const [modalType, setModalType] = useState<RecordType>(RecordType.INWARD);

  // Initial mock data
  useEffect(() => {
    const mockRecords: InventoryRecord[] = [
      {
        id: '1',
        type: RecordType.INWARD,
        date: '2024-05-20',
        time: '09:30',
        entityName: 'Steel Corp India',
        itemDescription: 'Raw Steel Rods - 12mm',
        quantity: 500,
        unit: 'KG',
        vehicleNumber: 'MH-12-GP-1234',
        documentNumber: 'GP-9981',
        remarks: 'Received in good condition',
        status: 'COMPLETED',
        imageUrl: 'https://picsum.photos/seed/steel/400/300'
      },
      {
        id: '2',
        type: RecordType.OUTWARD,
        date: '2024-05-20',
        time: '14:15',
        entityName: 'Precision Engineering Ltd',
        itemDescription: 'Finished Gears - Batch A',
        quantity: 120,
        unit: 'PCS',
        vehicleNumber: 'MH-14-BT-5566',
        documentNumber: 'INV-2024-001',
        remarks: 'Priority Shipment',
        status: 'PENDING',
        imageUrl: 'https://picsum.photos/seed/gears/400/300'
      }
    ];
    setRecords(mockRecords);
  }, []);

  const handleAddRecord = (type: RecordType) => {
    setModalType(type);
    setEditingRecord(undefined);
    setIsModalOpen(true);
  };

  const handleSaveRecord = (record: InventoryRecord) => {
    if (records.find(r => r.id === record.id)) {
      setRecords(records.map(r => r.id === record.id ? record : r));
    } else {
      setRecords([record, ...records]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="text-indigo-400" />
            ManuTrack
          </h1>
          <p className="text-slate-400 text-xs mt-1">Industrial Logistics Hub</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('inward')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'inward' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <FileInput size={20} />
            Inward Register
          </button>
          <button 
            onClick={() => setActiveTab('outward')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'outward' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <FileOutput size={20} />
            Outward Register
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors w-full">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-slate-800 capitalize">{activeTab}</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search entries..." 
                className="pl-10 pr-4 py-2 bg-slate-100 rounded-full text-sm border-none focus:ring-2 focus:ring-indigo-500 w-64"
              />
            </div>
            <button 
              onClick={() => handleAddRecord(RecordType.INWARD)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2 shadow-sm"
            >
              <PlusCircle size={18} />
              New Entry
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'dashboard' && <Dashboard records={records} />}
          {activeTab === 'inward' && (
            <Register 
              records={records.filter(r => r.type === RecordType.INWARD)} 
              title="Inward Movements" 
              type={RecordType.INWARD}
              onEdit={(r) => { setEditingRecord(r); setModalType(RecordType.INWARD); setIsModalOpen(true); }}
            />
          )}
          {activeTab === 'outward' && (
            <Register 
              records={records.filter(r => r.type === RecordType.OUTWARD)} 
              title="Outward Movements" 
              type={RecordType.OUTWARD}
              onEdit={(r) => { setEditingRecord(r); setModalType(RecordType.OUTWARD); setIsModalOpen(true); }}
            />
          )}
        </div>
      </main>

      {/* Record Modal */}
      {isModalOpen && (
        <RecordModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveRecord}
          initialData={editingRecord}
          defaultType={modalType}
        />
      )}
    </div>
  );
};

export default App;
