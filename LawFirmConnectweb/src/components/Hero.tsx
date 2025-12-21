import React from 'react';

const CheckIcon = () => (
    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const TrendIcon = () => (
     <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
)

const Hero: React.FC = () => {
    return (
        <section className="relative bg-white pt-10 pb-20 lg:pt-16 lg:pb-28 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    {/* Left Content */}
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6">
                             <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
                             <span className="text-xs font-semibold text-blue-700 tracking-wide uppercase">Trusted Since 1995</span>
                        </div>
                        
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.15] mb-6 tracking-tight">
                            Defending Your <br/>
                            Rights with Integrity
                        </h1>
                        
                        <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
                            Top-tier legal representation for complex litigation, corporate law, and personal matters. We fight for the justice you deserve.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 mb-10">
                            <button className="px-7 py-3.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 text-center">
                                Get Legal Help
                            </button>
                            <button className="px-7 py-3.5 bg-white text-slate-700 border border-slate-200 font-semibold rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all text-center">
                                Learn More
                            </button>
                        </div>

                         <div className="flex flex-col sm:flex-row sm:items-center gap-6 text-sm font-medium text-slate-600">
                            <div className="flex items-center">
                                <span className="bg-blue-100 rounded-full p-0.5 mr-2"><CheckIcon /></span>
                                Free Initial Consultation
                            </div>
                            <div className="flex items-center">
                                <span className="bg-blue-100 rounded-full p-0.5 mr-2"><CheckIcon /></span>
                                No Win, No Fee
                            </div>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="relative lg:ml-auto w-full max-w-lg lg:max-w-none">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-slate-200 aspect-[4/3] lg:aspect-auto lg:h-[600px]">
                            <img 
                                src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=1974" 
                                alt="Legal Team Meeting" 
                                className="object-cover w-full h-full"
                            />
                            
                             {/* Floating Card */}
                            <div className="absolute bottom-6 left-6 right-6 sm:right-auto bg-white/95 backdrop-blur-sm p-5 rounded-xl shadow-lg border border-slate-100 max-w-xs animate-fade-in-up">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                                        <TrendIcon />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-slate-900">98%</div>
                                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Case Success Rate</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decor elements */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50 z-[-1]"></div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-100 rounded-full blur-3xl opacity-50 z-[-1]"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
