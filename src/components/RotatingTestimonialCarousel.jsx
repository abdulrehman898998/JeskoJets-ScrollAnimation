"use client";

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const RotatingTestimonialCarousel = () => {
    const containerRef = useRef(null);
    const rotationRef = useRef(null);

    // Continuous Rotation
    useGSAP(() => {
        gsap.to(rotationRef.current, {
            rotationY: 360,
            duration: 40, // Slower rotation for better readability
            repeat: -1,
            ease: "none"
        });
    }, { scope: containerRef });

    // 6 Cards for a Hexagonal layout
    const cards = [
        { text: "The AI chatbot reduced our support tickets by 80%.", author: "Tech Corp" },
        { text: "Their automation workflow saved us 20 hours a week.", author: "Logistics Co" },
        { text: "Voice AI implementation was flawless.", author: "Call Center" },
        { text: "Custom ML models transformed our data analysis.", author: "FinTech" },
        { text: "Website overhaul with AI integration increased conversion.", author: "E-comm" },
        { text: "Best agency for end-to-end automation.", author: "Startup Inc" },
    ];

    const radius = 450; // Distance from center

    return (
        <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden perspective-1000">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-20 z-20 drop-shadow-lg">What Clients Say</h2>

            <div className="relative w-full h-[400px] flex items-center justify-center" style={{ perspective: '1200px' }}>
                <div ref={rotationRef} className="relative w-0 h-0" style={{ transformStyle: 'preserve-3d' }}>
                    {cards.map((card, i) => {
                        const angle = (360 / cards.length) * i;
                        return (
                            <div
                                key={i}
                                className="absolute top-1/2 left-1/2 w-[300px] h-[180px] -mt-[90px] -ml-[150px]
                                           bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6
                                           flex flex-col justify-between"
                                style={{
                                    transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                                    // backfaceVisibility: 'hidden' // Optional: keep hidden to reduce clutter, or visible for "cloud" effect
                                }}
                            >
                                <div className="text-lime-400 text-2xl">“</div>
                                <p className="text-white/90 text-sm font-medium leading-relaxed">{card.text}</p>
                                <div className="flex items-center gap-2 mt-4">
                                    <div className="w-8 h-8 rounded-full bg-white/20" />
                                    <span className="text-xs text-white/50 uppercase tracking-wider">{card.author}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default RotatingTestimonialCarousel;
