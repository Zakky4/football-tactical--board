import { memo } from 'react';
import { X } from 'lucide-react';

const EditingPopup = memo(({ editTarget, editForm, onFormChange, onFormSubmit, onClose }) => {
    if (!editTarget) return null;
    return (
        <div
            className="fixed bg-white p-3 rounded-lg shadow-xl border border-slate-200 z-50 flex flex-col gap-2 transform -translate-x-1/2 mt-4"
            style={{ left: editTarget.x, top: editTarget.y }}
        >
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-500">選手情報編集</span>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
                    <X className="w-4 h-4" />
                </button>
            </div>
            <form onSubmit={onFormSubmit} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-semibold w-12 text-right">背番号</label>
                    <input
                        type="text"
                        value={editForm.label}
                        onChange={(e) => onFormChange(e, 'label')}
                        className="w-16 px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="No."
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-sm font-semibold w-12 text-right">名前</label>
                    <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => onFormChange(e, 'name')}
                        className="w-24 px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="名前"
                        autoFocus
                    />
                </div>
                <button type="submit" className="mt-1 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-2 rounded text-sm transition-colors">
                    保存
                </button>
            </form>
        </div>
    );
});

export default EditingPopup;
