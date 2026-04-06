"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/courses/CourseCard";
import { fetchApi } from "@/lib/utils";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from "@/components/ui/carousel";

export default function BestSellingCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [api, setApi] = useState(null);

    useEffect(() => { fetchBestSellingCourses(); }, []);

    useEffect(() => {
        if (!api || courses.length === 0) return;
        const interval = window.setInterval(() => api.scrollNext(), 2000);
        return () => window.clearInterval(interval);
    }, [api, courses.length]);

    const fetchBestSellingCourses = async () => {
        try {
            const data = await fetchApi("/courses/by-tag?tag=bestseller&limit=12");
            console.log("BestSelling API Response:", data);
            if (data.success) {
                setCourses(data.data.courses);
                console.log("BestSelling Courses Set:", data.data.courses);
            } else {
                console.warn("BestSelling API - No success:", data);
            }
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

                {/* Carousel */}
                <div className="relative">
                    <Carousel setApi={setApi} opts={{ align: "start", loop: true }} className="w-full">
                        <CarouselContent className="-ml-4">
                            {courses.map((course) => (
                                <CarouselItem key={course.id} className="pl-4 basis-1/2 md:basis-1/3 xl:basis-1/4 py-4">
                                    <CourseCard course={course} badge="bestseller" />
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        <CarouselPrevious className="absolute -left-2 md:left-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-white hover:bg-white hover:text-primary border-gray-200 text-gray-700 shadow-lg z-10" />
                        <CarouselNext className="absolute -right-2 md:right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-white hover:bg-white hover:text-primary border-gray-200 text-gray-700 shadow-lg z-10" />
                    </Carousel>
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
