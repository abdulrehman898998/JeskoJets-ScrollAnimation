"use client";

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

// Receives progress (0 to 1) from Master Scroll
const Team = ({ progress = 0 }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        // HORIZONTAL SCROLL LOGIC
        // The container is 200vw wide (2 slides).
        // We simply translate it to the left based on progress.
        // progress 0 -> 0% (Show Slide 1)
        // progress 1 -> -50% (Show Slide 2)

        gsap.to(containerRef.current, {
            xPercent: -50 * progress,
            duration: 0.1,
            ease: "none",
            overwrite: true
        });

    }, [progress]);

    return (
        <div className="w-full h-full relative overflow-hidden bg-transparent">
            {/* Background Title */}
            <h2 className="absolute top-10 left-10 text-white/5 text-[15vw] font-bold uppercase pointer-events-none select-none leading-none z-0">
                TEAM
            </h2>

            {/* WIDE CONTAINER (200vw) */}
            <div ref={containerRef} className="absolute top-0 left-0 h-full flex w-[200%] will-change-transform">

                {/* SLIDE 1: FOUNDER 1 (Alex) */}
                <div className="w-1/2 h-full flex flex-col md:flex-row items-center justify-center p-10 relative">
                    <div className="w-full md:w-1/2 h-full flex flex-col justify-center text-left pr-10 pl-20 z-10">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="w-12 h-[2px] bg-lime-400"></span>
                            <span className="text-lime-400 font-mono tracking-widest uppercase">Co-Founder</span>
                        </div>
                        <h3 className="text-6xl font-bold text-white mb-6">Alex</h3>
                        <p className="text-2xl text-white/80 font-light leading-relaxed mb-8">
                            "Automation isn't just a tool.<br />It's a philosophy of efficiency."
                        </p>
                        <div className="flex flex-col gap-2 text-white/60 text-sm font-mono">
                            <p>ROLE: STRATEGY & ARCHITECTURE</p>
                            <p>EXP: 10+ YEARS IN AI</p>
                        </div>
                    </div>
                    {/* Image Area */}
                    <div className="w-full md:w-[40%] h-[80%] relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 z-10 group">
                        <Image src="/team/member1.jpg" alt="Alex" fill className="object-cover group-hover:scale-110 transition-transform duration-1000" priority />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    </div>
                </div>

                {/* SLIDE 2: FOUNDER 2 (Sarah) */}
                <div className="w-1/2 h-full flex flex-col md:flex-row items-center justify-center p-10 relative">
                    <div className="w-full md:w-1/2 h-full flex flex-col justify-center text-left pr-10 pl-20 z-10">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="w-12 h-[2px] bg-cyan-400"></span>
                            <span className="text-cyan-400 font-mono tracking-widest uppercase">Co-Founder</span>
                        </div>
                        <h3 className="text-6xl font-bold text-white mb-6">Sarah</h3>
                        <p className="text-2xl text-white/80 font-light leading-relaxed mb-8">
                            "Building systems that learn,<br />adapt, and outpace the market."
                        </p>
                        <div className="flex flex-col gap-2 text-white/60 text-sm font-mono">
                            <p>ROLE: ENGINEERING & ML</p>
                            <p>EXP: EX-AMAZON ENGINEER</p>
                        </div>
                    </div>
                    {/* Image Area */}
                    <div className="w-full md:w-[40%] h-[80%] relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 z-10 group">
                        <Image src="/team/member2.jpeg" alt="Sarah" fill className="object-cover group-hover:scale-110 transition-transform duration-1000" priority />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    </div>
                </div>

            </div>

            {/* Simple Progress Bar */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                    className="h-full bg-lime-400 transition-all duration-100 ease-linear"
                    style={{ width: `${progress * 100}%` }}
                />
            </div>

        </div>
    );
};

export default Team;
