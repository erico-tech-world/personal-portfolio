'use client';
import { useState, useEffect, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { ContactMessage } from '@/types/index';
import { deleteContactMessage } from '@/app/actions';

export default function ContactMessagesAdmin() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        const fetchMessages = async () => {
            const supabase = createClient();
            setLoading(true);
            const { data } = await supabase
                .from('contacts')
                .select('*')
                .order('created_at', { ascending: false });
            setMessages(data || []);
            setLoading(false);
        };
        fetchMessages();
    }, []);

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this message?')) {
            startTransition(async () => {
                const result = await deleteContactMessage(id);
                if (result.success) {
                    setMessages(prev => prev.filter(msg => msg.id !== id));
                } else {
                    alert(result.error);
                }
            });
        }
    }

    return (
        <div className="bg-navy-medium p-6 rounded-lg">
            <h2 className="text-3xl font-bold mb-6">Contact Messages</h2>
            {loading ? <p>Loading messages...</p> : (
                <div className="space-y-4">
                    {messages.length === 0 && <p>No messages yet.</p>}
                    {messages.map(msg => (
                        <div key={msg.id} className="bg-navy-dark p-4 rounded-md border border-gray-700">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold">{msg.name} <span className="font-normal text-gray-400">&lt;{msg.email}&gt;</span></p>
                                    <p className="text-sm text-gray-400">
                                        Received on: {new Date(msg.created_at).toLocaleString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDelete(msg.id)}
                                    disabled={isPending}
                                    className="bg-red-500 text-white font-bold py-1 px-3 rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                            <p className="mt-3 text-light-gray whitespace-pre-wrap">{msg.message}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
