import React, { useState } from 'react';

// Icons
const BriefcaseIcon = () => (
  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const UserGroupIcon = () => (
  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);
const HomeIcon = () => (
    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
)
const LightBulbIcon = () => (
    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
)
const GavelIcon = () => (
    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
    </svg> // Approximate Gavel/Hammer
)
const BriefcaseIcon2 = () => (
  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
)
const HeartIcon = () => (
    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
)
const ScaleIcon = () => (
     <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
) // Using Scale for Tax/Finance usually or Bank
const TruckIcon = () => (
     <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 012-2h5a2 2 0 012 2m0 0h2a2 2 0 012 2v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a2 2 0 012-2z" />
    </svg>
)


const PracticeAreas: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All Areas');

    const filters = ['All Areas', 'Corporate', 'Personal', 'Litigation', 'Real Estate'];

    const practices = [
        {
            title: 'Corporate Law',
            category: 'Corporate',
            description: 'Expert guidance on mergers, acquisitions, and corporate governance to ensure your business thrives.',
            icon: <BriefcaseIcon />,
        },
        {
            title: 'Family Law',
            category: 'Personal',
            description: 'Compassionate legal support for divorce, child custody, and estate planning, focused on protecting your loved ones.',
            icon: <UserGroupIcon />,
        },
        {
            title: 'Real Estate',
            category: 'Real Estate',
            description: 'Comprehensive resolution strategies for commercial and residential property disputes, zoning issues, and closings.',
            icon: <HomeIcon />,
        },
        {
            title: 'Intellectual Property',
            category: 'Corporate',
            description: 'Protecting your innovative ideas and brands through strategic patent, copyright, and trademark filing and defense.',
            icon: <LightBulbIcon />,
        },
        {
            title: 'Litigation',
            category: 'Litigation',
            description: 'Aggressive and expert representation in civil and commercial dispute resolutions, from mediation to courtroom trials.',
            icon: <GavelIcon />,
        },
        {
            title: 'Employment Law',
            category: 'Corporate',
            description: 'Navigating complex workplace regulations, including discrimination claims, contract reviews, and compliance.',
            icon: <BriefcaseIcon2 />,
        },
        {
            title: 'Medical Malpractice',
            category: 'Personal',
            description: 'Representing victims of medical negligence and fighting for fair compensation for injuries and long-term care needs.',
            icon: <HeartIcon />,
        },
        {
            title: 'Tax Law',
            category: 'Corporate',
            description: 'Strategic advice on tax planning, dispute resolution with tax authorities, and corporate tax structuring.',
            icon: <ScaleIcon />,
        },
        {
            title: 'Immigration',
            category: 'Personal',
            description: 'Guiding individuals and businesses through visa applications, residency processes, and citizenship requirements.',
            icon: <TruckIcon />,
        },
    ];

    const filteredPractices = practices.filter(practice => {
        const matchesSearch = practice.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              practice.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = activeFilter === 'All Areas' || practice.category === activeFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Header Section */}
            <section className="bg-slate-50 pt-16 pb-12 text-center px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        Comprehensive Legal Solutions
                    </h1>
                    <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                        Our firm specializes in a wide range of legal disciplines. Browse our practice areas below to find the dedicated expertise your case deserves.
                    </p>
                </div>
            </section>

            {/* Sticky Search & Filter Bar */}
            <div className="sticky top-20 z-40 bg-white border-y border-slate-200 py-4 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        
                        {/* Search Input */}
                        <div className="relative w-full max-w-md">
                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input 
                                type="text"
                                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors sm:text-sm"
                                placeholder="Search for a specific legal service..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-2 justify-center">
                            {filters.map(filter => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                                        activeFilter === filter 
                                            ? 'bg-slate-900 text-white' 
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>

                     </div>
                </div>
            </div>

            {/* Cards Grid */}
            <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPractices.map((practice, index) => (
                        <div key={index} className="bg-white p-8 rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300 group flex flex-col h-full">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                {practice.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{practice.title}</h3>
                            <p className="text-slate-600 leading-relaxed text-sm mb-6 flex-grow">
                                {practice.description}
                            </p>
                            <a href="#" className="inline-flex items-center text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors">
                                Learn More <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                            </a>
                        </div>
                    ))}
                    {filteredPractices.length === 0 && (
                        <div className="col-span-full text-center py-20 text-slate-500">
                            No practice areas found matching your criteria.
                        </div>
                    )}
                </div>
            </section>

             {/* Bottom CTA */}
             <section className="mt-12 mx-4 mb-20">
                 <div className="max-w-7xl mx-auto bg-blue-600 rounded-3xl p-8 md:p-12 text-center md:text-left shadow-xl shadow-blue-900/20 relative overflow-hidden">
                     <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                         <div>
                             <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Need legal advice?</h2>
                             <p className="text-blue-100 text-lg max-w-xl">
                                 Schedule a consultation with one of our specialized attorneys today and find out how we can help you navigate your legal challenges.
                             </p>
                         </div>
                         <div className="flex gap-4 flex-shrink-0">
                             <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors shadow-lg">
                                 Schedule Consultation
                             </button>
                             <button className="bg-blue-700 text-white border border-blue-500 px-6 py-3 rounded-lg font-bold hover:bg-blue-800 transition-colors">
                                 Contact Us
                             </button>
                         </div>
                     </div>
                     
                     {/* Decor */}
                     <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                     <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
                 </div>
             </section>

        </div>
    );
};

export default PracticeAreas;
