/**
 * Navigation Bar - Minimalist Terminal Edition
 * Features: Transparent background, completely minimal, right-aligned mono-spaced links.
 */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

export const Navigation: React.FC = () => {
    const location = useLocation();
    const navItems = [
        { label: 'HOME', path: '/' },
        { label: 'ANALYZE', path: '/live' },
    ];
    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="bg-transparent w-full absolute top-0 z-50">
            <div className="w-screen mx-auto px-8 md:px-16">
                <div className="flex items-center justify-end h-20">
                    <div className="flex flex-row items-center" style={{ gap: '1rem' }}>
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={clsx(
                                    'block text-[15px] font-black tracking-[0.3em] transition-all duration-300 uppercase py-2',
                                    isActive(item.path)
                                        ? 'text-white'
                                        : 'text-gray-500 hover:text-white'
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;