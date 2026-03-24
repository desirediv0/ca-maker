import { RiMusic2Line as Music2, RiMagicLine as PartyPopper, RiBuilding2Line as Building2, RiCommunityLine as Church, RiGovernmentLine as School, RiTruckLine as Truck, RiArrowRightLine as ArrowRight } from "react-icons/ri";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/ui/PageHero";

export const metadata = {
    title: "Industries We Serve | CA-Maker Audio Equipment",
    description: "Professional audio solutions for events, DJs, venues, schools, houses of worship, and more.",
};

const industries = [
    {
        icon: PartyPopper,
        name: "Events & Weddings",
        description: "Make every celebration memorable with powerful, crystal-clear sound systems.",
        features: ["High-output speakers", "Portable solutions", "Professional amplifiers"],
        link: "/products?category=dj-speakers",
    },
    {
        icon: Music2,
        name: "DJs & Performers",
        description: "Professional-grade equipment trusted by top performers across India.",
        features: ["NEO Series", "Challenger Series", "Trolley Speakers"],
        link: "/products?category=neo-series",
    },
    {
        icon: Building2,
        name: "Venues & Clubs",
        description: "Permanent installations built to perform night after night.",
        features: ["PA Systems", "Driver Units", "Power Amplifiers"],
        link: "/products?category=pa-series",
    },
    {
        icon: Church,
        name: "Houses of Worship",
        description: "Clear speech and music systems designed for religious venues.",
        features: ["PA Series", "PD Series", "Column Speakers"],
        link: "/products?category=pd-series",
    },
    {
        icon: School,
        name: "Schools & Colleges",
        description: "Auditorium and PA systems for educational institutions.",
        features: ["Megaphones", "PA Systems", "Ceiling Speakers"],
        link: "/products?category=megaphones",
    },
    {
        icon: Truck,
        name: "Mobile Sound",
        description: "Portable battery-powered solutions for DJs on the go.",
        features: ["Trolley Speakers", "Battery Systems", "Wireless Mics"],
        link: "/products?category=trolley-speakers",
    },
];

export default function IndustriesPage() {
    return (
        <div className="bg-page min-h-screen">
            <PageHero
                title="Industries We Serve"
                description="Professional audio solutions tailored for your specific needs"
                breadcrumbs={[{ label: "Industries" }]}
                variant="default"
                size="md"
            />

            {/* Industries Grid */}
            <section className="py-12 md:py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {industries.map((industry, index) => (
                            <Link
                                key={index}
                                href={industry.link}
                                className="group bg-white border border-gray-100 rounded p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="w-16 h-16 bg-primary/10 rounded flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                                    <industry.icon className="h-8 w-8 text-primary group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="font-display font-bold text-xl text-foreground mb-3">
                                    {industry.name}
                                </h3>
                                <p className="text-muted-foreground mb-6 leading-relaxed">
                                    {industry.description}
                                </p>
                                <div className="space-y-2 mb-6">
                                    {industry.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            <span className="text-muted-foreground">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                                    Shop Products
                                    <ArrowRight className="h-4 w-4" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-gray-50/50 py-12 md:py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
                            Need Help Choosing?
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            Our audio experts can recommend the perfect equipment setup for your specific use case and budget.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/contact">
                                <Button size="lg" className="rounded-full px-8">
                                    Get Expert Advice
                                </Button>
                            </Link>
                            <Link href="/courses">
                                <Button variant="outline" size="lg" className="rounded-full px-8">
                                    Browse All Products
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
