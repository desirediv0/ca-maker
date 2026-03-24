"use client";

/**
 * CourseCard — single reusable card for all course/product listings.
 *
 * STRICT RULE: Every field is conditional on the API value.
 * Nothing renders unless the API returns a truthy non-zero value.
 *
 * Props
 * ─────
 * course   {object}  — API course/product object
 * badge    {string}  — "hot" | "new" | "featured"  (optional, passed by parent section)
 * viewMode {string}  — "grid" (default) | "list"
 */

import Link from "next/link";
import Image from "next/image";
import {
  Clock, Star, ArrowRight, CalendarDays,
  Flame, Sparkles, Award,
} from "lucide-react";

const BADGES = {
  hot: { label: "Bestseller", Icon: Flame, pill: "bg-orange-100 text-orange-700" },
  new: { label: "New", Icon: Sparkles, pill: "bg-orange-100 text-orange-700" },
  featured: { label: "New", Icon: Award, pill: "bg-orange-100 text-orange-700" },
};

const getImageUrl = (image) => {
  if (!image) return null;
  if (typeof image !== "string") return null;
  if (image.startsWith("http")) return image;
  return `https://desirediv-storage.blr1.digitaloceanspaces.com/${image}`;
};

/* Only return a price if it's a real positive number */
const safePrice = (val) => {
  const n = Number(val);
  return isFinite(n) && n > 0 ? n : null;
};

export function CourseCard({ course, badge, viewMode = "grid" }) {
  const facultyName = course.facultyName || course.faculty || null;
  const badgeCfg = badge ? BADGES[badge] : null;

  /* ── Image URL: product image → product images[] → variant images[] ── */
  const thumbUrl = (() => {
    // 1. Direct image field
    if (course.image) return getImageUrl(course.image);

    // 2. Product-level images array
    if (Array.isArray(course.images) && course.images.length > 0) {
      const img = course.images.find((i) => i?.isPrimary) || course.images[0];
      const url = img?.url || (typeof img === "string" ? img : null);
      if (url) return getImageUrl(url);
    }

    // 3. Variant images (for products whose images live on variants)
    if (Array.isArray(course.variants)) {
      for (const variant of course.variants) {
        if (Array.isArray(variant.images) && variant.images.length > 0) {
          const img = variant.images.find((i) => i?.isPrimary) || variant.images[0];
          const url = img?.url || (typeof img === "string" ? img : null);
          if (url) return getImageUrl(url);
        }
      }
    }

    return null;
  })();

  /* ── Price — only show if positive number ── */
  const basePrice = safePrice(course.basePrice);
  const regularPrice = safePrice(course.regularPrice);
  const hasRealSale = course.hasSale === true && regularPrice && basePrice && regularPrice > basePrice;
  const discountPct = hasRealSale
    ? Math.round(((regularPrice - basePrice) / regularPrice) * 100)
    : 0;

  /* ── Rating — only show if avgRating is a positive number ── */
  const avgRating = safePrice(course.avgRating);
  const reviewCount = Number(course.reviewCount) > 0 ? Number(course.reviewCount) : null;
  const showRating = avgRating !== null; // requires a real score; count alone is not enough

  /* ── Attempts — only show if non-empty array ── */
  const attempts = Array.isArray(course.attempts) && course.attempts.length > 0
    ? course.attempts
    : null;

  /* ── Digital badge — only if explicitly true ── */
  const isDigital = course.digitalEnabled === true;

  /* ── Featured badge — only if explicitly true and no section badge ── */
  const showFeaturedBadge = course.isFeatured === true && !badge;

  /* ────────── Sub-components ────────── */

  const BadgesLeft = () => (
    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
      {badgeCfg && (
        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${badgeCfg.pill}`}>
          {badgeCfg.label === "Bestseller" && "🔥 "}
          <badgeCfg.Icon className="h-3 w-3" />
          {badgeCfg.label}
        </span>
      )}
      {showFeaturedBadge && (
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-100 text-orange-700">
          New
        </span>
      )}
      {isDigital && (
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-100 text-orange-700">
          Digital
        </span>
      )}
    </div>
  );

  const MetaInfo = ({ skipFaculty } = {}) => {
    const hasMeta = (!skipFaculty && facultyName) || course.duration || course.batchStartDate;
    if (!hasMeta) return null;
    return (
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
        {!skipFaculty && facultyName && (
          <span className="flex items-center gap-1">
            <span className="w-3.5 h-3.5 bg-orange-100 rounded-full inline-flex items-center justify-center
                             text-orange-600 text-[8px] font-bold flex-shrink-0">✓</span>
            {facultyName}
          </span>
        )}
        {course.duration && (
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-orange-400" />
            {course.duration}
          </span>
        )}
        {course.batchStartDate && (
          <span className="flex items-center gap-1 text-emerald-600">
            <CalendarDays className="h-3 w-3" />
            {new Date(course.batchStartDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </span>
        )}
      </div>
    );
  };

  const PriceRow = ({ large = false }) => {
    if (basePrice === null) return null;
    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className={`font-bold text-orange-600 ${large ? "text-xl" : "text-base"}`}>
          ₹{basePrice.toLocaleString("en-IN")}
        </span>
        {hasRealSale && (
          <span className="text-xs text-gray-400 line-through">
            ₹{regularPrice.toLocaleString("en-IN")}
          </span>
        )}
        {discountPct > 0 && (
          <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded">
            {discountPct}% OFF
          </span>
        )}
      </div>
    );
  };

  /* ══════════════ LIST VIEW ═════════════════════════════ */
  if (viewMode === "list") {
    return (
      <Link
        href={`/courses/${course.slug}`}
        className="group flex flex-row bg-white border border-gray-100 rounded-2xl p-4 overflow-hidden
                   shadow-sm transition-all duration-300 hover:shadow-md hover:border-orange-200"
      >
        {/* Thumbnail */}
        <div className="relative w-32 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          {thumbUrl ? (
            <Image
              src={thumbUrl}
              alt={course.name || "Course"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="128px"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
              <span className="text-lg font-bold text-orange-300">CA</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 min-w-0 ml-5">
          <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-1 mb-1">
            {course.name}
          </h3>
          {facultyName && <p className="text-sm text-gray-500 mb-1">{facultyName}</p>}
          {showRating && (
            <div className="flex items-center gap-1 text-sm mb-1">
              <Star className="h-3.5 w-3.5 text-orange-400 fill-orange-400" />
              {avgRating !== null && <span className="font-bold text-gray-800">{avgRating}</span>}
              {reviewCount !== null && <span className="text-gray-400 text-xs">({reviewCount})</span>}
            </div>
          )}
          {attempts && (
            <div className="flex gap-1 flex-wrap mb-2">
              {attempts.slice(0, 2).map((a) => (
                <span key={a} className="bg-orange-50 text-orange-700 text-xs px-2 py-0.5 rounded-md font-medium">
                  {a}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Price + CTA */}
        <div className="flex flex-col items-end justify-center gap-2 flex-shrink-0">
          {basePrice !== null && (
            <span className="text-xl font-bold text-orange-500">₹{basePrice.toLocaleString("en-IN")}</span>
          )}
          {hasRealSale && regularPrice && (
            <span className="text-sm text-gray-400 line-through">₹{regularPrice.toLocaleString("en-IN")}</span>
          )}
          <span className="text-orange-500 font-semibold text-sm inline-flex items-center gap-1">
            View <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    );
  }

  /* ══════════════ GRID VIEW ═════════════════════════════ */
  const categoryName = course.category?.name || null;
  const showTopBadge = badgeCfg || showFeaturedBadge || (Array.isArray(course.courseTags) && course.courseTags.length > 0);
  const badgeLabel = badgeCfg?.label === "Bestseller" || course.courseTags?.includes("hot-selling") || course.courseTags?.includes("best-seller")
    ? "Bestseller" : course.courseTags?.includes("new-launch") || showFeaturedBadge ? "New" : "Popular";

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group bg-white rounded-2xl overflow-hidden flex flex-col h-full shadow-sm border border-gray-100
                 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden bg-gray-100 flex-shrink-0">
        {thumbUrl ? (
          <Image
            src={thumbUrl}
            alt={course.name || "Course"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
            <span className="text-4xl font-bold text-orange-300">CA MAKER</span>
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300
                        flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold">
            View Course →
          </span>
        </div>
        {/* Top left badge */}
        {showTopBadge && (
          <div className="absolute top-0 left-0 z-10">
            <span className="inline-block bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-br-xl">
              {(badgeLabel === "Bestseller") && "🔥 "}
              {badgeLabel}
            </span>
          </div>
        )}
        {/* Top right category badge */}
        {categoryName && (
          <div className="absolute top-0 right-0 z-10">
            <span className="inline-block bg-black/60 text-white text-xs px-2 py-1 rounded-bl-xl">
              {categoryName}
            </span>
          </div>
        )}
        {discountPct > 0 && !categoryName && (
          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-bl-xl z-10">
            {discountPct}% OFF
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        {facultyName && (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">
                {facultyName.split(" ").map((n) => n[0]).join("").slice(0, 3)}
              </span>
            </div>
            <span className="text-xs text-gray-500">{facultyName}</span>
            {course.duration && (
              <span className="text-gray-400 text-xs">• {course.duration}</span>
            )}
          </div>
        )}

        <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2 mb-2
                       group-hover:text-orange-600 transition-colors">
          {course.name}
        </h3>

        {showRating && (
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < Math.floor(avgRating ?? 0) ? "text-orange-400 fill-orange-400" : "text-gray-300"}`}
              />
            ))}
            {avgRating !== null && <span className="text-sm font-bold text-gray-800">{avgRating}</span>}
            {reviewCount !== null && (
              <span className="text-xs text-gray-400">({reviewCount >= 1000 ? `${(reviewCount / 1000).toFixed(1)}k` : reviewCount})</span>
            )}
          </div>
        )}

        {attempts && (
          <div className="flex gap-1.5 flex-wrap mb-3">
            {attempts.slice(0, 3).map((a) => (
              <span key={a} className="bg-orange-50 text-orange-700 text-xs px-2 py-0.5 rounded-md font-medium">
                {a}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-gray-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 flex-wrap">
              {basePrice !== null && (
                <span className="text-xl font-extrabold text-orange-500">
                  ₹{basePrice.toLocaleString("en-IN")}
                </span>
              )}
              {hasRealSale && regularPrice && (
                <span className="text-xs text-gray-400 line-through ml-1">
                  ₹{regularPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>
            {discountPct > 0 && (
              <span className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-lg">
                {discountPct}% OFF
              </span>
            )}
          </div>
          <span className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-orange-500
                           hover:bg-orange-600 text-white text-sm font-semibold transition-all duration-200">
            View Course <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
