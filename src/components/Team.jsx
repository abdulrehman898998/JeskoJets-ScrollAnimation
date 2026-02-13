"use client";

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

// Receives progress (0 to 1) from Master Scroll
const Team = ({ progress = 0 }) => {
    const card1Ref = useRef(null);
    const card2Ref = useRef(null);

    useEffect(() => {
        // VERTICAL CAROUSEL LOGIC
        // 0.0 - 0.4: Card 1 visible, Card 2 below
        // 0.4 - 0.6: Transition (Card 1 moves up/out, Card 2 moves up/in)
        // 0.6 - 1.0: Card 2 visible

        // Card 1: Starts at Center, Moves UP
        gsap.to(card1Ref.current, {
            yPercent: progress > 0.45 ? -150 : 0, // Move UP
            opacity: progress > 0.45 ? 0 : 1,
            scale: progress > 0.45 ? 0.9 : 1,
            duration: 0.8,
            ease: "power2.inOut"
        });

        // Card 2: Starts Below, Moves UP to Center
        gsap.to(card2Ref.current, {
            yPercent: progress > 0.45 ? 0 : 150, // Starts down, moves to 0
            opacity: progress > 0.45 ? 1 : 0,
            scale: progress > 0.45 ? 1 : 0.9,
            duration: 0.8,
            ease: "power2.inOut"
        });

    }, [progress]);

    return (
        <div className="w-full h-full relative overflow-hidden flex flex-col items-center justify-center">
            <h2 className="absolute top-20 text-white/5 text-[12vw] font-bold uppercase pointer-events-none select-none">
                FOUNDERS
            </h2>

            <div className="relative w-full max-w-2xl h-[600px] flex items-center justify-center perspective-[1000px]">

                {/* FOUNDER 1 (Alex) */}
                <div ref={card1Ref} className="absolute w-[400px] bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-2xl flex flex-col items-center shadow-lg mix-blend-screen">
                    <div className="w-32 h-32 rounded-full bg-lime-400 mb-6 flex items-center justify-center text-black text-4xl font-bold shadow-lg shadow-lime-400/50">
                        A
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">Alex</h3>
                    <p className="text-lime-400 tracking-widest text-xs font-mono mb-4">AI ARCHITECT</p>
                    <p className="text-white/80 text-center text-sm">
                        "Building the digital brain."
                    </p>
                </div>

                {/* FOUNDER 2 (Sarah) */}
                <div ref={card2Ref} className="absolute w-[400px] bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-2xl flex flex-col items-center shadow-lg translate-y-[150%] opacity-0 mix-blend-screen">
                    <div className="w-32 h-32 rounded-full bg-cyan-400 mb-6 flex items-center justify-center text-black text-4xl font-bold shadow-lg shadow-cyan-400/50">
                        S
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">Sarah</h3>
                    <p className="text-cyan-400 tracking-widest text-xs font-mono mb-4">AUTOMATION LEAD</p>
                    <p className="text-white/80 text-center text-sm">
                        "Scaling efficiency to infinity."
                    </p>
                </div>

            </div>

            <div className="absolute inset-y-0 right-10 flex flex-col justify-center gap-4">
                <div className={`w-2 h-2 rounded-full transition-all ${progress < 0.5 ? 'bg-lime-400 scale-150' : 'bg-white/20'}`} />
                <div className={`w-2 h-2 rounded-full transition-all ${progress > 0.5 ? 'bg-cyan-400 scale-150' : 'bg-white/20'}`} />
            </div>
        </div>
    );
};

export default Team;
