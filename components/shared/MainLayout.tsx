'use client';

import { usePathname } from 'next/navigation';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminPage = pathname.startsWith('/admin-panel');

    return (
        <main className={isAdminPage ? '' : 'pt-20'}>
            {children}
        </main>
    );
}
