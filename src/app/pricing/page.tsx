
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
  },
  {
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
  },
  {
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
  },
];

export default function PricingPage() {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const detailsRef = useRef<HTMLDivElement>(null);

    const handlePlanClick = (planName: string) => {
        setSelectedPlan(prevPlan => (prevPlan === planName ? null : planName));
    };

    useEffect(() => {
        if (selectedPlan && detailsRef.current) {
            const yOffset = detailsRef.current.offsetTop;
            setTimeout(() => {
                gsap.to(window, { duration: 1.5, scrollTo: { y: yOffset - 80 }, ease: "power2.inOut" });
            }, 300);
        }
    }, [selectedPlan]);

    const selectedTier = pricingTiers.find(tier => tier.name === selectedPlan);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <header className="fixed top-8 left-8 z-50">
            <Button asChild variant="outline" className="bg-background/50 hover:bg-background/80 text-foreground backdrop-blur-sm group">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back to Home
                </Link>
            </Button>
        </header>

        <main className="flex flex-col items-center text-center mt-16">
          <h1 className="text-5xl md:text-7xl font-headline tracking-tight mb-4">
            Our Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-12">
            Choose a plan that fits your needs.
          </p>

          <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl">
            {pricingTiers.map((tier) => (
              <Card 
                key={tier.name} 
                onClick={() => handlePlanClick(tier.name)}
                className={cn(
                    'flex flex-col cursor-pointer transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg hover:scale-105',
                    tier.name === 'Pro' ? 'border-primary shadow-lg' : 'shadow-md',
                    selectedPlan === tier.name ? 'border-primary ring-2 ring-primary scale-105' : ''
                )}
              >
                <CardHeader>
                  <CardTitle className="text-2xl font-headline">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                    <div className="text-4xl font-bold mb-6">{tier.price}<span className="text-lg font-normal text-muted-foreground">{tier.name !== 'Free' && tier.price !== 'Custom' ? '/mo' : ''}</span></div>
                    <ul className="space-y-3 text-left">
                        {tier.features.map((feature) => (
                        <li key={feature} className="flex items-center">
                            <Check className="h-5 w-5 mr-2 text-primary" />
                            <span>{feature}</span>
                        </li>
                        ))}
                    </ul>
                </CardContent>
                <CardFooter>
                  <Button variant={tier.buttonVariant as "default" | "outline"} className="w-full">{tier.buttonText}</Button>
                </CardFooter>
              </Card>
            ))}
          </div>

            <div ref={detailsRef} className="w-full max-w-4xl mt-8 scroll-mt-24">
                <Collapsible open={!!selectedPlan} className="w-full">
                <CollapsibleContent>
                    {selectedTier && (
                        <Card className="border-primary animate-fade-in-up" style={{animationDuration: '0.8s'}}>
                            <CardHeader>
                                <CardTitle className="text-3xl font-headline">{selectedTier.name} Plan Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-4 text-left">
                                    {selectedTier.details.map(detail => (
                                        <li key={detail.feature}>
                                            <p className="font-semibold text-lg text-foreground">{detail.feature}</p>
                                            <p className="text-muted-foreground">{detail.description}</p>
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
