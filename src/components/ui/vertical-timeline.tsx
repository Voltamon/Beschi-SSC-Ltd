
'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export type TimelineEntry = {
    icon: LucideIcon;
    heading: string;
    paragraph: string;
    color: string;
};

type VerticalTimelineProps = {
    entries: TimelineEntry[];
};

export function VerticalTimeline({ entries }: VerticalTimelineProps) {
    const timelineRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timeline = timelineRef.current;
        const line = lineRef.current;
        const items = gsap.utils.toArray('.timeline-item-container') as HTMLElement[];

        if (!timeline || !line || items.length === 0) return;

        const ctx = gsap.context(() => {
            // Animate the line filling up
            gsap.fromTo(line, 
                { scaleY: 0 },
                {
                    scaleY: 1,
                    backgroundColor: '#5C4033', // Dark brown
                    ease: 'none',
                    scrollTrigger: {
                        trigger: timeline,
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: true,
                    },
                }
            );

            // Animate each item
            items.forEach((item) => {
                const isLeft = item.parentElement?.classList.contains('timeline-item-left');
                const content = item.querySelector('.timeline-content');
                gsap.from(content, {
                    xPercent: isLeft ? -50 : 50,
                    opacity: 0,
                    ease: 'power2.out',
                    duration: 1,
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 80%',
                        end: 'top 50%',
                        scrub: 1.5,
                    },
                });
            });
        }, timeline);

        return () => ctx.revert();
    }, [entries]);

    return (
        <div ref={timelineRef} className="relative w-full max-w-6xl mx-auto py-16">
            <div 
                className="absolute top-0 w-1 bg-border/20 left-1/2 -translate-x-1/2"
                style={{ height: '100%' }}
            >
                <div 
                    ref={lineRef}
                    className="w-full bg-primary origin-top"
                    style={{ height: '100%' }}
                />
            </div>
            
            {entries.map((entry, index) => (
                <TimelineEntryItem
                    key={index}
                    entry={entry}
                    isLeft={index % 2 === 0}
                />
            ))}
        </div>
    );
}

function use3DTilt() {
    const ref = useRef<HTMLDivElement>(null);
    const isTouchDevice = useRef(false);

    useEffect(() => {
        isTouchDevice.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice.current) return;
        
        const el = ref.current;
        if (!el) return;

        gsap.set(el, { transformStyle: 'preserve-3d', perspective: 1000 });

        const onMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { left, top, width, height } = el.getBoundingClientRect();
            const x = (clientX - left) / width;
            const y = (clientY - top) / height;

            const rotateX = gsap.utils.mapRange(0, 1, -15, 15)(y);
            const rotateY = gsap.utils.mapRange(0, 1, 15, -15)(x);

            gsap.to(el, {
                duration: 0.3,
                rotationX: rotateX,
                rotationY: rotateY,
                scale: 1.03,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
                ease: 'power2.out',
            });
        };

        const onMouseLeave = () => {
            gsap.to(el, {
                duration: 0.3,
                rotationX: 0,
                rotationY: 0,
                scale: 1,
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                ease: 'power2.out',
            });
        };

        el.addEventListener('mousemove', onMouseMove);
        el.addEventListener('mouseleave', onMouseLeave);

        return () => {
            el.removeEventListener('mousemove', onMouseMove);
            el.removeEventListener('mouseleave', onMouseLeave);
        };
    }, []);

    return ref;
}


function TimelineEntryItem({ entry, isLeft }: { entry: TimelineEntry; isLeft: boolean; }) {
    const Icon = entry.icon;
    const tiltRef = use3DTilt();

    return (
        <section 
            className={cn(
                "min-h-[30vh] w-full flex items-center justify-center py-8 timeline-item",
                isLeft ? 'timeline-item-left' : 'timeline-item-right'
            )}
        >
            <div className="relative w-full px-4 timeline-item-container">
                <div className={cn(
                    "flex w-full md:w-1/2 items-center",
                    isLeft ? "justify-start" : "md:justify-end md:ml-auto"
                )}>
                     <div className={cn(
                        "relative w-full max-w-sm group timeline-content"
                    )}>
                        <div className={cn(
                            "absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-primary-foreground z-10",
                            isLeft ? "md:-right-5 md:left-auto" : "left-0 md:-left-5",
                            "left-0 -translate-x-1/2 md:translate-x-0"
                        )}>
                            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:shadow-xl")} style={{backgroundColor: entry.color}}>
                                <Icon className="w-6 h-6 text-primary-foreground transition-transform duration-300 group-hover:rotate-12"/>
                            </div>
                        </div>

                        <div ref={tiltRef} className={cn(
                            "p-6 rounded-lg shadow-lg w-full bg-card transition-shadow duration-300 group-hover:shadow-xl",
                             isLeft ? "md:text-right" : "md:text-left",
                             "ml-10 md:ml-0 text-left"
                        )}>
                            <h3 className="text-2xl font-headline text-foreground">{entry.heading}</h3>
                            <p className="mt-2 text-muted-foreground">{entry.paragraph}</p>
                        </div>
                    </div>
                 </div>
            </div>
        </section>
    );
}
