import React, { useState, useEffect } from 'react';

const ProfileInfo: React.FC = () => {
    const [user, setUser] = useState<any>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        // Simulate API call
        setTimeout(() => {
            localStorage.setItem('user', JSON.stringify(user));
            setMessage({ type: 'success', text: 'Profile updated successfully.' });
            setIsLoading(false);
            
            // Clear message after 3 seconds
            setTimeout(() => setMessage(null), 3000);
            
            // Dispatch storage event or custom event to update sidebar immediately if needed
            // But since sidebar reads once on load or we might need context, we'll leave simple for now.
            // A reload might be needed to see name change in sidebar if we don't use context.
            window.dispatchEvent(new Event('storage'));
        }, 800);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Profile Information</h2>
             </div>
             
             {message && (
                <div className={`mb-4 p-3 rounded-lg border ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'} animate-in fade-in slide-in-from-top-1`}>
                    {message.text}
                </div>
            )}

             <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">First Name</label>
                        <input 
                            name="firstName"
                            type="text" 
                            value={user.firstName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Last Name</label>
                        <input 
                            name="lastName"
                            type="text" 
                            value={user.lastName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                    <input 
                        name="email"
                        type="email" 
                        value={user.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-slate-50"
                        disabled 
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Contact support to change email.</p>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                    <input 
                        name="phone"
                        type="tel" 
                        value={user.phone || ''}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 555-5555"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                    />
                </div>

                <div className="pt-4 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                    >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
             </form>
        </div>
    );
};

export default ProfileInfo;
