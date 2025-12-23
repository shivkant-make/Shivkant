
import React, { useState, useRef } from 'react';
import { X, Camera, Upload, Sparkles, Loader2, Save, Trash2, Wand2 } from 'lucide-react';
import { InventoryRecord, RecordType } from '../types';
import { GeminiService } from '../services/geminiService';

interface RecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: InventoryRecord) => void;
  initialData?: InventoryRecord;
  defaultType: RecordType;
}

const RecordModal: React.FC<RecordModalProps> = ({ isOpen, onClose, onSave, initialData, defaultType }) => {
  const [formData, setFormData] = useState<Partial<InventoryRecord>>(
    initialData || {
      type: defaultType,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      status: 'PENDING',
      unit: 'KG'
    }
  );
  
  const [imagePreview, setImagePreview] = useState<string | undefined>(initialData?.imageUrl);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAiEdit = async () => {
    if (!imagePreview || !aiPrompt) return;
    
    setIsProcessing(true);
    const editedImage = await GeminiService.editImage(imagePreview, aiPrompt);
    if (editedImage) {
      setImagePreview(editedImage);
      setAiPrompt('');
    } else {
      alert("Failed to process image. Please try again.");
    }
    setIsProcessing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalRecord: InventoryRecord = {
      ...formData as InventoryRecord,
      id: formData.id || Math.random().toString(36).substr(2, 9),
      imageUrl: imagePreview,
    };
    onSave(finalRecord);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {initialData ? 'Edit Entry' : 'New Movement Entry'}
            </h3>
            <p className="text-sm text-slate-500">Log incoming or outgoing manufacturing assets</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Form Fields */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Movement Type</label>
                <select 
                  name="type" 
                  value={formData.type} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                >
                  <option value={RecordType.INWARD}>Inward (Receipt)</option>
                  <option value={RecordType.OUTWARD}>Outward (Dispatch)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Status</label>
                <select 
                  name="status" 
                  value={formData.status} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                >
                  <option value="PENDING">Pending Check</option>
                  <option value="COMPLETED">Verified / Completed</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Time</label>
                <input type="time" name="time" value={formData.time} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">{formData.type === RecordType.INWARD ? 'Supplier Name' : 'Customer Name'}</label>
              <input 
                type="text" 
                name="entityName" 
                value={formData.entityName || ''} 
                onChange={handleChange} 
                placeholder="Enter organization name"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                required 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Item Description</label>
              <textarea 
                name="itemDescription" 
                value={formData.itemDescription || ''} 
                onChange={handleChange} 
                rows={2}
                placeholder="Briefly describe the goods..."
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none" 
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Quantity</label>
                <div className="flex gap-2">
                  <input type="number" name="quantity" value={formData.quantity || ''} onChange={handleChange} className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
                  <select name="unit" value={formData.unit} onChange={handleChange} className="w-24 px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                    <option value="KG">KG</option>
                    <option value="PCS">PCS</option>
                    <option value="MT">MT</option>
                    <option value="LTR">LTR</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Vehicle Number</label>
                <input type="text" name="vehicleNumber" value={formData.vehicleNumber || ''} onChange={handleChange} placeholder="e.g. MH-12-AB-1234" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">{formData.type === RecordType.INWARD ? 'Gate Pass No' : 'Invoice No'}</label>
              <input type="text" name="documentNumber" value={formData.documentNumber || ''} onChange={handleChange} placeholder="Document Reference" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
            </div>
          </div>

          {/* Nano Banana Image Area */}
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 flex items-center justify-between">
                <span>Verification Media</span>
                <span className="text-[10px] uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Secure Storage</span>
              </label>
              
              <div className="relative group aspect-video rounded-3xl overflow-hidden bg-slate-100 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center transition-all hover:border-indigo-400">
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Document" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 bg-white rounded-full text-slate-800 hover:scale-110 transition-transform shadow-lg"
                      >
                        <Camera size={20} />
                      </button>
                      <button 
                        type="button"
                        onClick={() => setImagePreview(undefined)}
                        className="p-3 bg-white rounded-full text-rose-600 hover:scale-110 transition-transform shadow-lg"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6">
                    <div className="mx-auto w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                      <Upload className="text-indigo-600" size={24} />
                    </div>
                    <p className="text-sm font-bold text-slate-800">Drop document photo here</p>
                    <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 10MB</p>
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Browse Files
                    </button>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>
            </div>

            {/* AI Magic Box (Nano Banana) */}
            <div className={`p-5 rounded-3xl border-2 transition-all ${imagePreview ? 'border-indigo-100 bg-indigo-50/30 shadow-sm' : 'border-slate-100 bg-slate-50/50 grayscale opacity-50 pointer-events-none'}`}>
              <div className="flex items-center gap-2 mb-4 text-indigo-700">
                <Sparkles size={18} />
                <h4 className="text-sm font-bold">Intelligent Image Processor</h4>
              </div>
              <div className="space-y-3">
                <div className="relative">
                  <input 
                    type="text" 
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Try 'Sharpen text' or 'Apply vintage filter'..."
                    className="w-full pl-4 pr-12 py-3 bg-white border border-indigo-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm shadow-sm"
                  />
                  <button 
                    type="button"
                    onClick={handleAiEdit}
                    disabled={isProcessing || !aiPrompt}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Retro filter', 'Clean background', 'High contrast', 'Auto-enhance'].map(tag => (
                    <button 
                      key={tag}
                      type="button"
                      onClick={() => setAiPrompt(tag)}
                      className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white border border-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-slate-400 mt-4 leading-relaxed">
                Powered by Gemini 2.5 Flash Image. This experimental tool uses generative AI to modify log images for better legibility or aesthetic filing.
              </p>
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 sticky bottom-0 z-10">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-white rounded-xl transition-all"
          >
            Discard
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            className="px-8 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
          >
            <Save size={18} />
            Save Entry
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecordModal;
