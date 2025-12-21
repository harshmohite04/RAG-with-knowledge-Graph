import React from 'react';

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

const ShieldExclamationIcon = () => (
   <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
  </svg>
)

const DocumentTextIcon = () => (
    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
)

const Services: React.FC = () => {
    const services = [
        {
            title: 'Corporate Law',
            description: 'Expert guidance on mergers, acquisitions, and compliance for businesses of all sizes.',
            icon: <BriefcaseIcon />,
        },
        {
            title: 'Family Law',
            description: 'Compassionate support for divorce, custody, and adoption proceedings.',
            icon: <UserGroupIcon />,
        },
        {
            title: 'Criminal Defense',
            description: 'Aggressive defense strategies to protect your rights against all criminal charges.',
            icon: <ShieldExclamationIcon />,
        },
        {
            title: 'Estate Planning',
            description: 'Secure your legacy with comprehensive wills, trusts, and estate management.',
            icon: <DocumentTextIcon />,
        },
    ];

    return (
        <section id="practices" className="py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                     <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Specialized Legal Services</h2>
                     <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <p className="text-lg text-slate-600 max-w-2xl">
                            We offer comprehensive legal support across multiple disciplines, tailored to your unique situation.
                        </p>
                        <a href="#" className="hidden md:flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                            View All Areas <span className="ml-1">+</span>
                        </a>
                     </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, index) => (
                        <div key={index} className="bg-white p-8 rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                                <div className="group-hover:text-white transition-colors duration-300">
                                    {service.icon}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                            <p className="text-slate-600 leading-relaxed text-sm">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-8 md:hidden text-center">
                    <a href="#" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                         View All Areas <span className="ml-1">+</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Services;
