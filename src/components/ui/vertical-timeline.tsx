
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

    useEffect(() => {
        const timeline = timelineRef.current;
        if (!timeline) return;

        const items = gsap.utils.toArray('.timeline-item-container') as HTMLElement[];
        const line = timeline.querySelector('.timeline-line-fill');

        const ctx = gsap.context(() => {
            if (line) {
                 gsap.to(line, {
                    scaleY: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: timeline,
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: true,
                    },
                });
            }

            items.forEach((item) => {
                const content = item.querySelector('.timeline-content');
                const fromLeft = item.classList.contains('timeline-item-left');
                
                gsap.set(content, { autoAlpha: 0, x: fromLeft ? '-100%' : '100%' });

                gsap.to(content, {
                    autoAlpha: 1,
                    x: '0%',
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse',
                    },
                });
            });
        }, timeline);

        return () => ctx.revert();
    }, [entries]);

    return (
        <div ref={timelineRef} className="relative w-full max-w-6xl mx-auto py-16">
            <div 
                className="absolute top-0 bottom-0 w-1 bg-border/20 left-1/2 -translate-x-1/2"
                aria-hidden="true"
            >
                <div 
                    className="w-full h-full bg-primary origin-top timeline-line-fill"
                    style={{ transform: 'scaleY(0)' }}
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

    useEffect(() => {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) return;
        
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
         <div 
            className={cn(
                "relative w-full flex my-8 timeline-item-container",
                isLeft ? "justify-start timeline-item-left" : "justify-end ml-auto timeline-item-right"
            )}
        >
            <div className={cn(
                "w-1/2",
                isLeft ? "pr-8" : "pl-8"
            )}>
                 <div className={cn(
                        "relative w-full group timeline-content"
                    )}>
                        <div className={cn(
                            "absolute top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-primary-foreground z-10 shadow-lg",
                            isLeft ? "right-[-24px]" : "left-[-24px]",
                        )}>
                            <div className={cn("w-full h-full rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:shadow-xl")} style={{backgroundColor: entry.color}}>
                                <Icon className="w-6 h-6 text-primary-foreground transition-transform duration-300 group-hover:rotate-12"/>
                            </div>
                        </div>

                        <div ref={tiltRef} className={cn(
                            "p-6 rounded-lg shadow-lg w-full bg-card transition-shadow duration-300 group-hover:shadow-xl",
                            isLeft ? "text-right" : "text-left"
                        )}>
                            <h3 className="text-2xl font-headline text-foreground">{entry.heading}</h3>
                            <p className="mt-2 text-muted-foreground">{entry.paragraph}</p>
                        </div>
                    </div>
            </div>
        </div>
    );
}
