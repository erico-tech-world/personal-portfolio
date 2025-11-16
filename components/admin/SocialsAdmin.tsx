'use client';
import { useState, useEffect, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { SocialLink } from '@/types/index';
import Spinner from '@/components/shared/Spinner';

// Assume these actions will be created in app/actions.ts
// import { addSocialLink, updateSocialLink, deleteSocialLink } from '@/app/actions';

export default function SocialsAdmin() {
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
    const [isPending, startTransition] = useTransition();

    const [formData, setFormData] = useState({
        id: null as number | null,
        platform: '',
        url: '',
    });

    useEffect(() => {
        const fetchSocials = async () => {
            setLoading(true);
            const supabase = createClient();
            const { data } = await supabase.from('social_links').select('*').order('platform');
            setSocialLinks(data || []);
            setLoading(false);
        };
        fetchSocials();
    }, []);

    useEffect(() => {
        if (editingLink) {
            setFormData({
                id: editingLink.id,
                platform: editingLink.platform,
                url: editingLink.url,
            });
        } else {
            setFormData({ id: null, platform: '', url: '' });
        }
    }, [editingLink]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const linkData = {
            platform: formData.platform,
            url: formData.url,
        };

        startTransition(async () => {
            const supabase = createClient();
            if (editingLink) {
                const { data, error } = await supabase.from('social_links').update(linkData).eq('id', editingLink.id).select();
                if (data) {
                    setSocialLinks(prev => prev.map(l => l.id === editingLink.id ? data[0] : l));
                    setEditingLink(null);
                } else {
                    alert(error?.message);
                }
            } else {
                const { data, error } = await supabase.from('social_links').insert([linkData]).select();
                if (data) {
                    setSocialLinks(prev => [...prev, data[0]]);
                    setEditingLink(null);
                } else {
                    alert(error?.message);
                }
            }
        });
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this social link?')) {
            startTransition(async () => {
                const supabase = createClient();
                const { error } = await supabase.from('social_links').delete().eq('id', id);
                if (!error) {
                    setSocialLinks(prev => prev.filter(l => l.id !== id));
                } else {
                    alert(error.message);
                }
            });
        }
    };

    return (
        <div className="relative bg-navy-medium p-6 rounded-lg mt-12">
            {isPending && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg z-10">
                    <Spinner size="h-12 w-12" />
                </div>
            )}
            <h2 className="text-3xl font-bold mb-6">Manage Social Links</h2>

            {/* Add/Edit Form */}
            <div className="bg-navy-dark p-6 rounded-lg mb-12">
                <h3 className="text-2xl font-bold mb-4">{editingLink ? 'Edit Social Link' : 'Add New Social Link'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="platform" className="block mb-2">Platform</label>
                            <input type="text" name="platform" id="platform" required value={formData.platform} onChange={handleInputChange} placeholder="e.g., Pinterest" className="w-full bg-navy-medium p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-cyan" />
                        </div>
                        <div>
                            <label htmlFor="url" className="block mb-2">URL</label>
                            <input type="url" name="url" id="url" required value={formData.url} onChange={handleInputChange} placeholder="https://..." className="w-full bg-navy-medium p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-cyan" />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button type="submit" disabled={isPending} className="bg-accent-blue text-white font-bold py-2 px-6 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50">
                            {isPending ? 'Saving...' : (editingLink ? 'Save Changes' : 'Add Link')}
                        </button>
                        {editingLink && (
                            <button type="button" onClick={() => setEditingLink(null)} className="bg-medium-gray text-white font-bold py-2 px-6 rounded-md hover:bg-gray-600 transition-colors">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Existing Links Table */}
            <div className="overflow-x-auto">
                <h3 className="text-2xl font-bold mb-4">Existing Links</h3>
                {loading ? (
                    <div className="flex justify-center p-8"><Spinner size="h-16 w-16" /></div>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-600">
                                <th className="p-3">Platform</th>
                                <th className="p-3">URL</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {socialLinks.map((link) => (
                                <tr key={link.id} className="border-b border-gray-700">
                                    <td className="p-3">{link.platform}</td>
                                    <td className="p-3 truncate max-w-xs">{link.url}</td>
                                    <td className="p-3 text-right">
                                        <button onClick={() => setEditingLink(link)} className="bg-accent-amber text-white font-bold py-1 px-4 rounded-md hover:bg-amber-600 transition-colors mr-2">Edit</button>
                                        <button onClick={() => handleDelete(link.id)} disabled={isPending} className="bg-red-500 text-white font-bold py-1 px-4 rounded-md hover:bg-red-600 transition-colors disabled:opacity-50">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
