"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/courses/CourseCard";

export default function BestSellingCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchBestSellingCourses(); }, []);

    const fetchBestSellingCourses = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/courses/by-tag?tag=bestseller&limit=3`
            );
            const data = await response.json();
            if (data.success) setCourses(data.data.courses);
        } catch (error) {
            console.error("Error fetching best selling courses:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                    <div className="text-center mb-14">
                        <div className="h-5 w-36 bg-blue-100 rounded-full mx-auto mb-4 animate-pulse" />
                        <div className="h-10 w-72 bg-gray-100 rounded mx-auto animate-pulse" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="animate-pulse bg-white rounded-[10px] overflow-hidden border border-gray-100"
                                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
                            >
                                <div className="h-48 bg-gray-100" />
                                <div className="p-5 space-y-3">
                                    <div className="h-5 bg-gray-100 rounded" />
                                    <div className="h-4 bg-gray-100 rounded w-2/3" />
                                    <div className="h-10 bg-blue-100 rounded mt-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (courses.length === 0) return null;

    return (
        <section className="py-12 md:py-16 bg-white">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">

                {/* Header */}
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 border border-orange-200 rounded-full text-orange-600 text-sm font-medium mb-3">
                        <Award className="w-4 h-4" />
                        Best Sellers
                    </div>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Most <span className="text-gradient">Popular Courses</span>
                    </h2>
                    <div className="divider-orange mx-auto mb-4" />
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Top-rated courses loved by students worldwide
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6">
                    {courses.map((course) => (
                        <CourseCard key={course.id} course={course} badge="bestseller" />
                    ))}
                </div>

                <div className="text-center mt-10">
                    <Link href="/courses?tag=bestseller">
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-blue-300 text-blue-600 hover:bg-blue-50 px-8 h-12
               rounded-2xl font-semibold"
                        >
                            View All Best Sellers <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
