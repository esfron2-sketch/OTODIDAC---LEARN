import './globals.css';
import Sidebar from '@/components/Sidebar';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'OT-LEARN | Expert Platform',
  description: 'Advanced Learning Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-main text-light`}>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 w-full lg:ml-64 overflow-hidden relative">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}