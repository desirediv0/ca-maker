"use client";

import { useState, useEffect } from "react";
import { Search, Grid, List, ChevronDown, ChevronUp, X, SlidersHorizontal } from "lucide-react";
import { RiBookOpenLine } from "react-icons/ri";
import { CourseCard } from "@/components/courses/CourseCard";

export default function CoursesPage() {
    const [courses, setCourses] = useState([]);
    const [filterOptions, setFilterOptions] = useState({
        attempts: [],
        courseTypes: [],
        modes: [],
        faculties: [],
        categories: [],
    });
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState("grid");
    const [filters, setFilters] = useState({
        search: "",
        courseType: "",
        attempt: "",
        mode: "",
        bookOption: "",
        tag: "",
        categoryId: "",
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 16,
        total: 0,
        pages: 0,
    });
    const [expandedSections, setExpandedSections] = useState({
        attempt: true,
        courseType: true,
        batchType: true,
        faculty: true,
        categories: true,
    });
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    /* ── Fetch filter options (unchanged) ── */
    useEffect(() => { fetchFilterOptions(); }, []);

    /* ── Fetch courses on filter/page change (unchanged) ── */
    useEffect(() => { fetchCourses(); }, [filters, pagination.page]);

    const fetchFilterOptions = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/filters/options`);
            const data = await response.json();
            if (data.success) setFilterOptions(data.data);
        } catch (error) {
            console.error("Error fetching filter options:", error);
        }
    };

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
                ...(filters.search && { search: filters.search }),
                ...(filters.courseType && { courseType: filters.courseType }),
                ...(filters.attempt && { attempt: filters.attempt }),
                ...(filters.mode && { mode: filters.mode }),
                ...(filters.bookOption && { bookOption: filters.bookOption }),
                ...(filters.tag && { tag: filters.tag }),
                ...(filters.categoryId && { categoryId: filters.categoryId }),
            });

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses?${params}`);
            const data = await response.json();

            if (data.success) {
                setCourses(data.data.courses);
                setPagination((prev) => ({
                    ...prev,
                    total: data.data.pagination.total,
                    pages: data.data.pagination.pages,
                }));
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const clearFilters = () => {
        setFilters({ search: "", courseType: "", attempt: "", mode: "", bookOption: "", tag: "", categoryId: "" });
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const toggleSection = (section) =>
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));

    const activeFiltersCount = Object.values(filters).filter(Boolean).length;

    /* ─── Filter sidebar ─────────────────────────────────── */
    const FilterSidebar = () => (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-4"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>

            <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-bold text-gray-900">Filters</h3>
                {activeFiltersCount > 0 && (
                    <button
                        onClick={clearFilters}
                        className="text-xs text-orange-600 hover:text-orange-700 font-semibold"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* Attempt */}
            {filterOptions.attempts.length > 0 && (
                <FilterSection
                    title="Attempt"
                    open={expandedSections.attempt}
                    onToggle={() => toggleSection("attempt")}
                >
                    {filterOptions.attempts.map((attempt) => (
                        <RadioOption
                            key={attempt}
                            name="attempt"
                            label={attempt}
                            checked={filters.attempt === attempt}
                            onChange={() => handleFilterChange("attempt", attempt)}
                        />
                    ))}
                </FilterSection>
            )}

            {/* Course Type */}
            {filterOptions.courseTypes.length > 0 && (
                <FilterSection
                    title="Course Type"
                    open={expandedSections.courseType}
                    onToggle={() => toggleSection("courseType")}
                >
                    {filterOptions.courseTypes.map((type) => (
                        <RadioOption
                            key={type.value}
                            name="courseType"
                            label={type.label}
                            checked={filters.courseType === type.value}
                            onChange={() => handleFilterChange("courseType", type.value)}
                        />
                    ))}
                </FilterSection>
            )}

            {/* Batch Type */}
            {filterOptions.modes.length > 0 && (
                <FilterSection
                    title="Batch Type"
                    open={expandedSections.batchType}
                    onToggle={() => toggleSection("batchType")}
                >
                    {filterOptions.modes.map((mode) => (
                        <CheckOption
                            key={mode.value}
                            label={mode.label}
                            checked={filters.mode === mode.value}
                            onChange={(checked) => handleFilterChange("mode", checked ? mode.value : "")}
                        />
                    ))}
                </FilterSection>
            )}

            {/* Faculty */}
            {filterOptions.faculties.length > 0 && (
                <FilterSection
                    title="By Faculty"
                    open={expandedSections.faculty}
                    onToggle={() => toggleSection("faculty")}
                >
                    {filterOptions.faculties.map((faculty) => (
                        <CheckOption
                            key={faculty}
                            label={faculty}
                            checked={filters.facultyName === faculty}
                            onChange={(checked) => handleFilterChange("facultyName", checked ? faculty : "")}
                        />
                    ))}
                </FilterSection>
            )}

            {/* Categories */}
            {filterOptions.categories.length > 0 && (
                <FilterSection
                    title="Categories"
                    open={expandedSections.categories}
                    onToggle={() => toggleSection("categories")}
                    noBorder
                >
                    {filterOptions.categories.map((category) => (
                        <CheckOption
                            key={category.id}
                            label={category.name}
                            checked={filters.categoryId === category.id}
                            onChange={(checked) => handleFilterChange("categoryId", checked ? category.id : "")}
                        />
                    ))}
                </FilterSection>
            )}
        </div>
    );

    /* ─── Page ────────────────────────────────────────────── */
    return (
        <div className="min-h-screen bg-white">

            {/* ── Page header — Phoenix orange ── */}
            <div className="bg-[#111111] py-8">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="h-0.5 w-10 bg-gradient-to-r from-orange-400 to-amber-400 mb-4 rounded-full" />
                    <h1 className="font-display text-3xl md:text-4xl font-black text-white mb-2">
                        {filters.courseType === "book" ? "Books" : "All Courses"}
                    </h1>
                    <p className="text-white/60 text-lg">
                        Explore our comprehensive CA coaching programs
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex gap-8">

                    {/* ── Sidebar (desktop) ── */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <FilterSidebar />
                    </aside>

                    {/* ── Main content ── */}
                    <div className="flex-1 min-w-0">

                        {/* Top bar */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-8"
                            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

                                {/* Search */}
                                <div className="relative flex-1 w-full md:max-w-sm">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search courses..."
                                        value={filters.search}
                                        onChange={(e) => handleFilterChange("search", e.target.value)}
                                        className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm
                                                   placeholder:text-gray-400 focus:outline-none focus:ring-2
                                                   focus:ring-orange-400/40 focus:border-orange-400 transition-all"
                                    />
                                </div>

                                <div className="flex items-center gap-3">
                                    {/* Mobile filter button */}
                                    <button
                                        onClick={() => setShowMobileFilters(true)}
                                        className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-orange-500
                                                   hover:bg-orange-600 text-white rounded-xl text-sm font-semibold transition-colors"
                                    >
                                        <SlidersHorizontal className="h-4 w-4" />
                                        Filters
                                        {activeFiltersCount > 0 && (
                                            <span className="bg-white text-orange-600 text-xs font-bold
                                                             w-5 h-5 rounded-full flex items-center justify-center">
                                                {activeFiltersCount}
                                            </span>
                                        )}
                                    </button>

                                    {/* View mode toggle */}
                                    <div className="hidden md:flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-xl p-1">
                                        <button
                                            onClick={() => setViewMode("grid")}
                                            className={`p-2 rounded-lg transition-colors ${viewMode === "grid"
                                                    ? "bg-white text-orange-600 shadow-sm"
                                                    : "text-gray-400 hover:text-gray-700"
                                                }`}
                                            title="Grid view"
                                        >
                                            <Grid className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode("list")}
                                            className={`p-2 rounded-lg transition-colors ${viewMode === "list"
                                                    ? "bg-white text-orange-600 shadow-sm"
                                                    : "text-gray-400 hover:text-gray-700"
                                                }`}
                                            title="List view"
                                        >
                                            <List className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Results count + active filters */}
                            <div className="mt-4 flex items-center gap-3 flex-wrap">
                                <p className="text-sm text-gray-500">
                                    Showing{" "}
                                    <span className="font-semibold text-gray-900">{courses.length}</span>
                                    {" "}of{" "}
                                    <span className="font-semibold text-gray-900">{pagination.total}</span>
                                    {" "}courses
                                </p>

                                {activeFiltersCount > 0 && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-xs text-orange-600 hover:text-orange-700 font-semibold
                                                   flex items-center gap-1"
                                    >
                                        <X className="h-3 w-3" /> Clear filters
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* ── Course grid ── */}
                        {loading ? (
                            <div className={viewMode === "grid"
                                ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5"
                                : "space-y-4"
                            }>
                                {[...Array(6)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="bg-white rounded-[10px] border border-gray-100 overflow-hidden animate-pulse"
                                        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
                                    >
                                        <div className="aspect-[4/3] bg-orange-50" />
                                        <div className="p-4 space-y-3">
                                            <div className="h-4 bg-gray-100 rounded-lg" />
                                            <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
                                            <div className="h-8 bg-orange-50 rounded-lg w-1/2 mt-4" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : courses.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="w-16 h-16 mx-auto mb-4 bg-orange-50 rounded-2xl flex items-center justify-center">
                                    <RiBookOpenLine className="w-8 h-8 text-orange-400" />
                                </div>
                                <h3 className="font-display text-2xl font-bold text-gray-900 mb-2">
                                    No courses found
                                </h3>
                                <p className="text-gray-500 mb-6">Try adjusting your filters</p>
                                <button
                                    onClick={clearFilters}
                                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white
                                               rounded-xl font-semibold transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            /* ── Uses shared CourseCard ── */
                            <div className={viewMode === "grid"
                                ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5"
                                : "flex flex-col gap-4"
                            }>
                                {courses.map((course) => (
                                    <CourseCard key={course.id} course={course} viewMode={viewMode} />
                                ))}
                            </div>
                        )}

                        {/* ── Pagination ── */}
                        {pagination.pages > 1 && (
                            <div className="flex justify-center gap-2 mt-12">
                                {[...Array(pagination.pages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPagination((prev) => ({ ...prev, page: i + 1 }))}
                                        className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${pagination.page === i + 1
                                                ? "bg-orange-500 text-white shadow-sm shadow-orange-200"
                                                : "bg-gray-50 text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Mobile filters drawer ── */}
            {showMobileFilters && (
                <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
                    <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white overflow-y-auto">
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-display text-xl font-bold text-gray-900">Filters</h3>
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="p-2 hover:bg-orange-50 rounded-xl transition-colors"
                                >
                                    <X className="h-5 w-5 text-gray-600" />
                                </button>
                            </div>
                            <FilterSidebar />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ─── Small helper sub-components ────────────────────────── */

function FilterSection({ title, open, onToggle, noBorder = false, children }) {
    return (
        <div className={`mb-5 ${noBorder ? "" : "border-b border-gray-100 pb-4"}`}>
            <button
                onClick={onToggle}
                className="flex items-center justify-between w-full mb-3"
            >
                <span className="text-sm font-bold text-gray-800">{title}</span>
                {open
                    ? <ChevronUp className="h-4 w-4 text-gray-400" />
                    : <ChevronDown className="h-4 w-4 text-gray-400" />
                }
            </button>
            {open && <div className="space-y-2">{children}</div>}
        </div>
    );
}

function RadioOption({ name, label, checked, onChange }) {
    return (
        <label className="flex items-center gap-2 cursor-pointer group">
            <input
                type="radio"
                name={name}
                checked={checked}
                onChange={onChange}
                className="h-4 w-4 accent-orange-500 border-gray-300"
            />
            <span className="text-sm text-gray-600 group-hover:text-orange-600 transition-colors">
                {label}
            </span>
        </label>
    );
}

function CheckOption({ label, checked, onChange }) {
    return (
        <label className="flex items-center gap-2 cursor-pointer group">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="h-4 w-4 accent-orange-500 rounded border-gray-300"
            />
            <span className="text-sm text-gray-600 group-hover:text-orange-600 transition-colors">
                {label}
            </span>
        </label>
    );
}
