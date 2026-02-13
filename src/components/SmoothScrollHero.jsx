"use client";

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';

import innerImage from "@/assets/images/innerImage.webp";
import outerImage from "@/assets/images/outerImage.webp";
import shadowImage from "@/assets/images/shadowImage.webp";
import skyImage from "@/assets/images/skyImage.webp";
import cloudsImage from "@/assets/images/cloudsImage.webp";
import aboveImage from "@/assets/images/aboveImage.webp";

import About from './About';
import HowWeWork from './HowWeWork';
import Team from './Team';
import RotatingTestimonialCarousel from './RotatingTestimonialCarousel';
import Navbar from './Navbar';

gsap.registerPlugin(ScrollTrigger);

const SmoothScrollHero = () => {
    // Refs for the Master Stage and Scroll Spacer
    const stageRef = useRef(null);
    const scrollSpacerRef = useRef(null);

    // Refs for individual layers/groups
    const heroGroupRef = useRef(null);
    const heroWindowRef = useRef(null);
    const heroTextRef = useRef(null);
    const logoRef = useRef(null); // The wrapper that moves
    const logoImageRef = useRef(null); // The actual image that spins

    // Section Refs
    const aboutRef = useRef(null);
    const howWeWorkRef = useRef(null);
    const teamRef = useRef(null);
    const carouselRef = useRef(null);

    // Persistent Elements
    const cloudsRef = useRef(null);

    // Progress States for Child Animations
    const [workProgress, setWorkProgress] = useState(0);
    const [teamProgress, setTeamProgress] = useState(0);
    const [aboutActive, setAboutActive] = useState(false);

    // Loading State
    const [isLoading, setIsLoading] = useState(true);
    const [showLoader, setShowLoader] = useState(true);

    // Initial Reveal & Loading
    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);

        // Simulate asset loading check or just a safe timeout to ensure DOM is ready
        const timer = setTimeout(() => {
            setIsLoading(false); // Start the app logic

            // Fade out the loader
            gsap.to(".loader-overlay", {
                opacity: 0,
                duration: 1.5,
                ease: "power2.inOut",
                onComplete: () => setShowLoader(false)
            });
        }, 1500); // 1.5s load time

        return () => clearTimeout(timer);
    }, []);

    useGSAP(() => {
        if (isLoading) return; // Don't run GSAP until loaded

        // 0. Cloud Animation (Continuous)
        gsap.to(cloudsRef.current, {
            xPercent: -50,
            duration: 60,
            repeat: -1,
            ease: "none"
        });

        // 0.5 Rotating Logo (Continuous Spin)
        gsap.to(logoImageRef.current, {
            rotation: 360,
            duration: 20,
            repeat: -1,
            ease: "none"
        });

        // 1. THE MASTER TIMELINE
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: scrollSpacerRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.1, // Faster response
            }
        });

        // --- SEQUENCE DEFINITION ---

        // PHASE 1: HERO EXIT (0% -> 15%)
        tl.to(heroWindowRef.current, { scale: 5, rotation: 0.1, duration: 1.5, ease: "power2.in" }, 0)
            .to(heroTextRef.current, { opacity: 0, scale: 1.1, duration: 1 }, 0)
            .to(".scroll-indicator", { opacity: 0, duration: 0.5 }, 0)
            // Move Logo Up and Scale Down (Removed mix-blend-difference via CSS below)
            .to(logoRef.current, { top: "5%", y: 0, scale: 0.4, duration: 1.5, ease: "power2.inOut" }, 0);

        // PHASE 2: ABOUT SECTION (Starts 2, Ends 6)
        tl.fromTo(aboutRef.current,
            { opacity: 0, pointerEvents: "none" },
            {
                opacity: 1,
                pointerEvents: "auto",
                duration: 1,
                onStart: () => setAboutActive(true),
                onReverseComplete: () => setAboutActive(false)
            }, 2)
            .to(aboutRef.current, {
                opacity: 0,
                pointerEvents: "none",
                duration: 1,
                onComplete: () => setAboutActive(false), // Reset when passed
                onReverseStart: () => setAboutActive(true) // Re-activate when scrolling back up
            }, 5); // Exits 5-6

        // PHASE 3: HOW WE WORK (Starts 5, Ends 15)
        tl.fromTo(howWeWorkRef.current,
            { opacity: 0, pointerEvents: "none" },
            { opacity: 1, pointerEvents: "auto", duration: 1 }, 5) // Enters 5-6 (Crossfade with About)
            .to({}, {
                duration: 8,
                onUpdate: function () { setWorkProgress(this.progress()); }
            }, 6)
            .to(howWeWorkRef.current, { opacity: 0, pointerEvents: "none", duration: 1 }, 14); // Exits 14-15

        // PHASE 4: TEAM (Starts 14, Ends 25)
        tl.fromTo(teamRef.current,
            { opacity: 0, pointerEvents: "none" },
            { opacity: 1, pointerEvents: "auto", duration: 1 }, 14) // Enters 14-15 (Crossfade with HWW)
            .to({}, {
                duration: 9,
                onUpdate: function () { setTeamProgress(this.progress()); }
            }, 15)
            .to(teamRef.current, { opacity: 0, pointerEvents: "none", duration: 1 }, 24); // Exits 24-25

        // PHASE 5: CAROUSEL (Starts 24)
        tl.fromTo(carouselRef.current,
            { opacity: 0, pointerEvents: "none" },
            { opacity: 1, pointerEvents: "auto", duration: 1 }, 24); // Enters 24-25 (Crossfade with Team)

    }, { scope: stageRef, dependencies: [isLoading] }); // Re-run when loading finishes

    return (
        <>
            {/* LOADING OVERLAY - SMOOTH FADE OUT */}
            {showLoader && (
                <div className="loader-overlay fixed inset-0 bg-black z-[99999] flex items-center justify-center">
                    <div className="relative w-24 h-24 md:w-32 md:h-32">
                        {/* Golden Rotating Logo */}
                        <Image
                            src="/logo.png"
                            alt="Loading..."
                            fill
                            className="object-contain animate-[spin_3s_linear_infinite]"
                            priority
                        />
                    </div>
                </div>
            )}
            {/* Scroll Spacer Increased to 2000vh for Slower Scroll */}
            <div ref={scrollSpacerRef} className="absolute top-0 left-0 w-full h-[2000vh] pointer-events-none z-[-1]" />

            <div ref={stageRef} className="fixed inset-0 w-full h-screen overflow-hidden">
                <Navbar />

                {/* ROTATING LOGO (Normal Blend Mode) */}
                <div ref={logoRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200] pointer-events-none">
                    <div ref={logoImageRef} className="w-[160px] md:w-[200px]">
                        <Image src="/logo.png" alt="Logo" width={500} height={500} className="w-full h-auto object-contain" priority />
                    </div>
                </div>

                <div className="absolute inset-0 -z-50">
                    <Image src={skyImage} alt="sky" fill className="object-cover object-bottom" priority quality={100} unoptimized />
                </div>
                <div className="absolute inset-0 -z-40 overflow-hidden">
                    <div ref={cloudsRef} className="absolute inset-0 h-full w-[500%]"
                        style={{ backgroundImage: `url(${cloudsImage.src})`, backgroundSize: '50% 100%', backgroundRepeat: 'repeat-x', opacity: 0.6 }} />
                </div>

                <div ref={heroGroupRef} className="absolute inset-0 z-10 pointer-events-none">
                    <div ref={heroWindowRef} className="absolute inset-0 flex items-center justify-center will-change-transform" style={{ perspective: '1000px' }}>
                        <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
                            <Image src={innerImage} alt="inner" fill className="object-cover scale-100 lg:scale-[1.3] z-10" quality={100} style={{ transform: 'translateZ(0)' }} unoptimized />
                            <Image src={shadowImage} alt="shadow" fill className="object-cover scale-100 lg:scale-[1.3] opacity-50 z-20" quality={100} style={{ transform: 'translateZ(0)' }} unoptimized />
                            <Image src={outerImage} alt="outer" fill className="object-cover scale-100 lg:scale-[1.3] z-30" quality={100} style={{ transform: 'translateZ(0)' }} unoptimized />
                            <div className="absolute top-[22.5%] left-[50%] md:top-[10%] md:left-[50.3%] -translate-x-1/2 w-[50%] md:w-[24%] h-auto z-10">
                                <Image src={aboveImage} alt="above" width={400} height={200} className="object-contain" quality={100} unoptimized />
                            </div>
                        </div>
                    </div>
                    <div ref={heroTextRef} className="absolute inset-0 flex items-center justify-between px-20 text-white">
                        <div className="hero-text-left max-w-md">
                            <h1 className="text-4xl md:text-5xl lg:text-[66px] leading-tight font-bold -mt-40 drop-shadow-2xl">We are<br />movement</h1>
                        </div>
                        <div className="hero-text-right max-w-md flex flex-col items-end">
                            <h1 className="text-4xl md:text-5xl lg:text-[60px] font-bold leading-tight text-right mt-40 drop-shadow-2xl">We are<br />distinction</h1>
                        </div>
                    </div>
                    <div className="scroll-indicator absolute bottom-20 right-20 text-white flex items-center gap-2">
                        <ChevronDown className="animate-bounce" />
                        <span className="text-xs tracking-widest">SCROLL TO BEGIN</span>
                    </div>
                </div>

                <div ref={aboutRef} className="absolute inset-0 z-20 flex items-center justify-center opacity-0 pointer-events-none">
                    <About triggerReset={aboutActive} />
                </div>

                <div ref={howWeWorkRef} className="absolute inset-0 z-30 flex items-center justify-center opacity-0 pointer-events-none">
                    <HowWeWork progress={workProgress} />
                </div>

                <div ref={teamRef} className="absolute inset-0 z-40 flex items-center justify-center opacity-0 pointer-events-none">
                    <Team progress={teamProgress} />
                </div>

                <div ref={carouselRef} className="absolute inset-0 z-50 flex items-center justify-center opacity-0 pointer-events-none">
                    <RotatingTestimonialCarousel />
                </div>
            </div>
        </>
    );
};

export default SmoothScrollHero;