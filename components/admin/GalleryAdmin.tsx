'use client';
import { useState, useEffect, useTransition, useRef } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import type { GalleryItem } from '@/types/index';
import { addGalleryItem, updateGalleryItem, deleteGalleryItem } from '@/app/actions';

export default function GalleryAdmin() {
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
    const [isPending, startTransition] = useTransition();
    const formRef = useRef<HTMLFormElement>(null);
    const editFormRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        const fetchItems = async () => {
            const supabase = createClient();
            setLoading(true);
            const { data } = await supabase.from('gallery_items').select('*').order('id');
            setGalleryItems(data || []);
            setLoading(false);
        };
        fetchItems();
    }, []);
    
    const handleAddSubmit = async (formData: FormData) => {
        startTransition(async () => {
            const result = await addGalleryItem(formData);
            if (result.success && result.newItem) {
                setGalleryItems(prev => [...prev, result.newItem!]);
                formRef.current?.reset();
            } else {
                alert(result.error);
            }
        });
    }
    
    const handleUpdateSubmit = async (formData: FormData) => {
        if (!editingItem) return;
        
        startTransition(async () => {
            const result = await updateGalleryItem(formData);
             if (result.success && result.updatedItem) {
                setGalleryItems(prev => prev.map(item => item.id === result.updatedItem!.id ? result.updatedItem! : item));
                setEditingItem(null);
            } else {
                alert(result.error);
            }
        });
    };

    const handleDelete = async (item: GalleryItem) => {
        if (confirm('Are you sure you want to delete this item?')) {
            startTransition(async () => {
                const result = await deleteGalleryItem(item.id, item.publicId);
                 if (result.success) {
                    setGalleryItems(prev => prev.filter(i => i.id !== item.id));
                } else {
                    alert(result.error);
                }
            });
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Manage Gallery</h2>

            {/* Add New Item Form */}
            <div className="bg-navy-medium p-6 rounded-lg mb-12">
                <h3 className="text-2xl font-bold mb-4">Add New Gallery Item</h3>
                <form ref={formRef} action={handleAddSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="image" className="block mb-2">Image</label>
                        <input type="file" name="image" id="image" required className="w-full" />
                    </div>
                    <div>
                        <label htmlFor="title" className="block mb-2">Title</label>
                        <input type="text" name="title" id="title" placeholder="Project Title" className="w-full bg-navy-dark p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-cyan" />
                    </div>
                    <div>
                        <label htmlFor="category" className="block mb-2">Category</label>
                        <input type="text" name="category" id="category" required placeholder="e.g., Branding, UI/UX" className="w-full bg-navy-dark p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-cyan" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block mb-2">Description</label>
                        <textarea name="description" id="description" rows={3} placeholder="A brief description of the project." className="w-full bg-navy-dark p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-cyan"></textarea>
                    </div>
                    <div>
                        <label htmlFor="project_url" className="block mb-2">Project URL</label>
                        <input type="url" name="project_url" id="project_url" placeholder="https://example.com" className="w-full bg-navy-dark p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-cyan" />
                    </div>
                    <button type="submit" disabled={isPending} className="bg-accent-blue text-white font-bold py-2 px-6 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50">
                        {isPending ? 'Uploading...' : 'Add Item'}
                    </button>
                </form>
            </div>
            
            {/* Edit Item Modal */}
            {editingItem && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-navy-medium p-8 rounded-lg shadow-xl w-full max-w-md">
                        <h3 className="text-2xl font-bold mb-4">Edit Item</h3>
                        <form ref={editFormRef} action={handleUpdateSubmit} className="space-y-4">
                            <input type="hidden" name="id" value={editingItem.id} />
                            <div>
                                <label htmlFor="edit-title" className="block mb-2">Title</label>
                                <input type="text" name="title" id="edit-title" defaultValue={editingItem.title} placeholder="Project Title" className="w-full bg-navy-dark p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-cyan" />
                            </div>
                             <div>
                                <label htmlFor="edit-category" className="block mb-2">Category</label>
                                <input type="text" name="category" id="edit-category" defaultValue={editingItem.category} required className="w-full bg-navy-dark p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-cyan" />
                            </div>
                            <div>
                                <label htmlFor="edit-description" className="block mb-2">Description</label>
                                <textarea name="description" id="edit-description" rows={3} defaultValue={editingItem.description} placeholder="A brief description of the project." className="w-full bg-navy-dark p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-cyan"></textarea>
                            </div>
                            <div>
                                <label htmlFor="edit-project_url" className="block mb-2">Project URL</label>
                                <input type="url" name="project_url" id="edit-project_url" defaultValue={editingItem.project_url} placeholder="https://example.com" className="w-full bg-navy-dark p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-cyan" />
                            </div>
                            <div className="flex justify-end gap-4">
                                <button type="button" onClick={() => setEditingItem(null)} className="bg-medium-gray text-white font-bold py-2 px-6 rounded-md hover:bg-gray-600 transition-colors">Cancel</button>
                                <button type="submit" disabled={isPending} className="bg-accent-green text-white font-bold py-2 px-6 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50">
                                    {isPending ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Existing Items Table */}
            <div className="bg-navy-medium p-6 rounded-lg">
                 <h3 className="text-2xl font-bold mb-4">Existing Items</h3>
                 {loading ? <p>Loading items...</p> : (
                    <>
                        <div className="overflow-x-auto hidden md:block">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-600">
                                        <th className="p-3">Image</th>
                                        <th className="p-3">Title</th>
                                        <th className="p-3">Category</th>
                                        <th className="p-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {galleryItems.map((item) => (
                                        <tr key={item.id} className="border-b border-gray-700">
                                            <td className="p-3">
                                                <Image src={item.imageUrl} alt={item.title || 'Gallery item'} width={80} height={80} className="rounded-md object-cover h-20 w-20" />
                                            </td>
                                            <td className="p-3">{item.title}</td>
                                            <td className="p-3">{item.category}</td>
                                            <td className="p-3 text-right">
                                                <button onClick={() => setEditingItem(item)} className="bg-accent-amber text-white font-bold py-1 px-4 rounded-md hover:bg-amber-600 transition-colors mr-2">Edit</button>
                                                <button onClick={() => handleDelete(item)} disabled={isPending} className="bg-red-500 text-white font-bold py-1 px-4 rounded-md hover:bg-red-600 transition-colors disabled:opacity-50">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
                            {galleryItems.map((item) => (
                                <div key={item.id} className="bg-navy-dark rounded-lg p-4 flex flex-col">
                                    <Image src={item.imageUrl} alt={item.title || 'Gallery item'} width={150} height={150} className="rounded-md object-cover w-full h-40 mb-4" />
                                    <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                                    <p className="text-gray-400 mb-4">{item.category}</p>
                                    <div className="mt-auto flex justify-end gap-2">
                                        <button onClick={() => setEditingItem(item)} className="bg-accent-amber text-white font-bold py-1 px-3 rounded-md hover:bg-amber-600 transition-colors text-sm">Edit</button>
                                        <button onClick={() => handleDelete(item)} disabled={isPending} className="bg-red-500 text-white font-bold py-1 px-3 rounded-md hover:bg-red-600 transition-colors text-sm disabled:opacity-50">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                 )}
            </div>
        </div>
    );
}
