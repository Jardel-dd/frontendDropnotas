import { Metadata } from 'next';
import Layout from '../../layout/layout';

interface MainLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'DropNotas',
    robots: { index: false, follow: false },
    viewport: { initialScale: 1, width: 'device-width' },
    openGraph: {
        type: 'website',
        ttl: 604800
    },
    icons: {
        icon: '/logoDrm.png',    }
};

export default function MainLayout({ children }: MainLayoutProps) {
    return <Layout>{children}</Layout>;
}
