"use client";

import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const About = ({ triggerReset = false }) => {
    const sceneRef = useRef(null);
    const engineRef = useRef(null);
    const renderRef = useRef(null);

    // Initialization (Runs once)
    useEffect(() => {
        if (!sceneRef.current) return;

        const { Engine, Render, World, Mouse, MouseConstraint } = Matter;

        const engine = Engine.create();
        engineRef.current = engine;

        // Disable gravity initially or keeping it normal
        engine.world.gravity.y = 1;

        const render = Render.create({
            element: sceneRef.current,
            engine: engine,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
                wireframes: false,
                background: 'transparent',
                pixelRatio: window.devicePixelRatio,
            }
        });
        renderRef.current = render;

        // Mouse Control
        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        });
        Matter.Composite.add(engine.world, mouseConstraint);

        // Remove scroll interference
        mouseConstraint.mouse.element.removeEventListener("mousewheel", mouseConstraint.mouse.mousewheel);
        mouseConstraint.mouse.element.removeEventListener("DOMMouseScroll", mouseConstraint.mouse.mousewheel);

        Render.run(render);
        const runner = Matter.Runner.create();
        Matter.Runner.run(runner, engine);

        return () => {
            Render.stop(render);
            Matter.Runner.stop(runner);
            if (render.canvas) render.canvas.remove();
            Engine.clear(engine);
        };
    }, []);

    // Reset Logic (Runs when triggerReset changes)
    useEffect(() => {
        if (!engineRef.current || !triggerReset) return;

        const { Bodies, Composite } = Matter;
        const world = engineRef.current.world;
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Clear existing bodies (except mouse constraint)
        const allBodies = Composite.allBodies(world);
        Composite.remove(world, allBodies);

        // Add Walls (Invisible)
        const walls = [
            Bodies.rectangle(-50, height / 2, 100, height * 3, { isStatic: true, render: { visible: false } }),
            Bodies.rectangle(width + 50, height / 2, 100, height * 3, { isStatic: true, render: { visible: false } }),
        ];
        Composite.add(world, walls);

        // Spawn "Apps" Logos
        const techStack = [
            { label: 'CHAT', color: '#a3e635' }, // Lime
            { label: 'VOICE', color: '#22d3ee' }, // Cyan
            { label: 'AUTO', color: '#f472b6' }, // Pink
            { label: 'DATA', color: '#fbbf24' }, // Yellow
            { label: 'WEB', color: '#ffffff' }, // White
        ];

        const logos = [];
        for (let i = 0; i < 30; i++) {
            const tech = techStack[Math.floor(Math.random() * techStack.length)];
            const x = Math.random() * width * 0.8 + (width * 0.1);
            const y = -Math.random() * 1500 - 200; // Start high up

            let body;
            // Mix of shapes
            if (Math.random() > 0.5) {
                body = Bodies.circle(x, y, 35, {
                    restitution: 0.7,
                    friction: 0.001,
                    render: { fillStyle: tech.color }
                });
            } else {
                body = Bodies.rectangle(x, y, 70, 70, {
                    restitution: 0.5,
                    friction: 0.001,
                    chamfer: { radius: 12 },
                    render: { fillStyle: tech.color }
                });
            }
            logos.push(body);
        }
        Composite.add(world, logos);

    }, [triggerReset]);

    return (
        <div className="w-full h-full relative flex items-center justify-center">
            {/* Background Title - Renamed to What We Offer */}
            <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12vw] font-bold text-white/5 uppercase pointer-events-none select-none text-center leading-none">
                WHAT WE<br />OFFER
            </h1>

            <div className="absolute top-32 z-10 text-center max-w-3xl px-6 text-white pointer-events-none">
                <h2 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-2xl">Full Stack<br />Intelligence</h2>
                <p className="text-xl text-white/90 font-light">
                    Our proprietary models integrate seamlessly.
                </p>
            </div>

            <div ref={sceneRef} className="absolute inset-0 pointer-events-auto z-20" />
        </div>
    );
};

export default About;