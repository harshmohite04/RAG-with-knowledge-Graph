import React from 'react';

const Stats: React.FC = () => {
  const stats = [
    { value: '25+', label: 'Years of Experience' },
    { value: '1k+', label: 'Cases Won' },
    { value: '50+', label: 'Expert Attorneys' },
    { value: '24/7', label: 'Client Support' },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x-0 md:divide-x divide-slate-100">
          {stats.map((stat, index) => (
            <div key={index} className="p-4 group">
              <div className="text-4xl lg:text-5xl font-extrabold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
