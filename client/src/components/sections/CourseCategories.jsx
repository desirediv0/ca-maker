"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Clock, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CourseCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/public/categories`
      );
      const data = await response.json();
      if (data.success) {
        setCategories(data.data.categories.slice(0, 3)); // Show top 3 categories
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-heading mb-4">
              Course Categories
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-gray-100 rounded p-6 h-48"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  const iconMap = [BookOpen, Clock, Users];
  const colorMap = [
    { bg: "from-primary/10 to-accent/10", border: "border-primary/20" },
    { bg: "from-blue-50 to-cyan-50", border: "border-blue-200" },
    { bg: "from-purple-50 to-pink-50", border: "border-purple-200" },
  ];

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
            Our Programs
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-heading mb-4">
            Choose Your <span className="text-gradient">Learning Path</span>
          </h2>
          <p className="text-body max-w-2xl mx-auto">
            Expert-led CA courses designed for success
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {categories.map((category, index) => {
            const Icon = iconMap[index % iconMap.length];
            const colors = colorMap[index % colorMap.length];

            return (
              <Link
                key={category.id}
                href={`/courses?categoryId=${category.id}`}
                className={`group relative bg-gradient-to-br ${colors.bg} rounded p-6 border ${colors.border} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="w-12 h-12 bg-white rounded flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-heading mb-2">{category.name}</h3>
                <p className="text-body text-sm mb-4 line-clamp-2">
                  {category.description || `Explore all courses in ${category.name}`}
                </p>
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>View Courses</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center">
          <Link href="/courses">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white px-8 h-12 rounded-2xl font-semibold gap-2"
            >
              View All Courses <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
