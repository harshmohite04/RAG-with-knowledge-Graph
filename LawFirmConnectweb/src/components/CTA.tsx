import React from 'react';

const CTA: React.FC = () => {
    return (
        <section className="py-20 bg-blue-600">
             <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                    Ready to Discuss Your Case?
                </h2>
                <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                    Schedule your free initial consultation today. Our team is ready to listen and provide the guidance you need.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button className="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        Book Free Consultation
                    </button>
                    <button className="px-8 py-4 bg-transparent border-2 border-blue-400 text-white font-bold rounded-lg hover:bg-blue-700 hover:border-blue-700 transition-colors">
                        Call (555) 123-4567
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CTA;
