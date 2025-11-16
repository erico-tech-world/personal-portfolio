'use client';
import React, { useState, useRef } from 'react';

const ContactForm = () => {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('submitting');
        const formData = new FormData(e.currentTarget);
        
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                body: JSON.stringify({
                    name: formData.get('name'),
                    email: formData.get('email'),
                    message: formData.get('message'),
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setStatus('success');
                formRef.current?.reset();
                setTimeout(() => setStatus('idle'), 3000); // Reset status after 3 seconds
            } else {
                setStatus('error');
                 setTimeout(() => setStatus('idle'), 3000);
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
             setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="animate-fade-in-up space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <input type="text" name="name" placeholder="Your Name" className="w-full bg-navy-medium p-4 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-cyan border border-gray-600" required />
                <input type="email" name="email" placeholder="Your Email" className="w-full bg-navy-medium p-4 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-cyan border border-gray-600" required />
            </div>
             <div className="mb-6">
                <textarea name="message" placeholder="Tell me what you want..." rows={5} className="w-full bg-navy-medium p-4 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-cyan border border-gray-600" required></textarea>
            </div>
            <button 
                type="submit" 
                className="w-full bg-accent-cyan text-navy-dark font-bold py-3 px-8 rounded-lg hover:bg-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={status === 'submitting'}
            >
                {status === 'submitting' ? 'Sending...' : 'Send Message'}
            </button>
            {status === 'success' && <p className="mt-4 text-accent-green text-center">Message sent successfully!</p>}
            {status === 'error' && <p className="mt-4 text-red-500 text-center">Something went wrong. Please try again.</p>}
        </form>
    );
};

export default ContactForm;