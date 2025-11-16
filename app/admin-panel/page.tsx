import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/shared/Card'; // Assuming a shared Card component exists
import { Service } from '@/types';
import { Contact } from '@/types';

async function getServices() {
    const supabase = createClient();
    const { data } = await supabase.from('services').select('*').order('created_at', { ascending: false });
    return data;
}

async function getRecentMessages() {
    const supabase = createClient();
    const { data } = await supabase.from('contacts').select('*').order('created_at', { ascending: false }).limit(5);
    return data;
}

export default async function AdminDashboard() {
    const services = await getServices();
    const recentMessages = await getRecentMessages();

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Messages</CardTitle>
                        <CardDescription>Last 5 messages received.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentMessages?.map((msg: Contact) => (
                                <div key={msg.id} className="border-b border-navy-light pb-2">
                                    <p className="font-semibold">{msg.name}</p>
                                    <p className="text-sm text-light-gray truncate">{msg.message}</p>
                                </div>
                            ))}
                        </div>
                        <Link href="/admin-panel/messages" className="text-accent-cyan mt-4 inline-block">View All Messages</Link>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Services</CardTitle>
                        <CardDescription>Overview of your services.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {services?.map((service: Service) => (
                                <p key={service.id} className="font-medium">{service.title}</p>
                            ))}
                        </div>
                        <Link href="/admin-panel/services" className="text-accent-cyan mt-4 inline-block">Manage Services</Link>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Gallery</CardTitle>
                        <CardDescription>Quick actions for your gallery.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/admin-panel/gallery" className="bg-accent-green text-white font-bold py-3 px-6 rounded-md hover:bg-green-600 transition-colors w-full text-center">
                            Manage Gallery
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}