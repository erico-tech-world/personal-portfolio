'use client';
import { useState, useEffect, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Service } from '@/types/index';
import Spinner from '@/components/shared/Spinner';

export default function ServicesAdmin() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [isPending, startTransition] = useTransition();
    
    const [formData, setFormData] = useState({
        id: null as number | null,
        title: '',
        description: '',
        included_items: '',
        price_min: '',
        price_max: '',
        currency: 'NGN' as 'NGN' | 'USD',
    });

    useEffect(() => {
        const fetchServices = async () => {
            const supabase = createClient();
            setLoading(true);
            const { data } = await supabase.from('services').select('*').order('id');
            setServices(data || []);
            setLoading(false);
        };
        fetchServices();
    }, []);

    useEffect(() => {
        if (editingService) {
            setFormData({
                id: editingService.id,
                title: editingService.title,
                description: editingService.description || '',
                included_items: editingService.included_items?.join('\n') || '',
                price_min: String(editingService.price_min),
                price_max: String(editingService.price_max),
                currency: editingService.currency,
            });
        } else {
            setFormData({
                id: null,
                title: '',
                description: '',
                included_items: '',
                price_min: '',
                price_max: '',
                currency: 'NGN',
            });
        }
    }, [editingService]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const serviceData = {
            title: formData.title,
            description: formData.description,
            included_items: formData.included_items.split('\n').map(item => item.trim()).filter(item => item.length > 0),
            price_min: Number(formData.price_min),
            price_max: Number(formData.price_max),
            currency: formData.currency,
        };

        startTransition(async () => {
            const supabase = createClient();
            if (editingService) {
                // Update
                const { data, error } = await supabase.from('services').update(serviceData).eq('id', editingService.id).select();
                if (data) {
                    setServices(prev => prev.map(s => s.id === editingService.id ? data[0] : s));
                    setEditingService(null);
                } else {
                    alert(error?.message);
                }
            } else {
                // Add
                const { data, error } = await supabase.from('services').insert([serviceData]).select();
                if (data) {
                    setServices(prev => [...prev, data[0]]);
                    setEditingService(null); // Resets the form
                } else {
                    alert(error?.message);
                }
            }
        });
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this service?')) {
            startTransition(async () => {
                const supabase = createClient();
                const { error } = await supabase.from('services').delete().eq('id', id);

                if (!error) {
                    setServices(prev => prev.filter(s => s.id !== id));
                } else {
                    alert(error.message);
                }
            });
        }
    };

    return (
        <div className="relative bg-navy-medium p-6 rounded-lg">
            {isPending && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg z-10">
                    <Spinner size="h-12 w-12" />
                </div>
            )}
            <h2 className="text-3xl font-bold mb-6">Manage Services</h2>

            {/* Add/Edit Form */}
            <div className="bg-navy-dark p-6 rounded-lg mb-12">
                <h3 className="text-2xl font-bold mb-4">
                    {editingService ? 'Edit Service' : 'Add New Service'}
                </h3>
                <form 
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <div>
                        <label htmlFor="title" className="block mb-2">Title</label>
                        <input type="text" name="title" id="title" required value={formData.title} onChange={handleInputChange} className="w-full bg-navy-medium p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-cyan" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block mb-2">Description</label>
                        <textarea 
                            name="description" 
                            id="description" 
                            required 
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full bg-navy-medium p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-cyan"
                        />
                    </div>
                    <div>
                        <label htmlFor="included_items" className="block mb-2">Included Items (One per line)</label>
                        <textarea 
                            name="included_items" 
                            id="included_items" 
                            required 
                            value={formData.included_items}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full bg-navy-medium p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-cyan"
                            placeholder="Logo Design & Variations&#10;Color Palette & Typography&#10;Brand Style Guide&#10;Social Media Kit"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                             <label htmlFor="price_min" className="block mb-2">Min Price</label>
                             <input type="number" name="price_min" id="price_min" required value={formData.price_min} onChange={handleInputChange} className="w-full bg-navy-medium p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-cyan" />
                        </div>
                        <div>
                            <label htmlFor="price_max" className="block mb-2">Max Price</label>
                            <input type="number" name="price_max" id="price_max" required value={formData.price_max} onChange={handleInputChange} className="w-full bg-navy-medium p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-cyan" />
                        </div>
                        <div>
                            <label htmlFor="currency" className="block mb-2">Currency</label>
                            <select name="currency" id="currency" required value={formData.currency} onChange={handleInputChange} className="w-full bg-navy-medium p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-cyan">
                                <option value="NGN">NGN (₦)</option>
                                <option value="USD">USD ($)</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button type="submit" disabled={isPending} className="bg-accent-blue text-white font-bold py-2 px-6 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50">
                            {isPending ? 'Saving...' : (editingService ? 'Save Changes' : 'Add Service')}
                        </button>
                        {editingService && (
                            <button type="button" onClick={() => setEditingService(null)} className="bg-medium-gray text-white font-bold py-2 px-6 rounded-md hover:bg-gray-600 transition-colors">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Existing Services Table */}
            <div className="overflow-x-auto">
                <h3 className="text-2xl font-bold mb-4">Existing Services</h3>
                 {loading ? (
                    <div className="flex justify-center p-8">
                        <Spinner size="h-16 w-16" />
                    </div>
                 ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-600">
                                <th className="p-3">Title</th>
                                <th className="p-3">Price Range</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map((service) => (
                                <tr key={service.id} className="border-b border-gray-700">
                                    <td className="p-3">{service.title}</td>
                                    <td className="p-3">
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: service.currency }).format(service.price_min)} - {new Intl.NumberFormat('en-US', { style: 'currency', currency: service.currency }).format(service.price_max)}
                                    </td>
                                    <td className="p-3 text-right">
                                        <button onClick={() => setEditingService(service)} className="bg-accent-amber text-white font-bold py-1 px-4 rounded-md hover:bg-amber-600 transition-colors mr-2">Edit</button>
                                        <button onClick={() => handleDelete(service.id)} disabled={isPending} className="bg-red-500 text-white font-bold py-1 px-4 rounded-md hover:bg-red-600 transition-colors disabled:opacity-50">Delete</button>
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
