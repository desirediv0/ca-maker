"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchApi } from "@/lib/utils";
import {
  RiAlertLine as AlertCircle,
  RiArrowLeftSLine as ChevronLeft,
  RiArrowRightSLine as ChevronRight,
  RiGridLine as Grid,
  RiListCheck as List,
  RiGraduationCapLine as GraduationCap,
  RiBookOpenLine as BookOpen,
  RiHome4Line,
  RiStackLine,
  RiMedalLine,
  RiFileList3Line,
  RiCalculatorLine,
  RiScales3Line,
  RiSearchLine,
} from "react-icons/ri";
import { ProductCard } from "@/components/products/ProductCard";



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



/* ─── Skeleton ─────────────────────────────────────────── */
function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #F0F0F0" }}>
      <div className="h-44 w-full bg-gray-50 rounded-t-2xl" />
      <div className="p-5 space-y-2.5 animate-pulse">
        <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
        <div className="h-3 bg-gray-50 rounded w-full" />
        <div className="h-3 bg-gray-50 rounded w-5/6" />
        <div className="flex justify-between items-center pt-3 border-t border-gray-50">
          <div className="h-5 bg-gray-100 rounded-lg w-1/3" />
          <div className="h-9 bg-blue-50 rounded-xl w-24" />
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
        <div
          className="py-16"
          style={{ background: "linear-gradient(135deg, #1E3A8A 0%, #1E40AF 30%, #2563EB 70%, #3B82F6 100%)" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
            <div className="h-3.5 bg-white/10 rounded w-1/4 mb-6" />
            <div className="h-9 bg-white/10 rounded w-1/2 mb-3" />
            <div className="h-3.5 bg-white/10 rounded w-1/3" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
        <div
          className="rounded-2xl p-10 max-w-md w-full text-center"
          style={{ border: "1px solid #F0F0F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
        >
          <div
            className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(239, 68, 68, 0.06)", border: "1px solid rgba(239, 68, 68, 0.12)" }}
          >
            <AlertCircle className="w-7 h-7 text-red-500" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 mb-2 tracking-tight">Category Not Found</h2>
          <p className="text-gray-400 text-sm mb-7">{error}</p>
          <Link
            href="/categories"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm
                       text-white transition-all duration-300 hover:scale-[1.03]"
            style={{
              background: "linear-gradient(135deg, #1E40AF, #2563EB, #3B82F6)",
              boxShadow: "0 4px 16px rgba(37, 99, 235, 0.25)",
            }}
          >
            <ChevronLeft className="w-4 h-4" /> All Categories
          </Link>
        </div>
      </div>
    );
  }

  const CategoryIcon = getCategoryIcon(category?.name);

  return (
    <div className="min-h-screen bg-white">

      {/* ══ Hero ══ */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1E3A8A 0%, #1E40AF 30%, #2563EB 70%, #3B82F6 100%)",
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <div
            className="absolute -top-20 -right-20 w-[400px] h-[400px] opacity-20"
            style={{ background: "radial-gradient(circle, rgba(96,165,250,0.6), transparent 70%)" }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Left */}
            <div className="flex-1">
              <nav className="flex items-center gap-2 text-sm text-white/50 mb-6">
                <Link href="/" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <RiHome4Line className="w-3.5 h-3.5" /> Home
                </Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link href="/categories" className="hover:text-white transition-colors">Categories</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-white font-medium truncate max-w-[200px]">{category?.name}</span>
              </nav>

              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-10 bg-gradient-to-r from-transparent to-white/30" />
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-blue-200/60">
                  Category
                </span>
                <div className="h-px w-10 bg-gradient-to-l from-transparent to-white/30" />
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
                {category?.name}
              </h1>

              <div className="flex items-center gap-3 mt-3">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#FFFFFF",
                  }}
                >
                  <BookOpen className="w-3 h-3" />
                  {pagination.total} {pagination.total === 1 ? "Course" : "Courses"}
                </span>
              </div>
            </div>

            {/* Right — Icon */}
            <div
              className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CategoryIcon className="w-10 h-10 md:w-12 md:h-12 text-white/80" />
            </div>
          </div>
        </div>
      </section>

      {/* ══ Filter Bar ══ */}
      <div
        className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm"
        style={{ borderBottom: "1px solid #F0F0F0" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <p className="text-sm text-gray-400 font-medium">
              Showing{" "}
              <span className="text-gray-700 font-semibold">{products.length}</span>{" "}
              of{" "}
              <span className="text-gray-700 font-semibold">{pagination.total}</span>{" "}
              courses
            </p>
            <div className="flex items-center gap-2.5">
              {/* View toggle */}
              <div
                className="hidden sm:flex items-center rounded-lg p-1 gap-0.5"
                style={{ background: "#F8F8F8", border: "1px solid #EEEEEE" }}
              >
                <button
                  onClick={() => setViewMode("grid")}
                  title="Grid view"
                  className="p-1.5 rounded-md transition-all duration-200"
                  style={{
                    background: viewMode === "grid" ? "#2563EB" : "transparent",
                    color: viewMode === "grid" ? "#FFFFFF" : "#9CA3AF",
                    boxShadow: viewMode === "grid" ? "0 1px 3px rgba(37,99,235,0.2)" : "none",
                  }}
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  title="List view"
                  className="p-1.5 rounded-md transition-all duration-200"
                  style={{
                    background: viewMode === "list" ? "#2563EB" : "transparent",
                    color: viewMode === "list" ? "#FFFFFF" : "#9CA3AF",
                    boxShadow: viewMode === "list" ? "0 1px 3px rgba(37,99,235,0.2)" : "none",
                  }}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={handleSortChange}
                  className="appearance-none rounded-xl pl-3.5 pr-9 py-2.5 text-sm font-medium
                             text-gray-700 cursor-pointer transition-all duration-200
                             focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-400"
                  style={{
                    border: "1px solid #EBEBEB",
                    background: "#FAFAFA",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                  }}
                >
                  <option value="newest">Latest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name-asc">Name A–Z</option>
                  <option value="name-desc">Name Z–A</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ Course Grid ══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
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
            <h2 className="text-xl font-extrabold text-gray-800 mb-2 tracking-tight">
              No courses in this category yet
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              Check back soon — new courses are added regularly.
            </p>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold
                         text-blue-600 transition-all duration-200 hover:bg-blue-50"
              style={{ border: "1px solid rgba(37, 99, 235, 0.2)" }}
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Categories
            </Link>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-2 md:grid-cols-4 gap-6"
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
              className="p-2.5 rounded-xl transition-all duration-200
                         disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: "#FFFFFF",
                border: "1px solid #EBEBEB",
                color: "#6B7280",
              }}
              onMouseEnter={(e) => {
                if (pagination.page > 1) {
                  e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)";
                  e.currentTarget.style.color = "#2563EB";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#EBEBEB";
                e.currentTarget.style.color = "#6B7280";
              }}
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
                  return (
                    <span key={page} className="text-gray-300 text-sm px-1">
                      …
                    </span>
                  );
                }
                return null;
              }

              const isActive = pagination.page === page;

              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className="w-10 h-10 rounded-xl font-bold text-sm transition-all duration-200"
                  style={{
                    background: isActive
                      ? "linear-gradient(135deg, #1E40AF, #2563EB)"
                      : "#FFFFFF",
                    color: isActive ? "#FFFFFF" : "#4B5563",
                    border: isActive ? "none" : "1px solid #EBEBEB",
                    boxShadow: isActive
                      ? "0 4px 12px rgba(37, 99, 235, 0.25)"
                      : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)";
                      e.currentTarget.style.color = "#2563EB";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = "#EBEBEB";
                      e.currentTarget.style.color = "#4B5563";
                    }
                  }}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="p-2.5 rounded-xl transition-all duration-200
                         disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: "#FFFFFF",
                border: "1px solid #EBEBEB",
                color: "#6B7280",
              }}
              onMouseEnter={(e) => {
                if (pagination.page < pagination.pages) {
                  e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)";
                  e.currentTarget.style.color = "#2563EB";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#EBEBEB";
                e.currentTarget.style.color = "#6B7280";
              }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}