
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);


const pricingTiers = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    description: 'For individuals and small teams getting started.',
    features: [
      '10 liquid effects',
      'Basic timeline components',
      'Community support',
    ],
    details: [
        { feature: 'Liquid Effects', description: 'Access up to 10 of our mesmerizing liquid visual effects to bring a dynamic feel to your projects.' },
        { feature: 'Timeline Components', description: 'Utilize our basic but powerful vertical timeline components to narrate your story.' },
        { feature: 'Community Support', description: 'Get help and share insights with fellow creators in our community forums.' },
    ],
    buttonText: 'Get Started',
    buttonVariant: 'outline',
    glow: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$25',
    description: 'For professionals who need more power.',
    features: [
      'Unlimited liquid effects',
      'Advanced timeline components',
      'Advanced animations',
      'Priority email support',
    ],
    details: [
        { feature: 'Unlimited Effects', description: 'Unleash your creativity with unlimited access to our entire library of liquid and trail effects.' },
        { feature: 'Advanced Timelines', description: 'Craft more complex narratives with advanced timeline features, including custom icons and animations.' },
        { feature: 'Advanced Animations', description: 'Gain access to a suite of advanced animation controls to fine-tune every interaction and transition.' },
        { feature: 'Priority Support', description: 'Jump the queue with priority email support from our dedicated team of experts.' },
    ],
    buttonText: 'Upgrade to Pro',
    buttonVariant: 'default',
    glow: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations with custom needs.',
    features: [
      'All Pro features',
      'Custom components',
      'Dedicated support',
      'Team collaboration features',
    ],
    details: [
        { feature: 'All Pro Features', description: 'Includes everything in the Pro plan, with no limitations.' },
        { feature: 'Custom Components', description: 'We will work with you to design and build bespoke components tailored to your brand and needs.' },
        { feature: 'Dedicated Support', description: 'A dedicated account manager and support channel to ensure your success.' },
        { feature: 'Team Collaboration', description: 'Advanced features for teams, including shared libraries, collaborative editing, and role-based access control.' },
    ],
    buttonText: 'Contact Us',
    buttonVariant: 'outline',
    glow: false,
  },
];

export default function PricingPage() {
    const [selectedPlan, setSelectedPlan] = useState<string | null>('pro');
    const detailsRef = useRef<HTMLDivElement>(null);
    const plansRef = useRef<HTMLDivElement>(null);

    const handlePlanClick = (planId: string) => {
        setSelectedPlan(prevPlan => (prevPlan === planId ? null : planId));
    };

    useEffect(() => {
        if (selectedPlan && detailsRef.current) {
            const yOffset = detailsRef.current.offsetTop;
            setTimeout(() => {
                gsap.to(window, { duration: 1, scrollTo: { y: yOffset - 120 }, ease: "power3.inOut" });
            }, 300);
        }
    }, [selectedPlan]);

    useEffect(() => {
        gsap.from(plansRef.current, {
            duration: 1,
            opacity: 0,
            y: 50,
            stagger: 0.1,
            delay: 0.2,
            ease: 'power3.out'
        });
    }, []);

    const selectedTier = pricingTiers.find(tier => tier.id === selectedPlan);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <header className="fixed top-8 left-8 z-50">
            <Button asChild variant="outline" className="bg-background/50 hover:bg-background/80 text-foreground backdrop-blur-sm group rounded-full">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back to Home
                </Link>
            </Button>
        </header>

        <main className="flex flex-col items-center text-center pt-16">
          <h1 className="text-5xl md:text-7xl font-headline tracking-tight mb-4 animate-fade-in-up">
            Our Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-12 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            Choose a plan that fits your needs.
          </p>

          <div ref={plansRef} className="grid md:grid-cols-3 gap-8 w-full max-w-6xl">
            {pricingTiers.map((tier) => (
              <div key={tier.id} className="relative group">
                {tier.glow && <div className="absolute -inset-0.5 bg-primary rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition duration-300"></div>}
                <Card 
                  onClick={() => handlePlanClick(tier.id)}
                  className={cn(
                      'relative flex flex-col h-full cursor-pointer transition-all duration-300 rounded-2xl shadow-lg hover:shadow-primary/20 hover:shadow-2xl',
                      'transform hover:-translate-y-2',
                      selectedPlan && selectedPlan !== tier.id ? 'opacity-50 scale-95' : 'opacity-100',
                      selectedPlan === tier.id ? 'ring-2 ring-primary ring-offset-4 ring-offset-background' : '',
                      tier.glow ? 'border-primary/50' : 'border-border'
                  )}
                >
                  <CardHeader className="text-left">
                    <CardTitle className="text-2xl font-headline">{tier.name}</CardTitle>
                    <CardDescription>{tier.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow text-left">
                      <div className="text-5xl font-bold mb-6">{tier.price}<span className="text-lg font-normal text-muted-foreground">{tier.name !== 'Free' && tier.price !== 'Custom' ? '/mo' : ''}</span></div>
                      <ul className="space-y-3">
                          {tier.features.map((feature) => (
                          <li key={feature} className="flex items-center">
                              <Check className="h-5 w-5 mr-3 text-primary flex-shrink-0" />
                              <span>{feature}</span>
                          </li>
                          ))}
                      </ul>
                  </CardContent>
                  <CardFooter>
                    <Button variant={tier.buttonVariant as "default" | "outline"} className="w-full rounded-lg">{tier.buttonText}</Button>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>

            <div ref={detailsRef} className="w-full max-w-4xl mt-24 scroll-mt-24">
                <Collapsible open={!!selectedPlan} className="w-full">
                <CollapsibleContent>
                    {selectedTier && (
                        <Card className="border-primary/50 bg-card/50 rounded-2xl animate-fade-in-up shadow-2xl" style={{animationDuration: '0.8s'}}>
                            <CardHeader>
                                <CardTitle className="text-3xl font-headline text-center">{selectedTier.name} Plan Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-6 text-left">
                                    {selectedTier.details.map(detail => (
                                        <li key={detail.feature} className="p-4 rounded-lg bg-background/50 border border-border/50">
                                            <p className="font-semibold text-lg text-foreground">{detail.feature}</p>
                                            <p className="text-muted-foreground mt-1">{detail.description}</p>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}
                </CollapsibleContent>
                </Collapsible>
            </div>
        </main>
      </div>
    </div>
  );
}
