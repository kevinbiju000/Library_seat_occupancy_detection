import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components';

export const HomeScreen: React.FC = () => {
    return (
        <div className="h-screen w-full bg-[#000000] text-white flex flex-col items-center justify-center selection:bg-[#FF6500]/30 overflow-hidden relative">

            {/* Ambient System Glows (Background) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1E3E62]/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

            <div className="relative z-10 flex flex-col items-center">

                {/* --- CENTERED TITLE --- */}
                <div className="text-center mb-12">

                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                        Library<br />
                        <span className="text-white bg-clip-text bg-gradient-to-b from-white to-gray-500">
                            Occupancy
                        </span><br />
                        <span className="text-[#FF6500]">Detection</span>
                    </h1>
                </div>

                {/* --- ACTION BUTTONS --- */}
                <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md px-6">
                    <Link to="/live" className="flex-1">
                        <Button
                            className="w-full bg-[#FF6500] text-black hover:bg-white py-10 text-xs font-black tracking-[0.3em] uppercase shadow-[0_0_40px_rgba(255,101,0,0.2)] transition-all duration-300"
                        >
                            [ 01_Analyze ]
                        </Button>
                    </Link>
                </div>

            </div>

            {/* Corner Decorative Elements */}
            <div className="absolute top-10 left-10 w-20 h-20 border-t border-l border-white/10"></div>
            <div className="absolute bottom-10 right-10 w-20 h-20 border-b border-r border-white/10"></div>
        </div>
    );
};

export default HomeScreen;