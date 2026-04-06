"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import {
  RiSearchLine,
  RiGridLine,
  RiListCheck,
  RiCloseLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiArrowRightLine,
  RiHome4Line,
  RiBookOpenLine,
  RiGroupLine,
  RiStarLine,
  RiFilterLine,
} from "react-icons/ri";
import { CourseCard } from "@/components/courses/CourseCard";

const SORT_OPTIONS = [
  { value: "latest", label: "Latest First" },
  { value: "popular", label: "Most Popular" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

function getSortParams(sortValue) {
  switch (sortValue) {
    case "popular":
    case "rating":
      return { sort: "createdAt", order: "desc" };
    case "price-low":
      return { sort: "createdAt", order: "desc" };
    case "price-high":
      return { sort: "createdAt", order: "asc" };
    default:
      return { sort: "createdAt", order: "desc" };
  }
}

function CoursesPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || searchParams.get("categoryId") || "all";
  const currentSort = searchParams.get("sort") || "latest";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const [searchInput, setSearchInput] = useState(currentSearch);
  const [courses, setCourses] = useState([]);
  const [filterOptions, setFilterOptions] = useState({ categories: [] });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [pagination, setPagination] = useState({ page: 1, limit: 16, total: 0, pages: 0 });
  const debounceRef = useRef(null);

  useEffect(() => { setSearchInput(currentSearch); }, [currentSearch]);

  const updateFilters = useCallback(
    (newParams) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(newParams).forEach(([key, value]) => {
        if (value && value !== "all" && value !== "") params.set(key, value);
        else params.delete(key);
      });
      if (params.get("page") === "1") params.delete("page");
      router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateFilters({ search: value, page: "1" });
    }, 400);
  };

  const handleClearSearch = () => { setSearchInput(""); updateFilters({ search: "" }); };
  const handleClearAll = () => { setSearchInput(""); router.push("/courses", { scroll: false }); };

  useEffect(() => { return () => clearTimeout(debounceRef.current); }, []);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/filters/options`);
        const data = await response.json();
        if (data.success) setFilterOptions(data.data);
      } catch (error) { console.error("Error fetching filter options:", error); }
    };
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const { sort, order } = getSortParams(currentSort);
        const categoryId = currentCategory === "all" ? "" : currentCategory;
        const categories = filterOptions.categories || [];
        const catBySlug = categories.find((c) => c.slug === currentCategory);
        const catById = categories.find((c) => c.id === currentCategory);
        const resolvedCategoryId = catBySlug?.id || catById?.id || categoryId;

        const params = new URLSearchParams({
          page: currentPage.toString(), limit: "16", sort, order,
          ...(currentSearch && { search: currentSearch }),
          ...(resolvedCategoryId && { categoryId: resolvedCategoryId }),
          ...(currentMinPrice && { minPrice: currentMinPrice }),
          ...(currentMaxPrice && { maxPrice: currentMaxPrice }),
        });

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses?${params}`);
        const data = await response.json();
        if (data.success) {
          setCourses(data.data.courses);
          setPagination((prev) => ({
            ...prev,
            total: data.data.pagination?.total ?? 0,
            pages: data.data.pagination?.pages ?? 1,
          }));
        }
      } catch (error) { console.error("Error fetching courses:", error); }
      finally { setLoading(false); }
    };
    fetchCourses();
  }, [currentSearch, currentCategory, currentSort, currentMinPrice, currentMaxPrice, currentPage, filterOptions.categories]);

  const hasActiveFilters =
    currentSearch || (currentCategory && currentCategory !== "all") || currentSort !== "latest" || currentMinPrice || currentMaxPrice;

  const categories = filterOptions.categories || [];
  const totalCount = pagination.total;

  const activeFilterTags = [];
  if (currentSearch) activeFilterTags.push({ key: "search", label: currentSearch, Icon: RiSearchLine });
  if (currentCategory && currentCategory !== "all") {
    const cat = categories.find((c) => c.slug === currentCategory || c.id === currentCategory);
    activeFilterTags.push({ key: "category", label: cat?.name || currentCategory, Icon: RiBookOpenLine });
  }
  if (currentSort && currentSort !== "latest") {
    const opt = SORT_OPTIONS.find((o) => o.value === currentSort);
    activeFilterTags.push({ key: "sort", label: opt?.label || currentSort, Icon: RiFilterLine });
  }
  if (currentMinPrice) activeFilterTags.push({ key: "minPrice", label: `Min ₹${currentMinPrice}`, Icon: RiFilterLine });
  if (currentMaxPrice) activeFilterTags.push({ key: "maxPrice", label: `Max ₹${currentMaxPrice}`, Icon: RiFilterLine });

  const removeFilter = (key) => {
    if (key === "search") { setSearchInput(""); updateFilters({ search: "" }); }
    else if (key === "category") updateFilters({ category: "" });
    else if (key === "sort") updateFilters({ sort: "" });
    else if (key === "minPrice") updateFilters({ minPrice: "" });
    else if (key === "maxPrice") updateFilters({ maxPrice: "" });
  };

  const goToPage = (page) => { updateFilters({ page: page.toString() }); };

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
          <div
            className="absolute -bottom-16 -left-16 w-[300px] h-[300px] opacity-10"
            style={{ background: "radial-gradient(circle, rgba(147,197,253,0.5), transparent 70%)" }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 text-center">
          <nav className="flex items-center justify-center gap-2 text-sm text-white/50 mb-6">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1.5">
              <RiHome4Line className="w-3.5 h-3.5" /> Home
            </Link>
            <RiArrowRightSLine className="w-3.5 h-3.5" />
            <span className="text-white font-medium">Courses</span>
          </nav>

          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-white/30" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-blue-200/60">
              Browse & Learn
            </span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-white/30" />
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4 tracking-tight">
            All CA Courses
          </h1>
          <p className="text-blue-100/60 text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Expert-curated CA preparation courses by CA Mohit Kukreja
          </p>

          {/* Stat pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: RiBookOpenLine, label: "50+ Courses" },
              { icon: RiGroupLine, label: "10,000+ Students" },
              { icon: RiStarLine, label: "4.9 Avg Rating" },
            ].map(({ icon: Icon, label }, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white/80"
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                }}
              >
                <Icon className="w-4 h-4 text-blue-200/60" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Sticky Filter Bar ══ */}
      <div
        className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm py-3.5 px-4 sm:px-6"
        style={{ borderBottom: "1px solid #F0F0F0" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={handleSearchChange}
                  placeholder="Search courses, topics…"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm text-gray-800
                             placeholder:text-gray-300 transition-all duration-200
                             focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-400"
                  style={{ border: "1px solid #EBEBEB", background: "#FAFAFA" }}
                  onFocus={(e) => { e.target.style.background = "#FFFFFF"; }}
                  onBlur={(e) => { if (!e.target.value) e.target.style.background = "#FAFAFA"; }}
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                  >
                    <RiCloseLine className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Category pills */}
              <div
                className="flex gap-2 overflow-x-auto pb-1 lg:pb-0"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <button
                  type="button"
                  onClick={() => updateFilters({ category: "all", page: "1" })}
                  className="px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200"
                  style={{
                    background: (currentCategory === "all" || !currentCategory)
                      ? "linear-gradient(135deg, #1E40AF, #2563EB)"
                      : "#F5F5F5",
                    color: (currentCategory === "all" || !currentCategory) ? "#FFFFFF" : "#6B7280",
                    border: (currentCategory === "all" || !currentCategory)
                      ? "none"
                      : "1px solid #EBEBEB",
                    boxShadow: (currentCategory === "all" || !currentCategory)
                      ? "0 2px 8px rgba(37,99,235,0.2)"
                      : "none",
                  }}
                >
                  All
                </button>
                {categories.map((cat) => {
                  const isActive = currentCategory === (cat.slug || cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => updateFilters({ category: cat.slug || cat.id, page: "1" })}
                      className="px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200"
                      style={{
                        background: isActive
                          ? "linear-gradient(135deg, #1E40AF, #2563EB)"
                          : "#F5F5F5",
                        color: isActive ? "#FFFFFF" : "#6B7280",
                        border: isActive ? "none" : "1px solid #EBEBEB",
                        boxShadow: isActive ? "0 2px 8px rgba(37,99,235,0.2)" : "none",
                      }}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Sort */}
              <div className="relative">
                <select
                  value={currentSort}
                  onChange={(e) => updateFilters({ sort: e.target.value, page: "1" })}
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
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-xs text-gray-400 font-medium">
                  {courses.length} courses
                </span>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="text-blue-600 text-xs font-semibold hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* View toggle */}
              <div
                className="hidden md:flex items-center rounded-lg p-1 gap-0.5"
                style={{ background: "#F8F8F8", border: "1px solid #EEEEEE" }}
              >
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className="p-1.5 rounded-md transition-all duration-200"
                  style={{
                    background: viewMode === "grid" ? "#2563EB" : "transparent",
                    color: viewMode === "grid" ? "#FFFFFF" : "#9CA3AF",
                    boxShadow: viewMode === "grid" ? "0 1px 3px rgba(37,99,235,0.2)" : "none",
                  }}
                >
                  <RiGridLine className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className="p-1.5 rounded-md transition-all duration-200"
                  style={{
                    background: viewMode === "list" ? "#2563EB" : "transparent",
                    color: viewMode === "list" ? "#FFFFFF" : "#9CA3AF",
                    boxShadow: viewMode === "list" ? "0 1px 3px rgba(37,99,235,0.2)" : "none",
                  }}
                >
                  <RiListCheck className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ Active Filter Tags ══ */}
      {activeFilterTags.length > 0 && (
        <div
          className="px-4 sm:px-6 py-2.5"
          style={{ background: "linear-gradient(180deg, #F8FAFF, #FFFFFF)", borderBottom: "1px solid rgba(59,130,246,0.06)" }}
        >
          <div className="max-w-7xl mx-auto flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Active:
            </span>
            {activeFilterTags.map((tag) => (
              <span
                key={tag.key}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold"
                style={{
                  background: "rgba(37, 99, 235, 0.06)",
                  color: "#2563EB",
                  border: "1px solid rgba(37, 99, 235, 0.1)",
                }}
              >
                <tag.Icon className="w-3 h-3" />
                {tag.label}
                <button
                  type="button"
                  onClick={() => removeFilter(tag.key)}
                  className="ml-0.5 hover:text-blue-800 transition-colors"
                >
                  <RiCloseLine className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ══ Course Grid ══ */}
      <section className="py-10 md:py-14 px-4 sm:px-6 min-h-screen bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-px w-6 bg-gradient-to-r from-transparent to-blue-400/30" />
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-blue-500/50">
                  Results
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
                <span
                  style={{
                    background: "linear-gradient(135deg, #1E40AF, #3B82F6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {totalCount}
                </span>{" "}
                {totalCount === 1 ? "Course" : "Courses"} Found
              </h2>
            </div>
          </div>

          {loading ? (
            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" : "space-y-4"}>
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden animate-pulse"
                  style={{ border: "1px solid #F0F0F0" }}
                >
                  <div className="h-44 w-full bg-gray-50" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
                    <div className="h-3 bg-gray-50 rounded w-full" />
                    <div className="h-3 bg-gray-50 rounded w-5/6" />
                    <div className="h-9 bg-blue-50 rounded-xl w-full mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="py-24 text-center">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{
                  background: "rgba(37, 99, 235, 0.06)",
                  border: "1px solid rgba(37, 99, 235, 0.1)",
                }}
              >
                <RiSearchLine className="w-9 h-9 text-blue-300" />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">
                No courses found
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Try adjusting your search or filters.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="group px-7 py-3 rounded-xl text-sm font-bold text-white
                             transition-all duration-300 hover:scale-[1.03] inline-flex items-center justify-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #1E40AF, #2563EB, #3B82F6)",
                    boxShadow: "0 4px 16px rgba(37, 99, 235, 0.25)",
                  }}
                >
                  Clear Filters
                  <RiArrowRightLine className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <Link
                  href="/courses"
                  className="px-7 py-3 rounded-xl text-sm font-semibold text-blue-600
                             transition-all duration-200 hover:bg-blue-50 inline-flex items-center justify-center"
                  style={{ border: "1px solid rgba(37, 99, 235, 0.2)" }}
                >
                  Browse All
                </Link>
              </div>
            </div>
          ) : (
            <div className={viewMode === "grid"
              ? "grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6"
              : "space-y-4"
            }>
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} viewMode={viewMode} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-14 mb-6">
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="p-2.5 rounded-xl transition-all duration-200
                           disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background: "#FFFFFF", border: "1px solid #EBEBEB", color: "#6B7280" }}
                onMouseEnter={(e) => {
                  if (currentPage > 1) { e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)"; e.currentTarget.style.color = "#2563EB"; }
                }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#EBEBEB"; e.currentTarget.style.color = "#6B7280"; }}
              >
                <RiArrowLeftSLine className="w-4 h-4" />
              </button>

              {(() => {
                const pages = [];
                const start = Math.max(1, currentPage - 2);
                const end = Math.min(pagination.pages, currentPage + 2);
                for (let p = start; p <= end; p++) pages.push(p);
                return pages;
              })().map((pageNum) => {
                const isActive = currentPage === pageNum;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => goToPage(pageNum)}
                    className="w-10 h-10 rounded-xl font-bold text-sm transition-all duration-200"
                    style={{
                      background: isActive ? "linear-gradient(135deg, #1E40AF, #2563EB)" : "#FFFFFF",
                      color: isActive ? "#FFFFFF" : "#4B5563",
                      border: isActive ? "none" : "1px solid #EBEBEB",
                      boxShadow: isActive ? "0 4px 12px rgba(37, 99, 235, 0.25)" : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) { e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)"; e.currentTarget.style.color = "#2563EB"; }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) { e.currentTarget.style.borderColor = "#EBEBEB"; e.currentTarget.style.color = "#4B5563"; }
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= pagination.pages}
                className="p-2.5 rounded-xl transition-all duration-200
                           disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background: "#FFFFFF", border: "1px solid #EBEBEB", color: "#6B7280" }}
                onMouseEnter={(e) => {
                  if (currentPage < pagination.pages) { e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)"; e.currentTarget.style.color = "#2563EB"; }
                }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#EBEBEB"; e.currentTarget.style.color = "#6B7280"; }}
              >
                <RiArrowRightSLine className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-gray-300 text-sm font-medium animate-pulse">Loading courses…</div>
        </div>
      }
    >
      <CoursesPageContent />
    </Suspense>
  );
}