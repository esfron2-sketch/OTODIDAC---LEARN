"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Upload, LayoutDashboard, Menu, X, Youtube, GraduationCap } from 'lucide-react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Hide sidebar on onboarding page
  if (pathname === '/onboarding') return null;

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'AI Course Gen', href: '/learn', icon: GraduationCap },
    { name: 'Asisten Video', href: '/video-assist', icon: Youtube },
    { name: 'Upload PDF', href: '/upload', icon: Upload },
    { name: 'Library', href: '/materials', icon: BookOpen },
  ];

  return (
    <>
      {/* Mobile Trigger */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-surface rounded-lg text-primary shadow-lg border border-primary/20"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 z-40 h-screen w-64 transition-transform duration-300 ease-in-out
        bg-surface border-r border-gray-800 flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <BookOpen className="text-primary mr-3" size={28} />
          <h1 className="text-xl font-bold tracking-wider text-light">OT-LEARN</h1>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'text-muted hover:bg-card hover:text-light'}
                `}
              >
                <item.icon size={20} className={`mr-3 ${isActive ? 'text-primary' : 'text-muted group-hover:text-primary'}`} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center px-4 py-3 w-full text-muted text-xs">
            <span>© 2025 OT-LEARN Pro</span>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
        />
      )}
    </>
  );
}