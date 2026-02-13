"use client";

import React, { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

// Controlled Component: Receives 'progress' (0 to 1) from Master Scroll
const HowWeWork = ({ progress = 0 }) => {
    const listRef = useRef(null);
    const lineRef = useRef(null);

    // AI Agency Workflow
    const steps = [
        { id: "01", title: "Audit", desc: "Deep dive into your bottlenecks." },
        { id: "02", title: "Strategy", desc: "Architecture for your custom AI." },
        { id: "03", title: "Build", desc: "Training models & coding agents." },
        { id: "04", title: "Scale", desc: "Continuous learning & optimization." }
    ];

    // Scrub animation based on props!
    // No ScrollTrigger here. Just pure React + GSAP.
    useEffect(() => {
        if (!listRef.current) return;

        // 1. Move the List Up
        // Total distance: List Height - Window Height
        const totalDist = listRef.current.scrollHeight - window.innerHeight + 200;
        const yPos = -totalDist * progress;

        gsap.to(listRef.current, {
            y: yPos,
            duration: 0.5, // Slight smoothing
            ease: "power1.out"
        });

        // 2. Fill the Line
        gsap.to(lineRef.current, {
            height: `${progress * 100}%`,
            duration: 0.5,
            ease: "none"
        });

    }, [progress]);

    return (
        <div className="w-full h-full relative bg-transparent overflow-hidden flex">

            {/* LEFT: Static Info (Restored Original Design) */}
            <div className="w-1/2 h-full flex flex-col justify-center px-10 md:px-20 relative z-10">
                <h3 className="text-lime-300 font-bold uppercase tracking-widest mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">Our Process</h3>
                <h2 className="text-6xl font-serif font-bold text-white leading-tight mb-12 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
                    How we work<br />
                    <span className="text-white/80">at Jesko Jets</span>
                </h2>
                <button className="w-fit px-8 py-4 bg-lime-400 hover:bg-lime-300 text-black font-bold rounded-full transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(132,204,22,0.4)] flex items-center gap-2">
                    Book a strategy call
                    <span className="bg-white text-black rounded-full w-6 h-6 flex items-center justify-center text-xs">↗</span>
                </button>
            </div>

            {/* CENTER: Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-white/10 -translate-x-1/2 h-full z-20">
                <div ref={lineRef} className="w-full bg-lime-400 shadow-[0_0_15px_rgba(132,204,22,0.8)]" style={{ height: '0%' }} />
            </div>

            {/* RIGHT: Scrolling List (Restored Card Styles) */}
            <div className="w-1/2 h-full relative z-10">
                <div ref={listRef} className="absolute top-[20%] left-0 w-full flex flex-col gap-[30vh] px-10 md:px-20">
                    {steps.map((step, i) => {
                        // Highlight logic primarily visual
                        const isActive = (progress * 4) > i && (progress * 4) < (i + 1.5);

                        return (
                            <div
                                key={step.id}
                                className={`transition-all duration-500 p-8 rounded-xl backdrop-blur-md border border-white/10 flex flex-col gap-4 text-left ${isActive ? "bg-white/10 border-lime-400 shadow-[0_0_30px_rgba(132,204,22,0.3)] scale-105" : "bg-white/5 opacity-50"}`}
                            >
                                <span className={`font-mono text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-colors duration-300 ${isActive ? "text-lime-300" : "text-lime-300/70"}`}>
                                    Step {step.id}
                                </span>
                                <h3 className="text-5xl font-bold text-white mb-2 drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">{step.title}</h3>
                                <p className="text-xl text-white/90 leading-relaxed font-light drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]">
                                    {step.desc}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>

        </div>
    );
};

export default HowWeWork;
