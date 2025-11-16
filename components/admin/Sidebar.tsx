'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
    { href: '/admin-panel', label: 'Dashboard' },
    { href: '/admin-panel/about', label: 'About' },
    { href: '/admin-panel/services', label: 'Services' },
    { href: '/admin-panel/gallery', label: 'Gallery' },
    { href: '/admin-panel/messages', label: 'Messages' },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-navy-medium p-6 flex flex-col">
            <h1 className="text-3xl font-bold mb-8">Admin</h1>
            <nav className="flex flex-col space-y-2">
                {navLinks.map(link => {
                    const isActive = pathname === link.href;
                    return (
                        <Link key={link.href} href={link.href}
                            className={`px-4 py-2 rounded-md text-lg transition-colors ${
                                isActive 
                                    ? 'bg-accent-cyan text-navy-dark font-bold' 
                                    : 'hover:text-accent-cyan'
                            }`}
                        >
                            {link.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
