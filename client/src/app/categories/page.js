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
  RiFlashlightLine as Zap,
  RiGraduationCapLine as GraduationCap,
  RiLayoutGridLine as LayoutGrid,
  RiArrowRightSLine,
  RiHome4Line,
  RiStackLine,
  RiFileList3Line,
  RiScales3Line,
  RiCalculatorLine,
  RiMedalLine,
  RiSearchLine,
} from "react-icons/ri";

const getImageUrl = (image) => {
  if (!image) return null;
  if (image.startsWith("http")) return image;
  return `https://desirediv-storage.blr1.digitaloceanspaces.com/${image}`;
};

/* Icon per category name — no emojis */
const getCategoryIcon = (name) => {
  const n = (name || "").toLowerCase();
  if (n.includes("foundation")) return BookOpen;
  if (n.includes("inter")) return RiStackLine;
  if (n.includes("final")) return RiMedalLine;
  if (n.includes("audit")) return RiFileList3Line;
  if (n.includes("tax")) return RiCalculatorLine;
  if (n.includes("law")) return RiScales3Line;
  if (n.includes("account")) return RiCalculatorLine;
  return GraduationCap;
};

const getCategoryAccent = (index) => {
  const accents = [
    { bar: "#2563EB", bg: "rgba(37, 99, 235, 0.07)", border: "rgba(37, 99, 235, 0.12)" },
    { bar: "#3B82F6", bg: "rgba(59, 130, 246, 0.07)", border: "rgba(59, 130, 246, 0.12)" },
    { bar: "#1E40AF", bg: "rgba(30, 64, 175, 0.07)", border: "rgba(30, 64, 175, 0.12)" },
  ];
  return accents[index % 3];
};

/* ─── Category Card ──────────────────────────────────────── */
const CategoryCard = ({ category, index }) => {
  const imgUrl = getImageUrl(category.image);
  const count = category._count?.products || 0;
  const FallbackIcon = getCategoryIcon(category.name);
  const accent = getCategoryAccent(index);

  return (
    <Link href={`/category/${category.slug}`} className="group block h-full">
      <div
        className="relative bg-white rounded-2xl border border-gray-100
                   hover:border-blue-200 hover:-translate-y-1
                   transition-all duration-300 flex flex-col overflow-hidden h-full"
        style={{
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow =
            "0 12px 32px rgba(37, 99, 235, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.04)";
        }}
      >
        {/* Top colored bar */}
        <div className="h-1.5 rounded-t-2xl" style={{ background: accent.bar }} />

        {/* Card body */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Icon */}
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center mb-5
                       transition-transform duration-300 group-hover:scale-105"
            style={{
              background: accent.bg,
              border: `1px solid ${accent.border}`,
            }}
          >
            {imgUrl ? (
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <Image
                  src={imgUrl}
                  alt={category.name}
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                  sizes="56px"
                />
              </div>
            ) : (
              <FallbackIcon className="w-7 h-7 text-blue-500" />
            )}
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
            {category.name}
          </h3>

          <span
            className="inline-flex w-fit items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold mb-3"
            style={{
              background: accent.bg,
              color: accent.bar,
              border: `1px solid ${accent.border}`,
            }}
          >
            <BookOpen className="w-3 h-3" />
            {count} {count === 1 ? "Course" : "Courses"}
          </span>

          <p className="text-sm text-gray-400 leading-relaxed line-clamp-2 flex-grow">
            {category.description ||
              "Explore CA courses and study material in this category."}
          </p>

          <span className="inline-flex items-center gap-1.5 text-blue-600 font-semibold text-sm mt-5 group-hover:gap-3 transition-all duration-200">
            Explore
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
};

/* ─── Skeleton ───────────────────────────────────────────── */
const CategoryCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
    <div className="h-1.5 bg-blue-100 rounded-t-2xl" />
    <div className="p-6 animate-pulse">
      <div className="w-14 h-14 bg-blue-50 rounded-xl mb-5" />
      <div className="h-5 bg-gray-100 rounded-lg w-3/4 mb-3" />
      <div className="h-6 bg-blue-50 rounded-lg w-24 mb-3" />
      <div className="h-3 bg-gray-50 rounded w-full mb-1.5" />
      <div className="h-3 bg-gray-50 rounded w-5/6 mb-5" />
      <div className="h-4 bg-blue-50 rounded w-20" />
    </div>
  </div>
);

/* ─── Stats Banner ───────────────────────────────────────── */
const StatsBanner = ({ categories }) => {
  const totalProducts = categories.reduce(
    (s, c) => s + (c._count?.products || 0),
    0
  );
  const items = [
    { icon: LayoutGrid, value: categories.length, label: "Categories" },
    { icon: GraduationCap, value: totalProducts, label: "Total Courses" },
    { icon: Zap, value: "100%", label: "Practical" },
    { icon: Headphones, value: "24/7", label: "Support" },
  ];

  return (
    <div
      className="mt-14 rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #EFF6FF, #FFFFFF, #EFF6FF)",
        border: "1px solid rgba(59, 130, 246, 0.08)",
      }}
    >
      <div className="grid grid-cols-2 md:grid-cols-4">
        {items.map(({ icon: Icon, value, label }, i) => (
          <div
            key={i}
            className="flex flex-col items-center py-8 px-6 text-center relative"
          >
            {/* Dividers */}
            {i < items.length - 1 && (
              <div className="hidden md:block absolute right-0 top-6 bottom-6 w-px bg-blue-100/60" />
            )}
            {i % 2 === 0 && i < 2 && (
              <div className="md:hidden absolute right-0 top-6 bottom-6 w-px bg-blue-100/60" />
            )}
            {i < 2 && (
              <div className="md:hidden absolute bottom-0 left-6 right-6 h-px bg-blue-100/60" />
            )}

            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
              style={{
                background: "rgba(37, 99, 235, 0.07)",
                border: "1px solid rgba(37, 99, 235, 0.1)",
              }}
            >
              <Icon className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-0.5 leading-none tracking-tight">
              {value}
            </p>
            <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">
              {label}
            </p>
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
      <section className="relative overflow-hidden" style={{
        background: "linear-gradient(135deg, #1E3A8A 0%, #1E40AF 30%, #2563EB 70%, #3B82F6 100%)",
      }}>
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          {/* Corner glow */}
          <div
            className="absolute -top-20 -right-20 w-[400px] h-[400px] opacity-20"
            style={{
              background: "radial-gradient(circle, rgba(96,165,250,0.6), transparent 70%)",
            }}
          />
          <div
            className="absolute -bottom-16 -left-16 w-[300px] h-[300px] opacity-10"
            style={{
              background: "radial-gradient(circle, rgba(147,197,253,0.5), transparent 70%)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-22">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-8">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1.5">
              <RiHome4Line className="w-3.5 h-3.5" />
              Home
            </Link>
            <RiArrowRightSLine className="w-3.5 h-3.5" />
            <span className="text-white font-medium">Categories</span>
          </nav>

          {/* Ornamental divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-white/30" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-blue-200/60">
              Browse & Learn
            </span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-white/30" />
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Explore All Categories
          </h1>
          <p className="text-base md:text-lg text-blue-100/70 max-w-xl leading-relaxed">
            Find the right CA course for your preparation level — structured,
            practical, and exam-focused.
          </p>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/5 to-transparent" />
      </section>

      {/* ── Error ── */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div
            className="p-5 rounded-xl flex items-start gap-3"
            style={{
              background: "rgba(239, 68, 68, 0.04)",
              border: "1px solid rgba(239, 68, 68, 0.12)",
            }}
          >
            <AlertCircle className="text-red-500 flex-shrink-0 w-5 h-5 mt-0.5" />
            <div>
              <p className="font-semibold text-red-700 text-sm">
                Error loading categories
              </p>
              <p className="text-red-500 text-sm mt-0.5">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Grid ── */}
      <section className="py-14 md:py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-24">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{
                background: "rgba(37, 99, 235, 0.06)",
                border: "1px solid rgba(37, 99, 235, 0.1)",
              }}
            >
              <RiSearchLine className="w-9 h-9 text-blue-300" />
            </div>
            <h2 className="text-xl text-gray-800 font-bold mb-2">
              No categories found
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              Check back soon — new categories are added regularly.
            </p>
            <Link href="/courses">
              <button
                className="group px-7 py-3 text-white rounded-xl font-semibold text-sm
                           transition-all duration-300 hover:scale-[1.03] inline-flex items-center gap-2"
                style={{
                  background:
                    "linear-gradient(135deg, #1E40AF, #2563EB, #3B82F6)",
                  boxShadow:
                    "0 4px 16px rgba(37, 99, 235, 0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
                }}
              >
                Browse All Courses
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* Section header */}
            <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-px w-8 bg-gradient-to-r from-transparent to-blue-400/40" />
                  <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-blue-500/50">
                    All Categories
                  </span>
                  <div className="h-px w-8 bg-gradient-to-l from-transparent to-blue-400/40" />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Choose Your{" "}
                  <span
                    style={{
                      background:
                        "linear-gradient(135deg, #1E40AF, #3B82F6, #60A5FA)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Path
                  </span>
                </h2>
              </div>

              <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                {categories.length} categories available — pick your level and start learning.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  index={index}
                />
              ))}
            </div>

            <StatsBanner categories={categories} />
          </>
        )}
      </section>
    </div>
  );
}