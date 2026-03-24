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

/* Icon/emoji per category name */
const getCategoryIcon = (name) => {
  const n = (name || "").toLowerCase();
  if (n.includes("foundation")) return "📚";
  if (n.includes("inter")) return "🎯";
  if (n.includes("final")) return "🏆";
  if (n.includes("audit")) return "📋";
  if (n.includes("tax")) return "💰";
  if (n.includes("law")) return "⚖️";
  if (n.includes("account")) return "🧮";
  return null;
};

const getCategoryBarClass = (index) => {
  const shades = ["bg-orange-400", "bg-orange-500", "bg-orange-600"];
  return shades[index % 3];
};

/* ─── Category Card ──────────────────────────────────────── */
const CategoryCard = ({ category, index }) => {
  const imgUrl = getImageUrl(category.image);
  const count = category._count?.products || 0;
  const emoji = getCategoryIcon(category.name);
  const barClass = getCategoryBarClass(index);

  return (
    <Link href={`/category/${category.slug}`} className="group block h-full">
      <div
        className="relative bg-white rounded-2xl border border-gray-100 shadow-sm
                   hover:shadow-xl hover:border-orange-200 hover:-translate-y-1
                   transition-all duration-300 flex flex-col overflow-hidden h-full"
      >
        {/* Top colored bar */}
        <div className={`h-2 rounded-t-2xl ${barClass}`} />

        {/* Card body */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Icon circle */}
          <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-4">
            {imgUrl ? (
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <Image
                  src={imgUrl}
                  alt={category.name}
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                  sizes="56px"
                />
              </div>
            ) : emoji ? (
              <span className="text-2xl">{emoji}</span>
            ) : (
              <GraduationCap className="w-7 h-7 text-orange-500" />
            )}
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors duration-200">
            {category.name}
          </h3>

          <span className="inline-flex w-fit bg-orange-50 text-orange-600 rounded-full px-3 py-1 text-xs font-medium mb-3">
            {count} {count === 1 ? "Course" : "Courses"}
          </span>

          {category.description && (
            <p className="text-sm text-gray-500 mt-2 line-clamp-2 flex-grow">
              {category.description}
            </p>
          )}
          {!category.description && (
            <p className="text-sm text-gray-500 mt-2 line-clamp-2 flex-grow">
              Explore CA courses and study material in this category.
            </p>
          )}

          <span className="inline-flex items-center gap-1.5 text-orange-500 font-medium text-sm mt-4 group-hover:gap-3 transition-all duration-200">
            Explore <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
};

/* ─── Skeleton ───────────────────────────────────────────── */
const CategoryCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
    <div className="h-2 bg-orange-200 rounded-t-2xl" />
    <div className="p-6">
      <div className="w-14 h-14 bg-orange-100 rounded-2xl mb-4" />
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-6 bg-orange-100 rounded-full w-20 mb-3" />
      <div className="h-3 bg-gray-100 rounded w-full mb-1" />
      <div className="h-3 bg-gray-100 rounded w-5/6 mb-4" />
      <div className="h-4 bg-orange-100 rounded w-24" />
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

      {/* ── Hero Banner ── */}
      <section className="relative bg-gradient-to-r from-orange-500 to-orange-600 py-14 md:py-20 overflow-hidden">
        {/* Diagonal lines pattern overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 20px,
              rgba(255,255,255,0.3) 20px,
              rgba(255,255,255,0.3) 40px
            )`,
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-3">
            Explore All Categories
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mb-8">
            Find the right CA course for your preparation level
          </p>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/70">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white font-medium">Categories</span>
          </nav>
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
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <CategoryCardSkeleton key={i} />)}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4 opacity-40">📂</div>
            <h2 className="text-xl text-gray-400 font-semibold">No categories found</h2>
            <p className="text-sm text-gray-400 mt-2">Check back soon</p>
            <Link href="/courses" className="inline-block mt-6">
              <button className="px-7 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors text-sm">
                Browse All Courses
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">All Categories</h2>
              <div className="w-12 h-1 bg-orange-500 mt-2 mb-8 rounded" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <CategoryCard key={category.id} category={category} index={index} />
              ))}
            </div>

            <StatsBanner categories={categories} />
          </>
        )}
      </section>

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
