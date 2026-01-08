import React from 'react';

// Icons
const ShieldCheckIcon = () => (
    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
)


const TrophyRealIcon = () => (
     <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
)


const HeartIcon = () => (
    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
)


const WhyChooseUs: React.FC = () => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    
                    {/* Image Side */}
                    <div className="relative order-2 lg:order-1">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[500px]">
                            <img 
                                src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1974" 
                                alt="Staircase in courthouse" 
                                className="object-cover w-full h-full"
                            />
                            
                            {/* Quote Overlay */}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-8 pt-24 text-white">
                                <blockquote className="font-serif text-xl sm:text-2xl italic leading-relaxed mb-4">
                                    "Justice consists not in being neutral between right and wrong, but in finding out the right and upholding it."
                                </blockquote>
                                <cite className="text-sm font-semibold tracking-wider uppercase not-italic text-slate-300">
                                    — Theodore Roosevelt
                                </cite>
                            </div>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="order-1 lg:order-2">
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                            Why Choose Lex & Partners?
                        </h2>
                        <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                            We bring a unique combination of deep legal expertise and a personal commitment to every client's well-being.
                        </p>

                        <div className="space-y-8">
                            
                            {/* Feature 1 */}
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mt-1">
                                    <ShieldCheckIcon />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">Unwavering Integrity</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        We operate with complete transparency and ethical standards in every case we handle.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mt-1">
                                    <TrophyRealIcon />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">Proven Track Record</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        Our history of successful settlements and verdicts speaks for itself.
                                    </p>
                                </div>
                            </div>

                             {/* Feature 3 */}
                             <div className="flex gap-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mt-1">
                                    <HeartIcon />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">Client-Centric Approach</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        You are not just a case number. We provide personalized attention to your unique needs.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
