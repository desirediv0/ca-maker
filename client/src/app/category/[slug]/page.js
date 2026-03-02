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

/* Strip HTML tags + decode common entities → plain text */
const stripHtml = (html, maxLen = 200) => {
  if (!html) return "";
  const plain = html
    .replace(/<[^>]*>/g, " ")           // remove all tags
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")               // collapse whitespace
    .trim();
  return maxLen && plain.length > maxLen
    ? plain.slice(0, maxLen).trimEnd() + "…"
    : plain;
};

/* ─── Skeleton card ─────────────────────────────────────── */
function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-[4/3] w-full bg-orange-50" />
      <div className="p-4 space-y-2.5">
        <div className="h-3.5 bg-gray-100 rounded-md w-3/4" />
        <div className="h-3 bg-gray-100 rounded-md w-full" />
        <div className="h-3 bg-gray-100 rounded-md w-5/6" />
        <div className="flex justify-between items-center pt-2 border-t border-gray-50">
          <div className="h-5 bg-gray-200 rounded-md w-1/3" />
          <div className="h-7 bg-orange-100 rounded-md w-16" />
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
        {/* Skeleton hero */}
        <div className="py-16 bg-[#F9FAFB] border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
            <div className="h-3.5 bg-gray-200 rounded-md w-1/4 mb-6" />
            <div className="h-9 bg-gray-200 rounded-md w-1/2 mb-3" />
            <div className="h-3.5 bg-gray-100 rounded-md w-2/3 mb-2" />
            <div className="flex gap-3 mt-4">
              <div className="h-7 bg-orange-100 rounded-full w-28" />
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  /* ── Error state ── */
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="bg-white border border-red-100 rounded-xl p-10 max-w-md w-full text-center shadow-sm">
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

  return (
    <div className="min-h-screen bg-white">

      {/* ══ Hero ══ */}
      <section className="bg-[#F9FAFB] border-b border-gray-100 py-14 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-7">
            <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/categories" className="hover:text-orange-500 transition-colors">Categories</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-700 font-medium truncate max-w-[200px]">
              {category?.name}
            </span>
          </nav>

          {/* Hero content */}
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Category image */}
            {categoryImg && (
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-white border border-gray-200
                              overflow-hidden flex-shrink-0 shadow-sm">
                <Image
                  src={categoryImg}
                  alt={category.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-contain p-3"
                />
              </div>
            )}

            <div className="flex-1 min-w-0">
              {/* Count badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 border
                              border-orange-200 rounded-full text-orange-600 text-xs font-bold
                              uppercase tracking-wide mb-3">
                <BookOpen className="w-3 h-3" />
                {pagination.total} Courses
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-2 tracking-tight">
                {category?.name}
              </h1>

              {category?.description && stripHtml(category.description) && (
                <p className="text-gray-500 text-base max-w-2xl leading-relaxed">
                  {stripHtml(category.description)}
                </p>
              )}
            </div>

            {/* Back link */}
            <Link
              href="/categories"
              className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold
                         text-gray-400 hover:text-orange-500 transition-colors flex-shrink-0"
            >
              <ChevronLeft className="w-4 h-4" /> All Categories
            </Link>
          </div>
        </div>
      </section>

      {/* ══ Products ══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">

        {/* ── Toolbar ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center
                        gap-4 mb-8 pb-5 border-b border-gray-100">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-bold text-gray-900">{products.length}</span>{" "}
            of{" "}
            <span className="font-bold text-gray-900">{pagination.total}</span>{" "}
            results
          </p>

          <div className="flex items-center gap-3">
            {/* View toggle */}
            <div className="hidden sm:flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200 gap-0.5">
              <button
                onClick={() => setViewMode("grid")}
                title="Grid view"
                className={`p-1.5 rounded-md transition-colors ${viewMode === "grid"
                    ? "bg-orange-500 text-white shadow-sm"
                    : "text-gray-400 hover:text-gray-700"
                  }`}
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                title="List view"
                className={`p-1.5 rounded-md transition-colors ${viewMode === "list"
                    ? "bg-orange-500 text-white shadow-sm"
                    : "text-gray-400 hover:text-gray-700"
                  }`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <select
                value={sortOption}
                onChange={handleSortChange}
                className="appearance-none bg-white border border-gray-200 text-gray-700 rounded-lg
                           pl-3.5 pr-9 py-2 text-sm font-medium focus:outline-none focus:ring-2
                           focus:ring-orange-300 focus:border-orange-400 cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name-asc">Name: A–Z</option>
                <option value="name-desc">Name: Z–A</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ── Grid / List / Empty ── */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 bg-[#F9FAFB] rounded-xl border border-gray-100">
            <div className="w-16 h-16 mx-auto mb-5 bg-orange-100 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-orange-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Courses Found</h2>
            <p className="text-gray-500 mb-7 text-sm max-w-sm mx-auto">
              This category doesn&apos;t have any courses yet. Check back soon!
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500
                         hover:bg-orange-600 text-white rounded-xl font-semibold text-sm transition-colors"
            >
              Browse All Courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5"
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
