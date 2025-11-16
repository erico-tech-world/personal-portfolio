import React from 'react';

interface SectionProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ id, children, className = '' }) => (
    <section id={id} className={`py-20 md:py-32 relative overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.35)] ${className}`}>
        <div className="container mx-auto px-6 relative z-10">
            {children}
        </div>
    </section>
);

export default Section;
