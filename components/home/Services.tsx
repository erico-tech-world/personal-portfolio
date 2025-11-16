import { createClient } from '@/lib/supabase/server';
import type { Service } from '@/types/index';
import ServicesSlider from './ServicesSlider';
import Section from '@/components/shared/Section';

async function Services() {
    const supabase = createClient();
    const { data: services, error } = await supabase
        .from('services')
        .select('*')
        .order('id', { ascending: true });

    if (error || !services) {
        // You can add a fallback or error message here
        return <Section id="services" className="bg-navy-medium"><p className="text-center">Could not load services.</p></Section>;
    }

    return (
        <Section id="services" className="bg-navy-dark">
            <h2 className="text-5xl font-black text-white mb-12 text-center">My Services</h2>
            <ServicesSlider services={services} />
        </Section>
    );
};

export default Services;