
import React from 'react';
import { Eye, Edit2, CheckCircle, Clock, XCircle, FileText, ClipboardList } from 'lucide-react';
import { InventoryRecord, RecordType } from '../types';

interface RegisterProps {
  records: InventoryRecord[];
  title: string;
  type: RecordType;
  onEdit: (record: InventoryRecord) => void;
}

const Register: React.FC<RegisterProps> = ({ records, title, type, onEdit }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        <span className="text-sm text-slate-500">{records.length} entries found</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Date & Time</th>
              <th className="px-6 py-4">{type === RecordType.INWARD ? 'Supplier' : 'Customer'}</th>
              <th className="px-6 py-4">Item Details</th>
              <th className="px-6 py-4">Quantity</th>
              <th className="px-6 py-4">Vehicle / Ref</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-800">{record.date}</div>
                  <div className="text-xs text-slate-500">{record.time}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-indigo-600">{record.entityName}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-800 font-medium truncate max-w-[200px]">{record.itemDescription}</div>
                  <div className="text-xs text-slate-500">Doc: {record.documentNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700">
                    {record.quantity} {record.unit}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-700 font-mono">{record.vehicleNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={record.status} />
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEdit(record)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit Entry"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                      <Eye size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {records.length === 0 && (
          <div className="flex flex-col items-center justify-center p-20 text-slate-400">
            {/* Using ClipboardList here - now imported */}
            <ClipboardList size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">No records found for this category</p>
            <p className="text-sm">Try adjusting your filters or adding a new entry.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: InventoryRecord['status'] }) => {
  switch (status) {
    case 'COMPLETED':
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700"><CheckCircle size={14} /> Completed</span>;
    case 'PENDING':
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700"><Clock size={14} /> Pending</span>;
    case 'REJECTED':
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700"><XCircle size={14} /> Rejected</span>;
    default:
      return null;
  }
};

export default Register;
