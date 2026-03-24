"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { CourseCard } from "@/components/courses/CourseCard";

export default function NewLaunchCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchNewLaunchCourses(); }, []);

  /* ── API call unchanged ── */
  const fetchNewLaunchCourses = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/courses/by-tag?tag=new-launch&limit=4`
      );
      const data = await response.json();
      if (data.success) setCourses(data.data.courses);
    } catch (error) {
      console.error("Error fetching new launch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-8 bg-orange-50/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="h-5 w-24 bg-orange-100 rounded-full mb-3 animate-pulse" />
              <div className="h-9 w-48 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-white rounded border border-gray-100 overflow-hidden"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
              >
                <div className="h-48 bg-gray-100" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-100 rounded" />
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
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
    <section className="py-20 bg-orange-50/50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* ── Section header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <span className="section-label mb-3 flex items-center gap-1.5 w-fit">
              <Sparkles className="h-3.5 w-3.5" /> New Launch
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900">
              Latest Courses
            </h2>
            <div className="divider-orange mt-3" />
          </div>
          <Link
            href="/courses?tag=new-launch"
            className="flex items-center gap-1.5 text-sm font-semibold text-orange-600
                       hover:text-orange-700 transition-colors whitespace-nowrap"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* ── 4-column grid using shared CourseCard ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} badge="new" />
          ))}
        </div>
      </div>
    </section>
  );
}
