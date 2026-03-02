"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchApi } from "@/lib/utils";
import {
  RiAlertLine as AlertCircle,
  RiArrowRightLine as ArrowRight,
  RiBookOpenLine as BookOpen,
  RiHeadphoneLine as Headphones,
  RiGroupLine as Users,
  RiFlashlightLine as Zap,
  RiGraduationCapLine as GraduationCap,
  RiLayoutGridLine as LayoutGrid,
} from "react-icons/ri";

const getImageUrl = (image) => {
  if (!image) return null;
  if (image.startsWith("http")) return image;
  return `https://desirediv-storage.blr1.digitaloceanspaces.com/${image}`;
};

/* ─── Category Card ──────────────────────────────────────── */
const CategoryCard = ({ category, index }) => {
  const imgUrl = getImageUrl(category.image);
  const count = category._count?.products || 0;

  return (
    <Link href={`/category/${category.slug}`} className="group block h-full">
      <div
        className="relative bg-white border border-gray-100 rounded-xl overflow-hidden h-full
                   transition-all duration-300 flex flex-col"
        style={{
          boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
          transitionDelay: `${index * 30}ms`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow =
            "0 8px 30px rgba(249,115,22,0.12), 0 2px 8px rgba(0,0,0,0.06)";
          e.currentTarget.style.transform = "translateY(-3px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 1px 6px rgba(0,0,0,0.06)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {/* Image / Icon area */}
        <div className="relative h-48 w-full bg-orange-50/60 flex-shrink-0 overflow-hidden">
          {imgUrl ? (
            <Image
              src={imgUrl}
              alt={category.name}
              fill
              className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                <GraduationCap className="w-10 h-10 text-orange-500" />
              </div>
            </div>
          )}

          {/* Count pill */}
          <div className="absolute top-3 right-3 bg-white border border-orange-100 text-orange-600
                          text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
            {count} {count === 1 ? "course" : "courses"}
          </div>
        </div>

        {/* Orange bottom border that grows on hover */}
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 scale-x-0 origin-left
                     group-hover:scale-x-100 transition-transform duration-300"
        />

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-base font-bold text-gray-900 mb-1.5 group-hover:text-orange-500
                         transition-colors duration-200 line-clamp-1">
            {category.name}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2 flex-grow">
            {category.description || "Explore CA courses and study material in this category."}
          </p>
          <span className="inline-flex items-center gap-1.5 text-orange-500 font-semibold text-sm
                           group-hover:gap-2.5 transition-all duration-200">
            View Courses <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
};

/* ─── Skeleton ───────────────────────────────────────────── */
const CategoryCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
    <div className="h-48 bg-orange-50" />
    <div className="p-5">
      <div className="h-4 bg-gray-200 rounded-md w-3/4 mb-2" />
      <div className="h-3 bg-gray-100 rounded-md w-full mb-1" />
      <div className="h-3 bg-gray-100 rounded-md w-5/6 mb-4" />
      <div className="h-3.5 bg-orange-100 rounded-md w-1/3" />
    </div>
  </div>
);

/* ─── Stats Banner ───────────────────────────────────────── */
const StatsBanner = ({ categories }) => {
  const totalProducts = categories.reduce((s, c) => s + (c._count?.products || 0), 0);
  const items = [
    { icon: LayoutGrid, value: categories.length, label: "Categories" },
    { icon: GraduationCap, value: totalProducts, label: "Total Courses" },
    { icon: Zap, value: "100%", label: "Practical" },
    { icon: Headphones, value: "24/7", label: "Support" },
  ];

  return (
    <div className="mt-10 border-t border-gray-100">
      <div className="grid grid-cols-2 md:grid-cols-4">
        {items.map(({ icon: Icon, value, label }, i) => (
          <div
            key={i}
            className={`flex flex-col items-center py-7 px-6 text-center
                        ${i < items.length - 1 ? "md:border-r border-gray-100" : ""}
                        ${i % 2 === 0 ? "border-r border-gray-100 md:border-r-0" : ""}
                        ${i < 2 ? "border-b border-gray-100 md:border-b-0" : ""}`}
          >
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <Icon className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-3xl md:text-4xl font-black text-gray-900 mb-1 leading-none">{value}</p>
            <p className="text-sm text-gray-400 font-medium">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Page ───────────────────────────────────────────────── */
export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetchApi("/public/categories");
        setCategories(response.data.categories || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(err.message || "Failed to load categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <section className="py-10 bg-[#F9FAFB] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-5">
            <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-700 font-medium">Categories</span>
          </div>

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 border border-orange-200
                            rounded-full text-orange-600 text-xs font-bold uppercase tracking-widest mb-6">
              <GraduationCap className="w-3.5 h-3.5" />
              CA Study Material
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-5 leading-tight tracking-tight">
              Explore CA{" "}
              <span className="text-orange-500">Categories</span>
            </h1>

            <p className="text-lg text-gray-500 leading-relaxed max-w-xl">
              Browse curated categories of CA courses and study material crafted
              with Big&nbsp;4 practical experience.
            </p>
          </div>
        </div>
      </section>

      {/* ── Error ── */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 p-5 rounded-xl flex items-start gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0 w-5 h-5 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800 text-sm">Error loading categories</p>
              <p className="text-red-600 text-sm mt-0.5">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <CategoryCardSkeleton key={i} />)}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-24 bg-[#F9FAFB] rounded-xl border border-gray-100">
            <div className="w-16 h-16 mx-auto mb-5 bg-orange-100 rounded-xl flex items-center justify-center">
              <Users className="w-8 h-8 text-orange-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Categories Found</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto text-sm">
              Categories are being added soon. Browse all courses in the meantime.
            </p>
            <Link href="/courses">
              <button className="px-7 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl
                                 font-semibold transition-colors text-sm">
                Browse All Courses
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* Section label */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">
                  All Categories
                </p>
                <h2 className="text-2xl font-bold text-gray-900">
                  {categories.length} Categories Available
                </h2>
              </div>
              <Link
                href="/courses"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold
                           text-orange-500 hover:text-orange-600 transition-colors"
              >
                All Courses <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map((category, index) => (
                <CategoryCard key={category.id} category={category} index={index} />
              ))}
            </div>

            <StatsBanner categories={categories} />
          </>
        )}
      </div>

      {/* ── Bottom CTA ── */}
      <section className="py-10 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-3">
            Start Learning Today
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Can&apos;t find your category?
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto mb-8 text-sm">
            Browse all courses across every CA subject — structured, practical
            and exam-focused.
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-orange-500
                       hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors"
          >
            View All Courses <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
