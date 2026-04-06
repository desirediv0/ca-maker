"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { CourseCard } from "@/components/courses/CourseCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

export default function HotSellingCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [api, setApi] = useState(null);

  useEffect(() => { fetchHotSellingCourses(); }, []);

  useEffect(() => {
    if (!api || courses.length === 0) return;
    const interval = window.setInterval(() => api.scrollNext(), 2000);
    return () => window.clearInterval(interval);
  }, [api, courses.length]);

  /* ── API call unchanged ── */
  const fetchHotSellingCourses = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/courses/by-tag?tag=hot-selling&limit=12`
      );
      const data = await response.json();
      if (data.success) setCourses(data.data.courses);
    } catch (error) {
      console.error("Error fetching hot selling courses:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="h-5 w-28 bg-blue-100 rounded-full mb-3 animate-pulse" />
              <div className="h-9 w-56 bg-gray-100 rounded animate-pulse" />
              <div className="h-1 w-10 bg-blue-100 rounded mt-3 animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-white rounded-[10px] border border-gray-100 overflow-hidden"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
              >
                <div className="h-48 bg-gray-100" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-100 rounded" />
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-8 bg-blue-50 rounded w-1/2 mt-4" />
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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">

        {/* ── Section header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <span className="section-label mb-3 flex items-center gap-1.5 w-fit">
              <Flame className="h-3.5 w-3.5" /> Most Popular
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900">
              Hot Selling Lectures
            </h2>
            <div className="divider-orange mt-3" />
          </div>
          <Link
            href="/courses?tag=hot-selling"
            className="flex items-center gap-1.5 text-sm font-semibold text-blue-600
                       hover:text-blue-700 transition-colors whitespace-nowrap"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* ── Responsive carousel ── */}
        <div className="relative">
          <Carousel setApi={setApi} opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-4">
              {courses.map((course) => (
                <CarouselItem key={course.id} className="pl-4 basis-1/2 md:basis-1/3 xl:basis-1/4 py-4">
                  <CourseCard course={course} badge="hot" />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-2 md:left-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-white hover:bg-white hover:text-primary border-gray-200 text-gray-700 shadow-lg z-10" />
            <CarouselNext className="absolute -right-2 md:right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-white hover:bg-white hover:text-primary border-gray-200 text-gray-700 shadow-lg z-10" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
