"use client";

import React, { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';
import gsap from 'gsap';
import testimonialsData from '@/data/testimonials.json';

const RotatingTestimonialCarousel = () => {
    const containerRef = useRef(null);
    const rotationRef = useRef(null);
    const tweenRef = useRef(null);

    // Data Management
    const allTestimonials = useRef([]);
    const currentIndex = useRef(0);
    const [currentBatch, setCurrentBatch] = useState([]);

    // Initialize & Shuffle
    useEffect(() => {
        // Shuffle once on mount
        allTestimonials.current = [...testimonialsData].sort(() => 0.5 - Math.random());
        // Load first batch
        setCurrentBatch(allTestimonials.current.slice(0, 6));
    }, []);

    // Continuous Rotation with Data Refresh
    useGSAP(() => {
        if (currentBatch.length === 0) return;

        tweenRef.current = gsap.to(rotationRef.current, {
            rotationY: 360,
            duration: 60,
            ease: "none",
            repeat: 0, // Run once, then refresh data
            onComplete: function () {
                // 1. Fetch "New Data" (Next Batch)
                const total = allTestimonials.current.length;
                let nextIndex = (currentIndex.current + 6) % total;

                // Handle Wrap-around logic to ensure we always get 6 items
                let nextBatch = [];
                for (let i = 0; i < 6; i++) {
                    nextBatch.push(allTestimonials.current[(nextIndex + i) % total]);
                }

                // 2. Update State & Index
                setCurrentBatch(nextBatch);
                currentIndex.current = nextIndex;

                // 3. Reset Rotation Instantly
                gsap.set(rotationRef.current, { rotationY: 0 });

                // 4. Restart Animation
                this.restart();
            }
        });
    }, { scope: containerRef, dependencies: [currentBatch] }); // Re-bind if batch changes? Actually better to let the tween handle it.
    // Wait, if I depend on currentBatch, the useGSAP will re-run and kill the tween.
    // I should NOT depend on currentBatch if I want the tween to persist, BUT the tween needs to restart.
    // Actually, accessing state inside GSAP callback is fine. The dependency array should be empty or minimal.
    // Let's remove currentBatch from dependencies to avoid re-creating the tween mid-flight, 
    // BUT we need to ensure the tween is created after first batch is loaded.
    // Adding a check for currentBatch.length inside.

    const radius = 500;

    return (
        <div
            ref={containerRef}
            className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden perspective-1000 group"
        >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-20 z-20 drop-shadow-lg">Stories of Success</h2>

            <div className="relative w-full h-[400px] flex items-center justify-center" style={{ perspective: '1200px' }}>
                <div ref={rotationRef} className="relative w-0 h-0" style={{ transformStyle: 'preserve-3d' }}>
                    {currentBatch.map((item, i) => {
                        // Calculate angle for 6 items
                        const angle = (360 / 6) * i;
                        return (
                            <div
                                key={`${item.id}-${currentIndex.current}`} // Force re-render on batch change
                                className="absolute top-1/2 left-1/2 w-[400px] h-[300px] -mt-[150px] -ml-[200px]
                                           bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6
                                           flex flex-col justify-start text-left shadow-2xl transition-colors duration-300 hover:bg-black/60 hover:border-lime-400/50"
                                style={{
                                    transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                                }}
                                onMouseEnter={() => tweenRef.current?.pause()}
                                onMouseLeave={() => tweenRef.current?.play()}
                            >
                                <div className="text-lime-400 text-3xl mb-2 font-serif">“</div>
                                <p className="text-white/90 text-sm font-light leading-relaxed select-none overflow-y-auto pr-2 custom-scrollbar">
                                    {item.review}
                                </p>

                                <div className="mt-auto pt-4 border-t border-white/10 flex items-center gap-3 shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-white/20 overflow-hidden relative">
                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-bold">{item.name}</p>
                                        <p className="text-white/50 text-xs">{item.verified || "Client"}</p>
                                    </div>
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
