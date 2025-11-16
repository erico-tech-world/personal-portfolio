'use client';
import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import Sidebar from '@/components/admin/Sidebar';

function AdminLogin() {
    const supabase = createClient();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            setError(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-navy-medium p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6">Admin Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <input 
                            type="email" 
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-navy-dark p-4 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-cyan" required />
                    </div>
                    <div className="mb-6">
                        <input 
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-navy-dark p-4 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-cyan" required />
                    </div>
                    <button type="submit" className="w-full bg-accent-cyan text-navy-dark font-bold py-3 px-8 rounded-lg hover:bg-white transition-all duration-300">
                        Login
                    </button>
                    {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
                </form>
            </div>
        </div>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };
        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
    }

    if (!user) {
        return <AdminLogin />;
    }

    return (
        <div className="relative min-h-screen flex bg-navy-dark text-white">
            <aside className="w-64 bg-navy-medium p-6 flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
                <Sidebar />
            </aside>
            <main className="flex-1 p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl">Welcome, {user.email}</h1>
                    <button onClick={handleLogout} className="bg-red-500 text-white font-bold py-2 px-6 rounded-md hover:bg-red-600 transition-colors">
                        Logout
                    </button>
                </div>
                {children}
            </main>
        </div>
    );
}