'use client';

import React, { useState, useEffect } from 'react';
import Section from '@/components/shared/Section';
import { Icons } from '@/components/shared/Icons';
import ContactForm from './ContactForm';
import { createClient } from '@/lib/supabase/client';
import type { SocialLink } from '@/types/index';

const SocialIconsCircle = () => {
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLinks = async () => {
            const supabase = createClient();
            const { data, error } = await supabase.from('social_links').select('*');
            if (data) {
                // Add hardcoded icons for now until they are also in the DB
                const dbLinks = data.map(d => ({...d, platform: d.platform.toLowerCase()}));
                const hardcodedLinks = [
                    { id: 995, platform: 'whatsapp', url: '#' },
                    { id: 996, platform: 'x', url: '#' },
                    { id: 997, platform: 'tiktok', url: '#' },
                    { id: 998, platform: 'linkedin', url: '#' },
                    { id: 999, platform: 'instagram', url: '#' },
                ];
                const allLinks = [...dbLinks, ...hardcodedLinks.filter(hl => !dbLinks.some(dl => dl.platform === hl.platform))];
                setSocialLinks(allLinks);
            }
            setLoading(false);
        };
        fetchLinks();
    }, []);

    const iconMap: { [key: string]: React.ComponentType<any> } = {
        whatsapp: Icons.whatsApp,
        x: Icons.x,
        tiktok: Icons.tikTok,
        linkedin: Icons.linkedIn,
        instagram: Icons.instagram,
        pinterest: Icons.pinterest,
        upwork: Icons.upwork,
        youtube: Icons.youtube,
    };

    const radius = 100; // Radius of the circle in pixels
    const numIcons = socialLinks.length;

    return (
        <div className="relative w-64 h-64 flex items-center justify-center">
            {loading ? (
                <p>Loading...</p>
            ) : (
                socialLinks.map((link, i) => {
                    const angle = (i / numIcons) * 2 * Math.PI - Math.PI / 2; // Start from top
                    const x = radius * Math.cos(angle);
                    const y = radius * Math.sin(angle);
                    const IconComponent = iconMap[link.platform.toLowerCase()];

                    return (
                        <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={link.platform}
                            className="absolute top-1/2 left-1/2 transition-transform duration-300 hover:scale-125"
                            style={{
                                transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                            }}
                        >
                            {IconComponent ? <IconComponent /> : null}
                        </a>
                    );
                })
            )}
        </div>
    );
};


const Contact: React.FC = () => {
    return (
        <Section id="contact">
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent-cyan opacity-10 rounded-lg transform rotate-45"></div>
            <h2 className="text-5xl font-black text-white mb-2 text-center">Contact Me</h2>
            <p className="text-center text-light-gray mb-12">Tell me what you want</p>
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                <ContactForm />
                <div className="flex flex-col items-center justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <SocialIconsCircle />
                </div>
            </div>
        </Section>
    );
};

export default Contact;
