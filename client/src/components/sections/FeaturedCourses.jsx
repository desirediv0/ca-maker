"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/courses/CourseCard";

export default function FeaturedCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchFeaturedCourses(); }, []);

  /* ── API call unchanged ── */
  const fetchFeaturedCourses = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/courses?limit=3&featured=true`
      );
      const data = await response.json();
      if (data.success) setCourses(data.data.courses);
    } catch (error) {
      console.error("Error fetching featured courses:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-orange-50/60">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-14">
            <div className="h-5 w-36 bg-orange-100 rounded-full mx-auto mb-4 animate-pulse" />
            <div className="h-10 w-72 bg-gray-100 rounded-xl mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
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
                  <div className="h-10 bg-orange-100 rounded-xl mt-4" />
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
    <section className="py-8 bg-orange-50/60">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* ── Header ── */}
        <div className="text-center mb-14">
          <span className="section-label mb-4 inline-block">Featured Courses</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Start Your <span className="text-gradient">CA Journey Today</span>
          </h2>
          <div className="divider-orange mx-auto mb-4" />
          <p className="text-gray-500 max-w-2xl mx-auto">
            Expert-designed programs tailored for serious CA aspirants
          </p>
        </div>

        {/* ── Responsive grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} badge="featured" />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/courses">
            <Button
              variant="outline"
              size="lg"
              className="border-orange-300 text-orange-600 hover:bg-orange-50 px-8 h-12 rounded-xl font-semibold"
            >
              View All Courses <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
