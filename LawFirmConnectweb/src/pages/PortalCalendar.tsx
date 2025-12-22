import React, { useEffect, useState } from 'react';
import api from '../api/client';
import PortalLayout from '../components/PortalLayout';
const PlusIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
)
const ClockIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)
const LocationIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
)
const PortalCalendar: React.FC = () => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');
    const [notes, setNotes] = useState('');
    const [lawyerId, setLawyerId] = useState(''); // In a real app, strict relation needed. 
    // For demo, we might need to fetch available lawyers or just pick the first one from user's case or a hardcoded ID/Email for now.
    // Or we can fetch 'lawyers' list. For simplicity in this demo, let's just create a 'General Consultation' or similar.
    // Wait, the backend Create Booking requires 'lawyerId'.
    // I can fetch available lawyers.

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await api.get('/schedule');
            setBookings(res.data); // Assuming GET /schedule returns user's bookings
            
            // Also need to get lawyers to book with. 
            // Since we don't have a public endpoint for 'list lawyers', I'll just hardcode or fetch if user has active cases with lawyers.
            // Let's rely on the user having a case.
            // Actually, for the demo, I will just CREATE a booking with the first available ID if possible, or maybe add a 'Lawyer' select
            // if I have an endpoint for it. I don't.
            // I'll check my 'me' profile to see if I am assigned a lawyer?
            // User schema doesn't have 'assignedLawyer'. Case has 'lawyerId'.
            // I'll fetch cases to find associated lawyers.
            const casesRes = await api.get('/cases');
            const lawyerIds = [...new Set(casesRes.data.map((c:any) => c.lawyerId).filter(Boolean))];
            if (lawyerIds.length > 0) {
                 setLawyerId(lawyerIds[0] as string); // Default to first found lawyer
            } 
            // If no cases/lawyers, we might have an issue creating a booking for a specific person. 
            // The Seeder created a Lawyer. I could hardcode that ID for "General Inquiry"?
            // Or I can add a quick endpoint OR just fail gracefully if no lawyer found.

        } catch (err) {
            console.error("Failed to fetch schedule", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!lawyerId) {
            alert("No attorney found to book with. Please ensure you have an active case.");
            return;
        }
        try {
            const dateTime = new Date(`${newDate}T${newTime}`);
            await api.post('/schedule', {
                lawyerId,
                date: dateTime.toISOString(),
                notes
            });
            setShowModal(false);
            setNewDate('');
            setNewTime('');
            setNotes('');
            fetchData(); // Refresh
            alert("Appointment requested!");
        } catch (error) {
            console.error("Booking failed", error);
            alert("Failed to request appointment. Slot might be taken.");
        }
    };

    if (loading) return <PortalLayout><div className="flex justify-center p-10">Loading Schedule...</div></PortalLayout>;

    return (
        <PortalLayout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Calendar</h2>
                    <p className="text-slate-500 mt-1">Manage your appointments and court dates.</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 rounded-lg text-sm font-bold text-white hover:bg-blue-700 shadow-md transition-all"
                >
                    <PlusIcon /> Request Appointment
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {bookings.length === 0 ? (
                    <div className="p-10 text-center text-slate-500">
                        No upcoming appointments or events.
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {bookings.map((booking: any) => {
                            const date = new Date(booking.date);
                            return (
                                <div key={booking._id} className="p-6 flex flex-col sm:flex-row gap-6 hover:bg-slate-50 transition-colors">
                                    <div className="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                                        <span className="text-xs font-bold uppercase">{date.toLocaleDateString([], { month: 'short' })}</span>
                                        <span className="text-xl font-bold">{date.getDate()}</span>
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-bold text-slate-900 text-lg">
                                                {booking.notes || 'Appointment'}
                                            </h4>
                                            <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                                                booking.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : 
                                                booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-slate-100 text-slate-500'
                                            }`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-4 text-sm text-slate-500">
                                            <div className="flex items-center gap-2">
                                                <ClockIcon />
                                                {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <LocationIcon />
                                                Video Call / Office
                                            </div>
                                             {/* If we had lawyer name populated, show it here */}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Simple Modal for Demo */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Request Appointment</h3>
                        <form onSubmit={handleCreateBooking}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                                <input 
                                    type="date" 
                                    required
                                    className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={newDate}
                                    onChange={e => setNewDate(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                                <input 
                                    type="time" 
                                    required
                                    className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={newTime}
                                    onChange={e => setNewTime(e.target.value)}
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Purpose / Notes</label>
                                <textarea 
                                    className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    rows={3}
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    placeholder="Briefly describe what you want to discuss..."
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button 
                                    type="button" 
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-bold text-white hover:bg-blue-700"
                                >
                                    Submit Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </PortalLayout>
    );
};

export default PortalCalendar;
