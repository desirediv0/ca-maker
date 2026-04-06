"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/courses/CourseCard";

export default function CourseSections() {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSections();
    }, []);

    const fetchSections = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/public/product-sections`
            );
            const data = await response.json();
            if (data.success && data.data?.sections) {
                setSections(data.data.sections);
            }
        } catch (error) {
            console.error("Error fetching sections:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || sections.length === 0) return null;

    return (
        <>
            {sections.map((section) => (
                <section key={section.id} className="py-12 md:py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                        {/* Header */}
                        <div className="text-center mb-14">
                            {section.icon && (
                                <span className="section-label mb-4 inline-block text-2xl">
                                    {section.icon}
                                </span>
                            )}
                            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                                {section.name}
                            </h2>
                            {section.description && (
                                <>
                                    <div className="divider-orange mx-auto mb-4" />
                                    <p className="text-gray-500 max-w-2xl mx-auto">
                                        {section.description}
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Grid */}
                        {section.items && section.items.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6 mb-10">
                                {section.items.slice(0, section.maxProducts || 15).map((item) => (
                                    <CourseCard
                                        key={item.product.id}
                                        course={item.product}
                                        badge={section.slug}
                                    />
                                ))}
                            </div>
                        )}

                        {/* View All Button */}
                        {section.items && section.items.length > 0 && (
                            <div className="text-center">
                                <Link href={`/courses?section=${section.slug}`}>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="border-blue-300 text-blue-600 hover:bg-blue-50 px-8 h-12 rounded-2xl font-semibold"
                                    >
                                        View All {section.name}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </section>
            ))}
        </>
    );
}
