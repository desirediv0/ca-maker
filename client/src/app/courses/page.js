"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { Search, Grid, List, X, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { CourseCard } from "@/components/courses/CourseCard";

const SORT_OPTIONS = [
  { value: "latest", label: "Latest First" },
  { value: "popular", label: "Most Popular" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

/* ─── Map sort value to API params (backend supports sort + order) ─── */
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

  /* ── Sync search input when URL changes (e.g. back/forward) ── */
  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  /* ── Update URL with new filter params ── */
  const updateFilters = useCallback(
    (newParams) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(newParams).forEach(([key, value]) => {
        if (value && value !== "all" && value !== "") {
          params.set(key, value);
        } else {
          params.delete(key);
        }
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

  const handleClearSearch = () => {
    setSearchInput("");
    updateFilters({ search: "" });
  };

  const handleClearAll = () => {
    setSearchInput("");
    router.push("/courses", { scroll: false });
  };

  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  /* ── Fetch filter options ── */
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/filters/options`);
        const data = await response.json();
        if (data.success) setFilterOptions(data.data);
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };
    fetchFilterOptions();
  }, []);

  /* ── Fetch courses (pass URL params to API) ── */
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
          page: currentPage.toString(),
          limit: "16",
          sort,
          order,
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
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [
    currentSearch,
    currentCategory,
    currentSort,
    currentMinPrice,
    currentMaxPrice,
    currentPage,
    filterOptions.categories,
  ]);

  const hasActiveFilters =
    currentSearch || (currentCategory && currentCategory !== "all") || currentSort !== "latest" || currentMinPrice || currentMaxPrice;

  const categories = filterOptions.categories || [];
  const totalCount = pagination.total;

  /* ── Active filter tags for display ── */
  const activeFilterTags = [];
  if (currentSearch) activeFilterTags.push({ key: "search", label: currentSearch, icon: "🔍" });
  if (currentCategory && currentCategory !== "all") {
    const cat = categories.find((c) => c.slug === currentCategory || c.id === currentCategory);
    activeFilterTags.push({ key: "category", label: cat?.name || currentCategory, icon: "📂" });
  }
  if (currentSort && currentSort !== "latest") {
    const opt = SORT_OPTIONS.find((o) => o.value === currentSort);
    activeFilterTags.push({ key: "sort", label: opt?.label || currentSort, icon: "↕️" });
  }
  if (currentMinPrice) activeFilterTags.push({ key: "minPrice", label: `Min ₹${currentMinPrice}`, icon: "💰" });
  if (currentMaxPrice) activeFilterTags.push({ key: "maxPrice", label: `Max ₹${currentMaxPrice}`, icon: "💰" });

  const removeFilter = (key) => {
    if (key === "search") {
      setSearchInput("");
      updateFilters({ search: "" });
    } else if (key === "category") updateFilters({ category: "" });
    else if (key === "sort") updateFilters({ sort: "" });
    else if (key === "minPrice") updateFilters({ minPrice: "" });
    else if (key === "maxPrice") updateFilters({ maxPrice: "" });
  };

  const goToPage = (page) => {
    updateFilters({ page: page.toString() });
  };

  return (
    <div className="min-h-screen bg-white">

      {/* ══ Hero Banner ══ */}
      <section className="relative py-14 px-4 sm:px-6 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full bg-orange-600/5 blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative text-center">
          <nav className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-4">
            <Link href="/" className="hover:text-orange-400 transition-colors">Home</Link>
            <span className="text-gray-600">/</span>
            <span className="text-white">Courses</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
            All CA Courses
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-6">
            Expert-curated CA preparation courses by CA Mohit Kukreja
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <span className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-full px-5 py-2 text-white text-sm font-medium">
              📚 50+ Courses
            </span>
            <span className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-full px-5 py-2 text-white text-sm font-medium">
              🎓 10,000+ Students
            </span>
            <span className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-full px-5 py-2 text-white text-sm font-medium">
              ⭐ 4.9 Avg Rating
            </span>
          </div>
        </div>
      </section>

      {/* ══ Sticky Filter Bar ══ */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={handleSearchChange}
                  placeholder="Search courses, topics..."
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm bg-white
                             placeholder:text-gray-400 text-gray-800 focus:outline-none focus:ring-2
                             focus:ring-orange-100 focus:border-orange-500 transition-all"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Category pills */}
              <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                <button
                  type="button"
                  onClick={() => updateFilters({ category: "all", page: "1" })}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
                    ${currentCategory === "all" || !currentCategory
                      ? "bg-orange-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
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
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
                        ${isActive ? "bg-orange-500 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              {/* Sort */}
              <div className="relative">
                <select
                  value={currentSort}
                  onChange={(e) => updateFilters({ sort: e.target.value, page: "1" })}
                  className="appearance-none bg-white border border-gray-200 rounded-xl pl-3 pr-8 py-2.5 text-sm
                             text-gray-700 focus:outline-none focus:border-orange-500 cursor-pointer"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Showing {courses.length} courses</span>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="text-orange-500 text-sm hover:underline cursor-pointer"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* View toggle */}
              <div className="hidden md:flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white text-orange-500 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  title="Grid view"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-white text-orange-500 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  title="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ Active Filter Tags ══ */}
      {activeFilterTags.length > 0 && (
        <div className="bg-orange-50 border-b border-orange-100 px-4 sm:px-6 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500 font-medium">Active filters:</span>
            {activeFilterTags.map((tag) => (
              <span
                key={tag.key}
                className="bg-white border border-orange-200 text-orange-700 rounded-full px-3 py-1 text-xs font-medium
                           flex items-center gap-1.5"
              >
                {tag.icon} {tag.label}
                <button
                  type="button"
                  onClick={() => removeFilter(tag.key)}
                  className="ml-1 hover:text-orange-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ══ Course Grid Section ══ */}
      <section className="bg-gray-50 py-10 px-4 sm:px-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              {totalCount} {totalCount === 1 ? "Course" : "Courses"} Found
            </h2>
          </div>

          {loading ? (
            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-3"}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 rounded-2xl h-72" />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="py-24 text-center">
              <div className="text-8xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900">No courses found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all"
                >
                  Clear Filters
                </button>
                <Link
                  href="/courses"
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all inline-flex justify-center"
                >
                  Browse All
                </Link>
              </div>
            </div>
          ) : (
            <div className={viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-3"
            }>
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} viewMode={viewMode} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12 mb-6">
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="border border-gray-200 rounded-xl px-4 py-2 text-sm hover:border-orange-500 hover:text-orange-500
                           disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-inherit transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {(() => {
                const pages = [];
                const start = Math.max(1, currentPage - 2);
                const end = Math.min(pagination.pages, currentPage + 2);
                for (let p = start; p <= end; p++) pages.push(p);
                return pages;
              })().map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => goToPage(pageNum)}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-all
                      ${currentPage === pageNum
                        ? "bg-orange-500 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    {pageNum}
                  </button>
                ))}
              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= pagination.pages}
                className="border border-gray-200 rounded-xl px-4 py-2 text-sm hover:border-orange-500 hover:text-orange-500
                           disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-inherit transition-all"
              >
                <ChevronRight className="w-4 h-4" />
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
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading courses…</div>
      </div>
    }>
      <CoursesPageContent />
    </Suspense>
  );
}
