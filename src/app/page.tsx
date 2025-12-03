

"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Blend, Brush, Milestone, Telescope, ArrowDown } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { VerticalTimeline, TimelineEntry } from "@/components/ui/vertical-timeline";
import { StaggeredMenu, StaggeredMenuItem, StaggeredMenuSocialItem } from "@/components/ui/StaggeredMenu";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState, useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ParticleHero } from "@/components/ui/particle-hero";

gsap.registerPlugin(ScrollToPlugin);


const storyEntries: TimelineEntry[] = [
    {
        icon: Brush,
        heading: "The Spark",
        paragraph: "The Volrx was born from a passion for blending art and technology. We saw an opportunity to create digital experiences that were both beautiful and meaningful.",
        color: "hsl(var(--primary))"
    },
    {
        icon: Blend,
        heading: "First Creation",
        paragraph: "Our first project was a simple liquid simulation. It taught us the power of fluid dynamics in creating mesmerizing visuals and set the stage for future work.",
        color: "hsl(var(--card))"
    },
    {
        icon: Milestone,
        heading: "A New Milestone",
        paragraph: "We introduced the trail effect, a more complex animation that explored motion and persistence. This milestone marked our growth in creating dynamic art.",
        color: "hsl(var(--foreground))"
    },
    {
        icon: Telescope,
        heading: "Future Vision",
        paragraph: "We continue to explore new frontiers in digital art. Join us as we venture into even more complex and interactive visual experiences that inspire and captivate.",
        color: "hsl(var(--primary))"
    },
];

const menuItems: StaggeredMenuItem[] = [
  { label: 'Pricing', ariaLabel: 'Pricing', link: '/pricing' },
]

const socialItems: StaggeredMenuSocialItem[] = []

export default function Home() {
  const foundersImage = PlaceHolderImages.find(p => p.id === 'founders-section');

  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (isHeroVisible) {
      gsap.set(contentRef.current, { visibility: 'hidden' });
      document.body.style.overflow = 'hidden';
      lastScrollY.current = 0;
    } else {
        gsap.set(contentRef.current, { visibility: 'visible' });
        document.body.style.overflow = 'auto';
    }
  }, [isHeroVisible]);

  const handleHeroClick = () => {
    if (!isHeroVisible || !heroRef.current || !contentRef.current || (animationRef.current && animationRef.current.isActive())) return;

    animationRef.current = gsap.timeline({
        onComplete: () => {
            setIsHeroVisible(false);
        }
    });

    animationRef.current.to(heroRef.current, {
      duration: 1.2,
      scale: 1.1,
      opacity: 0.8,
      ease: 'power3.inOut'
    })
    .add(() => {
        gsap.set(contentRef.current, { visibility: 'visible', opacity: 0, y: '50px' });
        gsap.to(window, { duration: 0.1, scrollTo: { y: 0, autoKill: false } });
    })
    .to(heroRef.current, {
        duration: 1.5,
        y: '-100%',
        ease: 'power3.inOut'
    }, "-=0.5")
    .to(contentRef.current, {
        duration: 1.5,
        y: '0px',
        opacity: 1,
        ease: 'power3.out'
    }, "<");
  };

  const showHeroAgain = useCallback(() => {
    if (isHeroVisible || !heroRef.current || !contentRef.current || (animationRef.current && animationRef.current.isActive())) return;

    setIsHeroVisible(true);
    
    animationRef.current = gsap.timeline();

    animationRef.current.to(contentRef.current, {
        duration: 1.5,
        y: '50px',
        opacity: 0,
        ease: 'power3.in'
    })
    .to(heroRef.current, {
        duration: 1.5,
        y: '0%',
        ease: 'power3.inOut'
    }, "-=1.0")
    .to(heroRef.current, {
      duration: 1.2,
      scale: 1,
      opacity: 1,
      ease: 'power3.inOut'
    }, "-=0.5");
  }, [isHeroVisible]);

  useEffect(() => {
    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY < lastScrollY.current && currentScrollY < 5 && !isHeroVisible) {
            if (!animationRef.current || !animationRef.current.isActive()) {
                showHeroAgain();
            }
        }
        lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
        window.removeEventListener('scroll', handleScroll);
    };
  }, [isHeroVisible, showHeroAgain]);


  return (
    <div className="w-full flex flex-col items-center">
        <StaggeredMenu 
            isFixed={true} 
            items={menuItems}
            socialItems={socialItems}
            />
      
      <div ref={heroRef} className={`fixed top-0 left-0 w-full h-screen z-20 ${!isHeroVisible ? 'pointer-events-none' : ''}`}>
          <ParticleHero onEnterClick={handleHeroClick} />
        </div>
      
      <div ref={contentRef} className="w-full bg-background z-10 invisible">
        <section id="our-story" className="w-full min-h-screen">
            <div className="container mx-auto px-4 md:px-6 py-20 lg:py-32">
              <div className="flex flex-col items-center text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-headline tracking-tight text-foreground">Our Story</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mt-4">
                  Our journey is one of constant exploration, pushing the boundaries of what's possible to create immersive and unforgettable visual effects.
                </p>
              </div>
              <VerticalTimeline entries={storyEntries} />
            </div>
        </section>

        <section id="investment-philosophy" className="w-full py-20 lg:py-32 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="relative order-2 md:order-1">
                {foundersImage && (
                  <Image 
                    src={foundersImage.imageUrl}
                    alt={foundersImage.description}
                    width={600}
                    height={750}
                    className="rounded-lg shadow-lg object-cover aspect-[4/5] animate-image-fade-in"
                    data-ai-hint={foundersImage.imageHint}
                  />
                )}
              </div>
              <div className="order-1 md:order-2">
                <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-2xl lg:text-3xl font-headline text-foreground hover:text-primary transition-colors">How We Work</AccordionTrigger>
                    <AccordionContent className="text-base lg:text-lg text-muted-foreground pt-2">
                      We partner with founders from day one, providing not just capital, but strategic guidance and operational support. Our approach is hands-on and collaborative, ensuring we're aligned in vision and execution. We believe in building strong foundations for long-term growth.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-2xl lg:text-3xl font-headline text-foreground hover:text-primary transition-colors">Why Founders Work With Us</AccordionTrigger>
                    <AccordionContent className="text-base lg:text-lg text-muted-foreground pt-2">
                      Founders choose us for our deep industry expertise, extensive network, and unwavering commitment to their success. We're more than investors; we're co-pilots on the entrepreneurial journey, helping navigate challenges and seize opportunities.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-2xl lg:text-3xl font-headline text-foreground hover:text-primary transition-colors">What We Look For</AccordionTrigger>
                    <AccordionContent className="text-base lg:text-lg text-muted-foreground pt-2">
                      We seek visionary founders with a relentless drive to solve meaningful problems. We look for scalable business models, strong technical foundations, and a clear path to market leadership. Above all, we invest in people with integrity and a passion for innovation.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
