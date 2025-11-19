import React from 'react';
import Section from '@/components/shared/Section';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';

// Helper function to render paragraphs from text with newlines
const renderParagraphs = (text: string) => {
    return text.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
        <p key={index} className="text-light-gray mb-4">
            {paragraph}
        </p>
    ));
};

async function About() {
    const supabase = createClient();
    let aboutContent = `I am a Product Designer, Video and Picture Editor, Writer, Junior Developer and lots more. Throughout my career, I have honed my skills in both print and digital designs, consistently delivering high-quality results that exceed client expectations.

I have a keen eye for detail and a creative mindset that allows me to bring unique and innovative ideas to the table. Whether it’s designing a brand logo, creating a website layout, or developing a branding strategy, I am always up for the challenge or task.

I look forward to the opportunity to discuss how my background, skills, and enthusiasm for creativity and design can contribute to your company's success.`; // Fallback content
    let cvUrl = '/ike-chidalu-promise-cv.pdf'; // Fallback CV URL
    let previewUrl = 'https://picsum.photos/seed/hey/300/400'; // Fallback preview URL

    try {
        const { data } = await supabase
            .from('site_content')
            .select('content_key, content_value');
        
        const aboutMeData = data?.find(item => item.content_key === 'about_me');
        if (aboutMeData) {
            aboutContent = aboutMeData.content_value || aboutContent;
        }

        const cvUrlData = data?.find(item => item.content_key === 'cv_url');
        if (cvUrlData) {
            cvUrl = cvUrlData.content_value || cvUrl;
        }

        const previewUrlData = data?.find(item => item.content_key === 'cv_preview_url');
        if (previewUrlData) {
            previewUrl = previewUrlData.content_value || previewUrl;
        }

    } catch (error) {
        console.error("Failed to fetch 'About Me' content:", error);
    }

    return (
        <Section id="about" className="bg-navy-dark overflow-hidden">
            {/* Decorative Shapes (Green Cubes/Squares) */}
            <div className="absolute top-[15%] left-[5%] w-10 h-10 bg-accent-green opacity-20 rounded-md animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-[50%] right-[8%] w-16 h-16 bg-accent-green opacity-20 rounded-md animate-float" style={{ animationDelay: '3s' }}></div>
            <div className="absolute bottom-[10%] left-[20%] w-8 h-8 bg-accent-green opacity-15 rounded-md animate-float" style={{ animationDelay: '5s' }}></div>
            <div className="absolute bottom-[5%] right-[25%] w-12 h-12 bg-accent-green opacity-20 rounded-md transform rotate-45 animate-float" style={{ animationDelay: '2s' }}></div>

            <div className="container mx-auto px-4 pt-0 pb-16">
                <div className="grid md:grid-cols-12 gap-8 items-start">
                    <div className="md:col-span-7 md:ml-16">
                        <h2 className="text-5xl font-black text-white mb-6">
                            About <span className="text-accent-cyan">Me</span>
                        </h2>
                        <div className="prose prose-invert max-w-none">
                            {renderParagraphs(aboutContent)}
                        </div>
                    </div>
                    <div className="md:col-span-5">
                        <div className="relative mx-auto flex flex-col items-center">
                            <div className="absolute top-[100px] w-[320px] h-[200px] border-1 border-accent-green rounded-sm transform rotate-3 shadow-[0_0_2px_rgba(5,255,0,1)] left-1/2 -translate-x-1/2"></div>
                            <div className="relative z-10">
                                <Image src={previewUrl} alt="Bio image" className="rounded-lg" width={300} height={400} priority style={{ width: 'auto', height: 'auto' }} />
                            </div>
                            <div>
                                <a href={cvUrl} download className="inline-block bg-accent-cyan text-navy-dark font-bold py-3 px-8 rounded-lg hover:bg-white transition-all duration-300 transform hover:scale-105">
                                    Download CV
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default About;
