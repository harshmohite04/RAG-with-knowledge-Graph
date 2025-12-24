import React, { useState } from 'react';

const ProfileSecurity: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleUpdatePassword = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (passwords.new !== passwords.confirm) {
            setMessage({ type: 'error', text: 'New passwords do not match.' });
            return;
        }

        if (passwords.new.length < 8) {
             setMessage({ type: 'error', text: 'Password must be at least 8 characters.' });
             return;
        }

        setIsLoading(true);
        setTimeout(() => {
            setPasswords({ current: '', new: '', confirm: '' });
            setMessage({ type: 'success', text: 'Password updated successfully.' });
            setIsLoading(false);
            setTimeout(() => setMessage(null), 3000);
        }, 800);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Security</h2>
            
            {message && (
                <div className={`mb-4 p-3 rounded-lg border ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'} animate-in fade-in slide-in-from-top-1`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Current Password</label>
                    <input 
                        name="current"
                        type="password" 
                        value={passwords.current}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">New Password</label>
                        <input 
                            name="new"
                            type="password" 
                            value={passwords.new}
                            onChange={handlePasswordChange}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Confirm New Password</label>
                        <input 
                            name="confirm"
                            type="password" 
                            value={passwords.confirm}
                            onChange={handlePasswordChange}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                        />
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={isLoading || !passwords.current || !passwords.new}
                        className="px-6 py-2 bg-white text-slate-700 border border-slate-300 font-bold rounded-lg hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
                    >
                        {isLoading ? 'Updating...' : 'Update Password'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileSecurity;
