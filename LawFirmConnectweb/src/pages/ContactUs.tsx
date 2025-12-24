import React, { useState } from 'react';


// Icons
const LocationIcon = () => (
    <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
)

const PhoneIcon = () => (
    <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
    </svg>
)

const EmailIcon = () => (
    <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
)

const ClockIcon = () => (
    <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
    </svg>
)

const ChevronDownIcon = () => (
    <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
)

const InfoIcon = () => (
    <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
)

const ContactUs: React.FC = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus('idle');
        
        // Mock Form Submission
        setTimeout(() => {
            setStatus('success');
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            setLoading(false);
        }, 1500);
    };

    const faqs = [
        {
            question: "Do you offer free consultations?",
            answer: "Yes, we offer a complimentary 30-minute initial consultation for all new clients to discuss their legal needs and options."
        },
        {
            question: "What documents should I bring?",
            answer: "For your initial consultation, please bring any existing legal notices, contracts, correspondence, or police reports related to your case."
        },
        {
            question: "How do you bill for your services?",
            answer: "We offer various billing structures including hourly rates, flat fees, and contingency fees, depending on the nature of your case."
        }
    ];

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[300px] bg-blue-900 overflow-hidden">
                <div className="absolute inset-0">
                    <img 
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070" 
                        alt="Office Building" 
                        className="w-full h-full object-cover opacity-20"
                    />
                     <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-50 to-transparent"></div>
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Get in Touch</h1>
                    <p className="text-blue-100 max-w-xl text-lg">
                        We are here to help with your legal needs. Schedule a consultation or ask a general question. Our team is ready to assist you.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 pb-20">
                <div className="grid lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Contact Info */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Contact Card */}
                        <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-100">
                             <h2 className="text-xl font-bold text-slate-900 mb-6">Contact Information</h2>
                             
                             <div className="space-y-6">
                                 <div className="flex gap-4">
                                     <div className="pt-1"><LocationIcon /></div>
                                     <div>
                                         <div className="font-bold text-slate-900 text-sm">Visit Us</div>
                                         <div className="text-slate-500 text-sm">123 Legal Avenue, Suite 400<br/>New York, NY 10001</div>
                                     </div>
                                 </div>

                                 <div className="flex gap-4">
                                     <div className="pt-1"><PhoneIcon /></div>
                                     <div>
                                         <div className="font-bold text-slate-900 text-sm">Call Us</div>
                                         <div className="text-slate-500 text-sm">+1 (555) 012-3456</div>
                                     </div>
                                 </div>

                                  <div className="flex gap-4">
                                     <div className="pt-1"><EmailIcon /></div>
                                     <div>
                                         <div className="font-bold text-slate-900 text-sm">Email Us</div>
                                         <div className="text-slate-500 text-sm">contact@lexpartners.com</div>
                                     </div>
                                 </div>

                                  <div className="flex gap-4">
                                     <div className="pt-1"><ClockIcon /></div>
                                     <div>
                                         <div className="font-bold text-slate-900 text-sm">Business Hours</div>
                                         <div className="text-slate-500 text-sm">Mon-Fri: 9:00 AM - 6:00 PM<br/>Sat-Sun: Closed</div>
                                     </div>
                                 </div>
                             </div>
                        </div>

                         {/* Map Card */}
                         <div className="bg-white rounded-xl shadow-lg p-2 border border-slate-100 h-64">
                             <img 
                                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1774"
                                alt="Map Placeholder"
                                className="w-full h-full object-cover rounded-lg opacity-80"
                             />
                             <div className="relative -mt-10 mb-2 ml-2 inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg shadow-sm text-xs font-bold text-blue-600">
                                 <LocationIcon /> Get Directions
                             </div>
                         </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-100 h-full">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Send us a Message</h2>
                             <p className="text-slate-500 mb-8">Please fill out the form below and we will get back to you shortly.</p>
                             
                             {status === 'success' && (
                                <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-lg text-sm font-medium">
                                    Thank you! Your message has been sent successfully. We will contact you soon.
                                </div>
                             )}
                             {status === 'error' && (
                                <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg text-sm font-medium">
                                    Something went wrong. Please try again later.
                                </div>
                             )}

                             <form onSubmit={handleSubmit} className="space-y-6">
                                 <div className="grid md:grid-cols-2 gap-6">
                                     <div>
                                         <label className="block text-xs font-bold text-slate-700 mb-2">Full Name</label>
                                         <input 
                                            name="name" 
                                            type="text" 
                                            required
                                            placeholder="John Doe" 
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                                        />
                                     </div>
                                     <div>
                                         <label className="block text-xs font-bold text-slate-700 mb-2">Email Address</label>
                                         <input 
                                            name="email" 
                                            type="email" 
                                            required
                                            placeholder="john@example.com" 
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                                        />
                                     </div>
                                 </div>

                                  <div className="grid md:grid-cols-2 gap-6">
                                     <div>
                                         <label className="block text-xs font-bold text-slate-700 mb-2">Phone Number (Optional)</label>
                                         <input 
                                            name="phone" 
                                            type="tel" 
                                            placeholder="+1 (555) 000-0000" 
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                                        />
                                     </div>
                                     <div>
                                         <label className="block text-xs font-bold text-slate-700 mb-2">Legal Matter</label>
                                         <select 
                                            name="subject" 
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-600"
                                        >
                                             <option value="">Select a subject</option>
                                             <option value="Corporate Law">Corporate Law</option>
                                             <option value="Family Law">Family Law</option>
                                             <option value="Criminal Defense">Criminal Defense</option>
                                             <option value="Other">Other</option>
                                         </select>
                                     </div>
                                 </div>

                                 <div>
                                     <label className="block text-xs font-bold text-slate-700 mb-2">How can we help?</label>
                                     <textarea 
                                        name="message" 
                                        required
                                        rows={6} 
                                        placeholder="Please describe your legal issue briefly..." 
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                                    ></textarea>
                                 </div>

                                 {/* Disclaimer */}
                                 <div className="bg-blue-50 rounded-lg p-4 flex gap-3">
                                     <div className="pt-0.5"><InfoIcon /></div>
                                     <p className="text-xs text-blue-800 leading-relaxed">
                                         <span className="font-bold">Attorney-Client Privilege:</span> Please do not include sensitive confidential information in this form. The use of the Internet or this form for communication with the firm or any individual member of the firm does not establish an attorney-client relationship.
                                     </p>
                                 </div>

                                 <div className="flex items-start gap-3">
                                     <input type="checkbox" id="privacy" required className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                     <label htmlFor="privacy" className="text-sm text-slate-500">I agree to the terms and privacy policy.</label>
                                 </div>

                                 <button 
                                    type="submit" 
                                    disabled={loading}
                                    className={`bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? 'Sending...' : 'Submit Inquiry'}
                                     {!loading && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>}
                                 </button>
                             </form>
                        </div>
                    </div>

                </div>

                {/* FAQ Section */}
                <div className="mt-20 max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Common Questions</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                                <button 
                                    onClick={() => toggleFaq(index)}
                                    className="w-full flex items-center justify-between p-5 text-left bg-slate-50 hover:bg-slate-100 transition-colors"
                                >
                                    <span className="font-semibold text-slate-900">{faq.question}</span>
                                    <div className={`transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}>
                                        <ChevronDownIcon />
                                    </div>
                                </button>
                                {openFaq === index && (
                                    <div className="p-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 bg-white">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ContactUs;
