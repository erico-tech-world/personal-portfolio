'use client';
import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import Sidebar from '@/components/admin/Sidebar';

// Hamburger Icon component
const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        {...props}
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
    >
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
);

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
        <div className="min-h-screen flex items-center justify-center bg-navy-dark">
            <div className="bg-navy-medium p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6 text-white">Admin Login</h2>
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
    const [isSidebarOpen, setSidebarOpen] = useState(false);
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
        return <div className="min-h-screen flex items-center justify-center bg-navy-dark text-white"><p>Loading...</p></div>;
    }

    if (!user) {
        return <AdminLogin />;
    }

    return (
        <div className="relative min-h-screen md:flex bg-navy-dark text-white">
            {/* Overlay for mobile */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}
                onClick={() => setSidebarOpen(false)}
            ></div>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-navy-medium p-6 transform z-20 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <Sidebar />
            </aside>
            
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <button
                        className="md:hidden text-white"
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                    >
                        <MenuIcon className="h-6 w-6" />
                    </button>
                    <h1 className="text-lg sm:text-xl md:text-2xl truncate">
                        Welcome, <span className="font-semibold">{user.email?.split('@')[0]}</span>
                    </h1>
                    <button onClick={handleLogout} className="bg-red-500 text-white font-bold py-2 px-3 sm:px-4 md:px-6 rounded-md hover:bg-red-600 transition-colors text-xs sm:text-sm md:text-base">
                        Logout
                    </button>
                </header>
                {children}
            </main>
        </div>
    );
}