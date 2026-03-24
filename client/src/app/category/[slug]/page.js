"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { fetchApi } from "@/lib/utils";
import {
  RiAlertLine as AlertCircle,
  RiArrowDownSLine as ChevronDown,
  RiArrowLeftSLine as ChevronLeft,
  RiArrowRightSLine as ChevronRight,
  RiGridLine as Grid,
  RiListCheck as List,
  RiGraduationCapLine as GraduationCap,
  RiBookOpenLine as BookOpen,
  RiArrowRightLine as ArrowRight,
} from "react-icons/ri";
import { ProductCard } from "@/components/products/ProductCard";

const getImageUrl = (image) => {
  if (!image) return null;
  if (image.startsWith("http")) return image;
  return `https://desirediv-storage.blr1.digitaloceanspaces.com/${image}`;
};

const getCategoryEmoji = (name) => {
  const n = (name || "").toLowerCase();
  if (n.includes("foundation")) return "📚";
  if (n.includes("inter")) return "🎯";
  if (n.includes("final")) return "🏆";
  if (n.includes("audit")) return "📋";
  if (n.includes("tax")) return "💰";
  if (n.includes("law")) return "⚖️";
  if (n.includes("account")) return "🧮";
  return "📖";
};

/* Strip HTML tags + decode common entities → plain text */
const stripHtml = (html, maxLen = 200) => {
  if (!html) return "";
  const plain = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
  return maxLen && plain.length > maxLen
    ? plain.slice(0, maxLen).trimEnd() + "…"
    : plain;
};

/* ─── Skeleton card ─────────────────────────────────────── */
function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-44 w-full bg-gray-100 rounded-t-2xl" />
      <div className="p-5 space-y-2.5">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-5/6" />
        <div className="flex justify-between items-center pt-3 border-t border-gray-50">
          <div className="h-5 bg-gray-200 rounded w-1/3" />
          <div className="h-9 bg-orange-100 rounded-xl w-full" />
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [pagination, setPagination] = useState({
    page: 1, limit: 12, total: 0, pages: 0,
  });

  useEffect(() => {
    if (!slug) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const sortMap = {
          newest: { sort: "createdAt", order: "desc" },
          oldest: { sort: "createdAt", order: "asc" },
          "name-asc": { sort: "name", order: "asc" },
          "name-desc": { sort: "name", order: "desc" },
        };
        const { sort, order } = sortMap[sortOption] || sortMap.newest;
        const res = await fetchApi(
          `/public/categories/${slug}/products?page=${pagination.page}&limit=${pagination.limit}&sort=${sort}&order=${order}`
        );
        setCategory(res.data.category);
        setProducts(res.data.products || []);
        setPagination((prev) => res.data.pagination || prev);
      } catch (err) {
        console.error("Error fetching category:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, pagination.page, pagination.limit, sortOption]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    setPagination((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  /* ── Loading state ── */
  if (loading && !category) {
    return (
      <div className="min-h-screen bg-white">
        <div className="py-16 bg-gradient-to-r from-gray-900 to-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
            <div className="h-3.5 bg-gray-600 rounded w-1/4 mb-6" />
            <div className="h-9 bg-gray-600 rounded w-1/2 mb-3" />
            <div className="h-3.5 bg-gray-600 rounded w-2/3" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  /* ── Error state ── */
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="bg-white border border-red-100 rounded-2xl p-10 max-w-md w-full text-center shadow-sm">
          <div className="w-14 h-14 mx-auto mb-5 bg-red-50 rounded-xl flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Category Not Found</h2>
          <p className="text-gray-500 text-sm mb-7">{error}</p>
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-orange-500
                       hover:bg-orange-600 text-white rounded-xl font-semibold text-sm transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> All Categories
          </Link>
        </div>
      </div>
    );
  }

  const categoryImg = category?.image ? getImageUrl(category.image) : null;
  const emoji = getCategoryEmoji(category?.name);

  return (
    <div className="min-h-screen bg-white">

      {/* ══ Category Hero Banner ══ */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Left */}
            <div className="flex-1">
              <nav className="flex items-center gap-2 text-sm mb-6">
                <Link href="/" className="text-orange-400 hover:text-orange-300 transition-colors">Home</Link>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                <Link href="/categories" className="text-gray-400 hover:text-white transition-colors">Categories</Link>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-white font-medium truncate max-w-[200px]">{category?.name}</span>
              </nav>
              <span className="inline-block bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium mb-3">
                {category?.name}
              </span>
              <h1 className="text-4xl font-bold text-white leading-tight mb-2">
                {category?.name}
              </h1>
              <p className="text-gray-400 mt-2">
                {pagination.total} {pagination.total === 1 ? "course" : "courses"} available
              </p>
            </div>

            {/* Right - Category icon */}
            <div className="w-24 h-24 bg-orange-500/20 rounded-3xl flex items-center justify-center flex-shrink-0">
              <span className="text-5xl">{emoji}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ Filter + Sort Bar (Sticky) ══ */}
      <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-sm text-gray-500">
              Showing {products.length} of {pagination.total} courses
            </p>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200 gap-0.5">
                <button
                  onClick={() => setViewMode("grid")}
                  title="Grid view"
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid"
                    ? "bg-orange-500 text-white shadow-sm"
                    : "text-gray-400 hover:text-gray-700"
                    }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  title="List view"
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === "list"
                    ? "bg-orange-500 text-white shadow-sm"
                    : "text-gray-400 hover:text-gray-700"
                    }`}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={handleSortChange}
                  className="appearance-none bg-white border border-gray-200 text-gray-700 rounded-lg
                             pl-3.5 pr-9 py-2 text-sm font-medium focus:outline-none focus:ring-2
                             focus:ring-orange-100 focus:border-orange-500 cursor-pointer transition-all"
                >
                  <option value="newest">Sort by: Latest</option>
                  <option value="oldest">Sort by: Oldest First</option>
                  <option value="name-asc">Sort by: Name A–Z</option>
                  <option value="name-desc">Sort by: Name Z–A</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ Course Cards Grid ══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4 opacity-40">🎯</div>
            <h2 className="text-xl text-gray-400 font-semibold">No courses in this category yet</h2>
            <Link href="/categories" className="inline-block mt-6">
              <button className="px-6 py-3 border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white rounded-xl font-semibold text-sm transition-all duration-200">
                Back to Categories
              </button>
            </Link>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                : "flex flex-col gap-4"
            }
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} viewMode={viewMode} />
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {pagination.pages > 1 && (
          <div className="flex justify-center items-center mt-14 gap-1.5">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2.5 bg-white border border-gray-200 rounded-lg text-gray-500
                         hover:border-orange-300 hover:text-orange-500 disabled:opacity-40
                         disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {[...Array(pagination.pages)].map((_, i) => {
              const page = i + 1;
              const near =
                page === 1 ||
                page === pagination.pages ||
                (page >= pagination.page - 1 && page <= pagination.page + 1);

              if (!near) {
                if (
                  (page === 2 && pagination.page > 3) ||
                  (page === pagination.pages - 1 && pagination.page < pagination.pages - 2)
                ) {
                  return <span key={page} className="text-gray-300 text-sm px-1">…</span>;
                }
                return null;
              }

              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-9 h-9 rounded-lg font-semibold text-sm transition-colors ${pagination.page === page
                    ? "bg-orange-500 text-white shadow-sm shadow-orange-200"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-orange-300 hover:text-orange-600"
                    }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="p-2.5 bg-white border border-gray-200 rounded-lg text-gray-500
                         hover:border-orange-300 hover:text-orange-500 disabled:opacity-40
                         disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
