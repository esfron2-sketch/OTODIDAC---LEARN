import './globals.css';
import Sidebar from '@/components/Sidebar';
import { Inter, Merriweather } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const merriweather = Merriweather({ weight: ['300', '400', '700'], subsets: ['latin'], variable: '--font-serif' });

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
      <body className={`${inter.variable} ${merriweather.variable} font-sans bg-main text-light`}>
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