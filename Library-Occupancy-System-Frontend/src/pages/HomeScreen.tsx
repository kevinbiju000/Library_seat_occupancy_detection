import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components';

export const HomeScreen: React.FC = () => {
    return (
        <div className="min-h-screen w-full bg-[#212121] text-white flex flex-col selection:bg-[#FF6500]/30 overflow-x-hidden relative">

            {/* Ambient System Glows (Background) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1E3E62]/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

            {/* Corner Decorative Elements */}
            <div className="absolute top-10 left-10 w-20 h-20 border-t border-l border-white/10"></div>
            <div className="absolute bottom-10 right-10 w-20 h-20 border-b border-r border-white/10"></div>

            {/* --- MAIN CONTENT WRAPPER --- */}
            <div className="flex-1 relative z-10 flex flex-col items-center justify-center py-12 px-4">

                {/* --- CENTERED TITLE --- */}
                <div className="text-center mb-12 flex flex-col items-center">
                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-10">
                        Library<br />
                        <span className="text-white bg-clip-text bg-gradient-to-b from-white to-gray-500">
                            Occupancy
                        </span><br />
                        <span className="text-[#FF6500]">Detection</span>
                    </h1>
                </div>

                {/* --- ACTION BUTTONS --- */}
                <div className="flex flex-col sm:flex-row gap-6 w-[400px] max-w-md">
                    <Link to="/live" className="flex-1">
                        <Button
                            className="w-full bg-[#FF6500] text-black hover:bg-white py-10 text-xs font-black tracking-[0.3em] uppercase shadow-[0_0_40px_rgba(255,101,0,0.2)] transition-all duration-300"
                        >
                            [ Analyze Video ]
                        </Button>
                    </Link>
                </div>
            </div>

            {/* --- TEAM MEMBERS & GUIDE --- */}
            <div className="w-full relative z-10 pb-28 pt-12">
                <div className="flex flex-col gap-3 text-xs md:text-sm text-gray-400 tracking-[0.2em] uppercase items-center">
                    <p><span className="text-white">Rupak Yeware</span> <span className="text-[#FF6500] mx-2">·</span> 1032233745</p>
                    <p><span className="text-white">Manas Vernekar</span> <span className="text-[#FF6500] mx-2">·</span> 1032233739</p>
                    <p><span className="text-white">Kevin Biju</span> <span className="text-[#FF6500] mx-2">·</span> 1032231609</p>
                    <p><span className="text-white">Anuj Abhyankar</span> <span className="text-[#FF6500] mx-2">·</span> 1032233721</p>

                    <div className="w-12 h-[1px] bg-white/20 my-2"></div>

                    <p className="text-[#FF6500]">Guided by: <span className="text-white">Dr. Neha Sathe</span></p>
                </div>
            </div>

        </div>
    );
};

export default HomeScreen;