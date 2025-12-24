import React, { useState } from 'react';

const ProfileNotifications: React.FC = () => {
    const [notifications, setNotifications] = useState({
        email: true,
        sms: false
    });

    return (
         <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Notifications</h2>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:border-blue-100 transition-colors">
                    <div>
                        <h4 className="font-bold text-slate-900 text-sm">Email Notifications</h4>
                        <p className="text-xs text-slate-500">Receive updates about your cases via email.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={notifications.email} 
                            onChange={() => setNotifications({ ...notifications, email: !notifications.email })}
                            className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
                <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:border-blue-100 transition-colors">
                    <div>
                        <h4 className="font-bold text-slate-900 text-sm">SMS Notifications</h4>
                        <p className="text-xs text-slate-500">Get text messages for urgent updates.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={notifications.sms} 
                            onChange={() => setNotifications({ ...notifications, sms: !notifications.sms })}
                            className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>
         </div>
    );
};

export default ProfileNotifications;
