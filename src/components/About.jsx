"use client";

import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const About = ({ triggerReset = false }) => {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const engineRef = useRef(null);
    const renderRef = useRef(null);

    // Initialization
    useEffect(() => {
        if (!sceneRef.current || !containerRef.current) return;

        const { Engine, Render, Mouse, MouseConstraint, Composite, Events } = Matter;

        const engine = Engine.create();
        engineRef.current = engine;
        engine.world.gravity.y = 0.5; // Reduced gravity for "real objects but slower" feel

        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;

        const render = Render.create({
            element: sceneRef.current,
            engine: engine,
            options: {
                width: containerWidth,
                height: containerHeight,
                wireframes: false,
                background: 'transparent',
                pixelRatio: window.devicePixelRatio,
            }
        });
        renderRef.current = render;

        // Infinite Loop Logic
        Events.on(engine, 'beforeUpdate', () => {
            const bodies = Composite.allBodies(engine.world);
            bodies.forEach(body => {
                // Teleport logic
                // If body falls below container
                if (body.position.y > containerHeight + 200) {
                    Matter.Body.setPosition(body, {
                        x: Math.random() * containerWidth * 0.8 + (containerWidth * 0.1),
                        y: -200 // Respawn high above
                    });
                    Matter.Body.setVelocity(body, { x: 0, y: 0 });
                    Matter.Body.setAngularVelocity(body, 0);
                }
            });
        });

        // Mouse (Interaction)
        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: { stiffness: 0.2, render: { visible: false } }
        });
        Composite.add(engine.world, mouseConstraint);

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

    // Reset / Spawn Logic
    useEffect(() => {
        if (!engineRef.current || !triggerReset || !containerRef.current) return;

        const { Bodies, Composite } = Matter;
        const world = engineRef.current.world;
        const width = containerRef.current.clientWidth;

        // Clear existing bodies (except mouse)
        const allBodies = Composite.allBodies(world);
        const bodiesToRemove = allBodies.filter(b => b.label !== 'Mouse Body');
        Composite.remove(world, bodiesToRemove);

        // Add Walls (Side walls only)
        const wallThickness = 60;
        const height = containerRef.current.clientHeight;
        const walls = [
            Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height * 3, { isStatic: true, render: { visible: false } }), // Left
            Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height * 3, { isStatic: true, render: { visible: false } }), // Right
        ];
        Composite.add(world, walls);

        const techStack = [
            { label: 'CHAT', color: '#a3e635' }, // Lime
            { label: 'VOICE', color: '#22d3ee' }, // Cyan
            { label: 'AUTO', color: '#f472b6' }, // Pink
            { label: 'DATA', color: '#fbbf24' }, // Yellow
            { label: 'WEB', color: '#ffffff' }, // White
        ];

        const logos = [];
        for (let i = 0; i < 15; i++) { // Few fewer items for cleaner look
            const tech = techStack[Math.floor(Math.random() * techStack.length)];
            const x = Math.random() * width * 0.6 + (width * 0.2);
            const y = -Math.random() * 1500 - 200;

            let body;
            const size = width < 400 ? 30 : 50;

            if (Math.random() > 0.5) {
                body = Bodies.circle(x, y, size * 0.6, {
                    restitution: 0.5,
                    friction: 0.001,
                    frictionAir: 0.04, // "Real objects" air resistance
                    render: { fillStyle: tech.color }
                });
            } else {
                body = Bodies.rectangle(x, y, size * 1.2, size * 1.2, {
                    restitution: 0.3,
                    friction: 0.001,
                    frictionAir: 0.04,
                    chamfer: { radius: 10 },
                    render: { fillStyle: tech.color }
                });
            }
            logos.push(body);
        }
        Composite.add(world, logos);

    }, [triggerReset]);

    return (
        <div className="w-full h-full relative flex items-center justify-center bg-transparent">

            <div className="w-full w-[90%] max-w-none h-[60vh] flex flex-col md:flex-row gap-8 px-8">

                {/* LEFT: TEXT CONTENT */}
                <div className="w-full md:w-1/2 flex flex-col justify-center text-left pointer-events-none">
                    <h3 className="text-lime-400 font-mono tracking-widest text-lg mb-4 uppercase drop-shadow-md">Services</h3>
                    <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                        What We<br />Offer
                    </h2>
                    <p className="text-xl text-white/90 max-w-md leading-relaxed drop-shadow-md font-medium">
                        We don't just build websites. We deploy intelligence. From autonomous voice agents to full-scale data automation.
                    </p>
                </div>

                {/* RIGHT: FALLING APPS BOX */}
                <div ref={containerRef} className="w-full md:w-1/2 h-full relative bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                    <div className="absolute top-6 left-8 z-10">
                        <span className="text-white/40 font-mono text-sm uppercase tracking-wider">Physics Simulation // Active</span>
                    </div>
                    <div ref={sceneRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />
                </div>

            </div>

        </div>
    );
};

export default About;