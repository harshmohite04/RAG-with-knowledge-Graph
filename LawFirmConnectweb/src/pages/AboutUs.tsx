import React from 'react';

// Icons
const ScaleIcon = () => (
    <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
)

const TrophyIcon = () => (
    <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
)

const HeartIcon = () => (
    <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
)




const AboutUs: React.FC = () => {
    return (
        <div className="bg-white min-h-screen">
            
            {/* Hero Section */}
            <section className="relative h-[400px] md:h-[500px]">
                <div className="absolute inset-0">
                    <img 
                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2301" 
                        alt="Law Firm Office" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-blue-900/80 mix-blend-multiply"></div>
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center text-center items-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6">
                        A Legacy of Legal <br/> Excellence
                    </h1>
                    <p className="text-blue-100 text-lg md:text-xl max-w-2xl font-light">
                        Since 1998, we have provided unwavering advocacy and strategic counsel to individuals and businesses alike.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="grid md:grid-cols-2 gap-12 items-start">
                         <div>
                             <div className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-2">Our Mission</div>
                             <h2 className="text-3xl font-bold text-slate-900 leading-tight">
                                 Dedicated to Justice, Driven by Results.
                             </h2>
                         </div>
                         <div>
                             <p className="text-slate-600 text-lg leading-relaxed">
                                 We believe that everyone deserves high-quality legal representation. Our mission is to navigate the complexities of the law so our clients can focus on their future. We approach every case with integrity, preparation, and a relentless drive to win.
                             </p>
                         </div>
                     </div>

                     {/* Values Cards */}
                     <div className="grid md:grid-cols-3 gap-8 mt-16">
                         {[
                             { title: 'Integrity', icon: <ScaleIcon />, desc: 'Upholding the highest ethical standards in every case. We believe in total transparency with our clients.' },
                             { title: 'Excellence', icon: <TrophyIcon />, desc: 'Striving for the best possible outcome through rigorous preparation and expert knowledge.' },
                             { title: 'Client-Centric', icon: <HeartIcon />, desc: 'Putting your needs and goals at the center of our strategy. We listen first, then we act.' },
                         ].map((value, idx) => (
                             <div key={idx} className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                 <div className="mb-6 bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center">
                                    {value.icon}
                                 </div>
                                 <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                                 <p className="text-slate-500 leading-relaxed text-sm">
                                     {value.desc}
                                 </p>
                             </div>
                         ))}
                     </div>
                </div>
            </section>

            {/* Stats Banner */}
            <section className="py-16 bg-blue-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-blue-500/50">
                        <div>
                            <div className="text-4xl md:text-5xl font-extrabold mb-2">25+</div>
                            <div className="text-blue-200 text-sm font-medium uppercase tracking-wider">Years of Experience</div>
                        </div>
                        <div>
                             <div className="text-4xl md:text-5xl font-extrabold mb-2">$50M+</div>
                             <div className="text-blue-200 text-sm font-medium uppercase tracking-wider">Recovered for Clients</div>
                        </div>
                        <div>
                             <div className="text-4xl md:text-5xl font-extrabold mb-2">2k+</div>
                             <div className="text-blue-200 text-sm font-medium uppercase tracking-wider">Cases Won</div>
                        </div>
                         <div>
                             <div className="text-4xl md:text-5xl font-extrabold mb-2">15</div>
                             <div className="text-blue-200 text-sm font-medium uppercase tracking-wider">Expert Attorneys</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* History Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1">
                             <div className="relative">
                                 <h2 className="text-3xl font-bold text-slate-900 mb-12">Our History</h2>
                                 
                                 <div className="space-y-12 border-l-2 border-slate-100 pl-8 ml-4 relative">
                                     
                                     {/* Timeline Item 1 */}
                                     <div className="relative">
                                         <div className="absolute -left-[41px] top-0 w-5 h-5 bg-blue-100 rounded-full border-4 border-white flex items-center justify-center">
                                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                         </div>
                                         <div className="text-blue-600 font-bold text-sm mb-1 uppercase tracking-wider">1998</div>
                                         <h3 className="text-xl font-bold text-slate-900 mb-2">Firm Founded</h3>
                                         <p className="text-slate-600 text-sm leading-relaxed">
                                             Founded by Eleanor Rigby and John Smith with a focus on civil rights and personal injury, starting in a small downtown office.
                                         </p>
                                     </div>

                                      {/* Timeline Item 2 */}
                                      <div className="relative">
                                         <div className="absolute -left-[41px] top-0 w-5 h-5 bg-blue-100 rounded-full border-4 border-white flex items-center justify-center">
                                               <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                         </div>
                                         <div className="text-blue-600 font-bold text-sm mb-1 uppercase tracking-wider">2010</div>
                                         <h3 className="text-xl font-bold text-slate-900 mb-2">Major Expansion</h3>
                                         <p className="text-slate-600 text-sm leading-relaxed">
                                             Expanded practice areas to include Corporate Law and Intellectual Property, moving to our current headquarters.
                                         </p>
                                     </div>

                                      {/* Timeline Item 3 */}
                                      <div className="relative">
                                         <div className="absolute -left-[41px] top-0 w-5 h-5 bg-blue-100 rounded-full border-4 border-white flex items-center justify-center">
                                               <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                         </div>
                                         <div className="text-blue-600 font-bold text-sm mb-1 uppercase tracking-wider">2023</div>
                                         <h3 className="text-xl font-bold text-slate-900 mb-2">Firm of the Year</h3>
                                         <p className="text-slate-600 text-sm leading-relaxed">
                                             Recognized as the "Top Legal Firm" in the state for our outstanding commitment to pro bono work and client satisfaction.
                                         </p>
                                     </div>

                                 </div>
                             </div>
                        </div>

                        {/* Image */}
                         <div className="order-1 lg:order-2">
                            <div className="rounded-2xl overflow-hidden shadow-2xl h-[400px] lg:h-[500px]">
                                <img 
                                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070" 
                                    alt="Historic Courthouse" 
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

             {/* Team Section */}
             <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Meet Our Attorneys</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto mb-16">
                        Our team brings decades of combined experience across various practice areas. We are passionate about the law and compassionate towards our clients.
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                         {[
                             { name: 'James Sterling', role: 'Managing Partner', img: 'https://randomuser.me/api/portraits/men/32.jpg' },
                             { name: 'Sarah Jenkins', role: 'Senior Associate', img: 'https://randomuser.me/api/portraits/women/44.jpg' },
                             { name: 'Michael Ross', role: 'Associate', img: 'https://randomuser.me/api/portraits/men/86.jpg' },
                             { name: 'Emily Chen', role: 'Junior Associate', img: 'https://randomuser.me/api/portraits/women/65.jpg' },
                         ].map((member, idx) => (
                             <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all text-left group">
                                 <div className="h-64 overflow-hidden">
                                     <img src={member.img} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                 </div>
                                 <div className="p-6">
                                     <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
                                     <div className="text-blue-600 text-sm font-medium mb-4">{member.role}</div>
                                     <p className="text-slate-500 text-xs leading-relaxed mb-4">
                                         Specializing in complex litigation and corporate law. Dedicated to achieving the best results for clients.
                                     </p>
                                     <a href="#" className="text-blue-600 text-xs font-bold uppercase tracking-wider flex items-center hover:text-blue-800">
                                         View Profile <span className="ml-1">→</span>
                                     </a>
                                 </div>
                             </div>
                         ))}
                    </div>
                </div>
             </section>

             {/* Bottom CTA */}
             <section className="py-16 mx-4">
                 <div className="max-w-7xl mx-auto bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-12 text-center shadow-sm">
                     <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Ready to discuss your case?</h2>
                     <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
                         Schedule a free, confidential consultation with one of our expert attorneys today. We are here to listen and help.
                     </p>
                     
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
                         <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                             <span className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                             Top Rated
                         </div>
                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                             <span className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                             No Win No Fee
                         </div>
                     </div>

                     <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                         Schedule Consultation
                     </button>
                 </div>
             </section>

        </div>
    );
};

export default AboutUs;
