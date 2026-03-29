import { memo, useState } from 'react';
import { Upload, X } from 'lucide-react';

const ImportModal = memo(({ isOpen, onClose, onImport }) => {
    const [textA, setTextA] = useState('');
    const [textB, setTextB] = useState('');
    const [url, setUrl] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl flex flex-col overflow-hidden max-h-full">
                <div className="flex justify-between items-center p-4 border-b bg-slate-50">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Upload className="w-5 h-5 text-indigo-600" />
                        選手情報一括登録（インポート）
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 flex flex-col gap-4 overflow-y-auto">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 flex flex-col gap-1">
                            <label className="text-sm font-bold text-blue-700 border-b-2 border-blue-500 pb-1">
                                自チーム 選手データ
                            </label>
                            <span className="text-xs text-slate-500 mb-1">※1行に1人（例: 1 GK 選手名, 2 選手名）</span>
                            <textarea
                                value={textA}
                                onChange={(e) => setTextA(e.target.value)}
                                className="w-full h-48 p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm leading-relaxed"
                                placeholder={"1 GK 山田太郎\n2 佐藤次郎\n3 鈴木三郎"}
                            />
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                            <label className="text-sm font-bold text-red-700 border-b-2 border-red-500 pb-1">
                                相手チーム 選手データ
                            </label>
                            <span className="text-xs text-slate-500 mb-1">※1行に1人（例: 1 GK 選手名, 2 選手名）</span>
                            <textarea
                                value={textB}
                                onChange={(e) => setTextB(e.target.value)}
                                className="w-full h-48 p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none text-sm leading-relaxed"
                                placeholder={"1 GK 田中一郎\n2 高橋二郎\n3 伊藤三郎"}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 border-t pt-4 mt-2">
                        <label className="text-sm font-bold text-slate-700">
                            外部データ連携（オプション）
                        </label>
                        <span className="text-xs text-slate-500 mb-1">※将来実装予定: スプレッドシートや試合情報URLから自動取得する機能</span>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-slate-50"
                            placeholder="https://docs.google.com/spreadsheets/..."
                        />
                    </div>
                </div>

                <div className="p-4 border-t bg-slate-50 flex justify-end gap-2 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        キャンセル
                    </button>
                    <button
                        onClick={() => onImport(textA, textB)}
                        className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                        <Upload className="w-4 h-4" />
                        反映する
                    </button>
                </div>
            </div>
        </div>
    );
});

export default ImportModal;
