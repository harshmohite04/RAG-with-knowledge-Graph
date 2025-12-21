import React from 'react';

const LogoIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
);

const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 py-16 text-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
                     
                     <div className="col-span-2 lg:col-span-2">
                         <div className="flex items-center gap-2 mb-6 text-white">
                             <div className="bg-blue-600 p-1.5 rounded">
                                 <LogoIcon />
                             </div>
                             <span className="font-bold text-lg">Lex & Partners</span>
                         </div>
                         <p className="text-slate-400 leading-relaxed max-w-xs mb-6">
                             Dedicated to providing exceptional legal representation with a personal touch. Your justice is our priority.
                         </p>
                         <div className="flex gap-4">
                             {/* Social Placeholder Icons */}
                             <a href="#" className="hover:text-blue-500 transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg></a>
                             <a href="#" className="hover:text-blue-500 transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg></a>
                             <a href="#" className="hover:text-blue-500 transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path><circle cx="4" cy="4" r="2"></circle></svg></a>
                         </div>
                     </div>

                     <div>
                         <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Practice Areas</h4>
                         <ul className="space-y-4">
                             <li><a href="#" className="hover:text-blue-500 transition-colors">Corporate Law</a></li>
                             <li><a href="#" className="hover:text-blue-500 transition-colors">Real Estate</a></li>
                             <li><a href="#" className="hover:text-blue-500 transition-colors">Family Law</a></li>
                             <li><a href="#" className="hover:text-blue-500 transition-colors">Criminal Defense</a></li>
                             <li><a href="#" className="hover:text-blue-500 transition-colors">Intellectual Property</a></li>
                         </ul>
                     </div>

                      <div>
                         <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Company</h4>
                         <ul className="space-y-4">
                             <li><a href="#" className="hover:text-blue-500 transition-colors">About Us</a></li>
                             <li><a href="#" className="hover:text-blue-500 transition-colors">Attorneys</a></li>
                             <li><a href="#" className="hover:text-blue-500 transition-colors">Careers</a></li>
                             <li><a href="#" className="hover:text-blue-500 transition-colors">Blog</a></li>
                             <li><a href="#" className="hover:text-blue-500 transition-colors">Contact</a></li>
                         </ul>
                     </div>

                      <div>
                         <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Contact Us</h4>
                         <ul className="space-y-4">
                            <li className="flex gap-3">
                                 <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                 <span>123 Legal Avenue, Suite 100<br/>New York, NY 10001</span>
                            </li>
                            <li className="flex gap-3">
                                 <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                 <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex gap-3">
                                 <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                 <span>contact@lexpartners.com</span>
                            </li>
                         </ul>
                     </div>
                </div>

                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-slate-500">
                        &copy; 2024 Lex & Partners. All rights reserved.
                    </div>
                    <div className="flex gap-6 text-slate-500 text-xs">
                        <a href="#" className="hover:text-slate-300">Privacy Policy</a>
                        <a href="#" className="hover:text-slate-300">Terms of Service</a>
                    </div>
                </div>
                <div className="mt-8 text-center text-xs text-slate-600">
                    Attorney Advertising. Prior results do not guarantee a similar outcome.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
