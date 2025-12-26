import React, { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import caseService, { type BillingRecord } from '../../services/caseService';
const PDFIcon = () => (
     <svg className="w-8 h-8 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" opacity="0.1"/>
        <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/>
        <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
        <text x="7" y="17" fontSize="6" fontWeight="bold" fill="currentColor">PDF</text>
    </svg>
)

interface CaseData {
    _id: string;
}

const CaseBilling: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    // @ts-ignore
    const { caseData } = useOutletContext<{ caseData: CaseData }>();

    const [billingRecords, setBillingRecords] = useState<BillingRecord[]>([]);
    const [loading, setLoading] = useState(true);

     // Expense Tab State
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [expenseForm, setExpenseForm] = useState({
        category: 'Court Fees',
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0]
    });

    const [receiptFile, setReceiptFile] = useState<File | null>(null);



    useEffect(() => {
        if (id) {
            loadBilling();
        }
    }, [id]);

    const loadBilling = async () => {
        try {
            if(!id) return;
            const data = await caseService.getCaseBilling(id);
            setBillingRecords(data);
        } catch (error) {
            console.error("Failed to load billing", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setReceiptFile(e.target.files[0]);
        }
    };

    const handleAddExpense = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('category', expenseForm.category);
            formData.append('description', `${expenseForm.category}: ${expenseForm.description}`);
            formData.append('amount', expenseForm.amount);
            formData.append('status', 'Unpaid');
            formData.append('date', expenseForm.date);
            
            if (receiptFile) {
                formData.append('file', receiptFile);
            }

            await caseService.addCaseBilling(id, formData);
            
            alert('Expense Added Successfully');
            setShowExpenseModal(false);
            setExpenseForm({
                category: 'Court Fees',
                description: '',
                amount: '',
                date: new Date().toISOString().split('T')[0]
            });
            setReceiptFile(null);
            loadBilling(); 
        } catch (error) {
            console.error(error);
            alert('Failed to add expense');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-6 text-center text-slate-500">Loading billing records...</div>;

    return (
        <div className="flex-1 bg-slate-50 p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">Billing & Expenses</h2>
                <button 
                    onClick={() => setShowExpenseModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold shadow-sm transition-colors flex items-center gap-2">
                    + Add Expense
                </button>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Receipt</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {billingRecords.map((bill, index) => (
                                <tr key={bill._id || index}>
                                    <td className="px-6 py-4 text-sm text-slate-600">{new Date(bill.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{bill.description}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-900">₹{bill.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${bill.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {bill.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-blue-600">
                                        {bill.receiptUrl ? (
                                            <a 
                                                href={bill.receiptUrl.startsWith('http') ? bill.receiptUrl : `http://localhost:5000${bill.receiptUrl}`} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="hover:underline flex items-center gap-1"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                View
                                            </a>
                                        ) : <span className="text-slate-400">-</span>}
                                    </td>
                                </tr>
                            ))}
                            {billingRecords.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No billing records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Add Expense Modal */}
                {showExpenseModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-lg text-slate-900">Add New Expense</h3>
                            <button onClick={() => setShowExpenseModal(false)} className="text-slate-400 hover:text-slate-600">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleAddExpense} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Expense Category</label>
                                <select 
                                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={expenseForm.category}
                                    onChange={e => setExpenseForm({...expenseForm, category: e.target.value})}
                                >
                                    <option>Court Fees</option>
                                    <option>Stamp Duty</option>
                                    <option>Notary Charges</option>
                                    <option>Filing Fees</option>
                                    <option>Clerk Charges</option>
                                    <option>Typing / Photocopy</option>
                                    <option>Travel / Conveyance</option>
                                    <option>Others</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                                <textarea 
                                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none h-20"
                                    placeholder="Enter expense details..."
                                    value={expenseForm.description}
                                    onChange={e => setExpenseForm({...expenseForm, description: e.target.value})}
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Amount (₹)</label>
                                    <input 
                                        type="number" 
                                        className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        required
                                        value={expenseForm.amount}
                                        onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        required
                                        value={expenseForm.date}
                                        onChange={e => setExpenseForm({...expenseForm, date: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Receipt Upload</label>
                                <label className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer block">
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        onChange={handleFileChange}
                                        accept="image/*,.pdf"
                                    />
                                    <div className="text-blue-500 mb-1 mx-auto"><PDFIcon /></div>
                                    <p className="text-xs text-slate-500">
                                        {receiptFile ? `Selected: ${receiptFile.name}` : 'Click to upload Receipt (Image/PDF)'}
                                    </p>
                                </label>
                            </div>

                            <div className="pt-2">
                                <button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all transform active:scale-95 disabled:opacity-50">
                                    {submitting ? 'Adding...' : 'Add Expense'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                )}
        </div>
    );
};

export default CaseBilling;
