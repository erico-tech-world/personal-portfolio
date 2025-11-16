'use client';
import { useState, useEffect, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import { updateAboutContent, updateCv } from '@/app/actions';
import Image from 'next/image';

export default function AboutAdmin() {
    const [content, setContent] = useState('');
    const [cvUrl, setCvUrl] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
    const [cvStatus, setCvStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
    const [isPending, startTransition] = useTransition();
    const [isCvPending, startCvTransition] = useTransition();

    useEffect(() => {
        const fetchContent = async () => {
            const supabase = createClient();
            setLoading(true);
            const { data } = await supabase
                .from('site_content')
                .select('content_key, content_value');
            
            const aboutMe = data?.find(item => item.content_key === 'about_me')?.content_value || '';
            const cv = data?.find(item => item.content_key === 'cv_url')?.content_value || '';
            const preview = data?.find(item => item.content_key === 'cv_preview_url')?.content_value || '';

            setContent(aboutMe);
            setCvUrl(cv);
            setPreviewUrl(preview);
            setLoading(false);
        };
        fetchContent();
    }, []);

    const handleAboutSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('saving');
        startTransition(async () => {
            const result = await updateAboutContent(content);
            if (result.success) {
                setStatus('success');
            } else {
                setStatus('error');
                alert(result.error);
            }
            setTimeout(() => setStatus('idle'), 3000);
        });
    }

    const handleCvSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setCvStatus('saving');
        const formData = new FormData(e.currentTarget);
        startCvTransition(async () => {
            const result = await updateCv(formData);
            if (result.success) {
                setCvStatus('success');
                // Refresh content
                const supabase = createClient();
                const { data } = await supabase.from('site_content').select('content_key, content_value');
                const newCv = data?.find(item => item.content_key === 'cv_url')?.content_value || '';
                const newPreview = data?.find(item => item.content_key === 'cv_preview_url')?.content_value || '';
                setCvUrl(newCv);
                setPreviewUrl(newPreview);
            } else {
                setCvStatus('error');
                alert(result.error);
            }
            setTimeout(() => setCvStatus('idle'), 3000);
        });
    }

    return (
        <div className="bg-navy-medium p-6 rounded-lg">
            <h2 className="text-3xl font-bold mb-6">Manage "About Me" Content</h2>
            <form onSubmit={handleAboutSubmit}>
                <textarea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={10}
                    className="w-full bg-navy-dark p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-cyan disabled:opacity-50"
                    placeholder="Enter your 'About Me' text here. Use empty lines to create new paragraphs."
                    disabled={loading || isPending}
                />
                <div className="mt-4 flex items-center gap-4">
                    <button type="submit" disabled={loading || isPending} className="bg-accent-green text-white font-bold py-2 px-6 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50">
                        {isPending ? 'Saving...' : 'Save Content'}
                    </button>
                    {status === 'success' && <p className="text-accent-green">Content updated successfully!</p>}
                    {status === 'error' && <p className="text-red-500">Failed to update content.</p>}
                </div>
            </form>

            <hr className="my-8 border-navy-light" />

            <h2 className="text-3xl font-bold mb-6">Manage CV</h2>
            <div className="grid md:grid-cols-2 gap-8 items-start">
                <form onSubmit={handleCvSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="cv" className="block text-lg font-medium mb-2">CV/Resume File</label>
                            <input type="file" name="cv" id="cv" required className="w-full bg-navy-dark p-3 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-accent-cyan file:text-navy-dark hover:file:bg-white" />
                        </div>
                        <div>
                            <label htmlFor="preview" className="block text-lg font-medium mb-2">Preview Image</label>
                            <input type="file" name="preview" id="preview" accept="image/*" required className="w-full bg-navy-dark p-3 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-accent-cyan file:text-navy-dark hover:file:bg-white" />
                        </div>
                    </div>
                    <div className="mt-6 flex items-center gap-4">
                        <button type="submit" disabled={isCvPending} className="bg-accent-green text-white font-bold py-2 px-6 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50">
                            {isCvPending ? 'Uploading...' : 'Upload CV'}
                        </button>
                        {cvStatus === 'success' && <p className="text-accent-green">CV updated successfully!</p>}
                        {cvStatus === 'error' && <p className="text-red-500">Failed to update CV.</p>}
                    </div>
                </form>
                <div>
                    <h3 className="text-2xl font-bold mb-4">Current Preview</h3>
                    {loading ? <p>Loading...</p> : (
                        previewUrl ? (
                            <Image src={previewUrl} alt="CV Preview" width={300} height={400} className="rounded-lg shadow-xl" />
                        ) : (
                            <p className="text-light-gray">No preview image uploaded.</p>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
