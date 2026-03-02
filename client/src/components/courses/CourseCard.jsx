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
  hot:      { label: "HOT",      Icon: Flame,    bg: "bg-orange-500"  },
  new:      { label: "NEW",      Icon: Sparkles, bg: "bg-emerald-500" },
  featured: { label: "Featured", Icon: Award,    bg: "bg-yellow-500"  },
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
  const badgeCfg    = badge ? BADGES[badge] : null;

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
  const basePrice    = safePrice(course.basePrice);
  const regularPrice = safePrice(course.regularPrice);
  const hasRealSale  = course.hasSale === true && regularPrice && basePrice && regularPrice > basePrice;
  const discountPct  = hasRealSale
    ? Math.round(((regularPrice - basePrice) / regularPrice) * 100)
    : 0;

  /* ── Rating — only show if avgRating is a positive number ── */
  const avgRating   = safePrice(course.avgRating);
  const reviewCount = Number(course.reviewCount) > 0 ? Number(course.reviewCount) : null;
  const showRating  = avgRating !== null; // requires a real score; count alone is not enough

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
        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md text-white ${badgeCfg.bg}`}>
          <badgeCfg.Icon className="h-2.5 w-2.5" />
          {badgeCfg.label}
        </span>
      )}
      {showFeaturedBadge && (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-yellow-400 text-black">
          Featured
        </span>
      )}
      {isDigital && (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500 text-white">
          Digital
        </span>
      )}
    </div>
  );

  const MetaInfo = () => {
    const hasMeta = facultyName || course.duration || course.batchStartDate;
    if (!hasMeta) return null;
    return (
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
        {facultyName && (
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
          <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-md">
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
        href={`/products/${course.slug}`}
        className="group flex flex-row bg-white border border-gray-100 rounded-[10px] overflow-hidden
                   transition-all duration-300 hover:shadow-md hover:border-orange-200"
        style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}
      >
        {/* Thumbnail */}
        <div className="relative w-36 sm:w-44 flex-shrink-0 overflow-hidden bg-orange-50/60 self-stretch">
          {thumbUrl ? (
            <Image
              src={thumbUrl}
              alt={course.name || "Course"}
              fill
              className="object-contain p-3 group-hover:scale-105 transition-transform duration-500"
              sizes="176px"
            />
          ) : (
            <div className="flex items-center justify-center h-full min-h-[120px]">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <span className="text-xl">📚</span>
              </div>
            </div>
          )}
          <BadgesLeft />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-snug line-clamp-2 mb-2
                         group-hover:text-orange-600 transition-colors">
            {course.name}
          </h3>

          {showRating && (
            <div className="flex items-center gap-1 text-xs mb-2">
              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
              {avgRating !== null && <span className="font-semibold text-gray-800">{avgRating}</span>}
              {reviewCount !== null && <span className="text-gray-400">({reviewCount})</span>}
            </div>
          )}

          <MetaInfo />

          {attempts && (
            <div className="flex flex-wrap gap-1 mt-2">
              {attempts.slice(0, 3).map((a) => (
                <span key={a} className="text-[10px] bg-orange-50 text-orange-700 border border-orange-100
                                         px-1.5 py-0.5 rounded-md font-medium">
                  {a}
                </span>
              ))}
            </div>
          )}

          <div className="mt-auto pt-2 border-t border-gray-100 flex items-center justify-between gap-3">
            <PriceRow large />
            <span className="text-orange-500 group-hover:translate-x-1 transition-transform
                             inline-flex items-center text-sm font-semibold whitespace-nowrap flex-shrink-0">
              View <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  /* ══════════════ GRID VIEW ═════════════════════════════ */
  return (
    <Link
      href={`/products/${course.slug}`}
      className="group bg-white border border-gray-100 rounded-[10px] overflow-hidden
                 flex flex-col h-full transition-all duration-300"
      style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.06)", transition: "box-shadow 0.3s, transform 0.3s" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 28px rgba(249,115,22,0.13), 0 2px 8px rgba(0,0,0,0.06)";
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 1px 6px rgba(0,0,0,0.06)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden bg-orange-50/60 flex-shrink-0">
        {thumbUrl ? (
          <Image
            src={thumbUrl}
            alt={course.name || "Course"}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
          </div>
        )}
        <BadgesLeft />
        {discountPct > 0 && (
          <div className="absolute top-2.5 right-2.5 bg-orange-500 text-white text-[10px] font-bold
                          px-2 py-0.5 rounded-md z-10">
            {discountPct}% OFF
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-2
                       group-hover:text-orange-600 transition-colors">
          {course.name}
        </h3>

        {showRating && (
          <div className="flex items-center gap-1 text-xs mb-2">
            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
            {avgRating !== null && <span className="font-semibold text-gray-800">{avgRating}</span>}
            {reviewCount !== null && <span className="text-gray-400">({reviewCount})</span>}
          </div>
        )}

        {(facultyName || course.duration || course.batchStartDate) && (
          <div className="mb-2"><MetaInfo /></div>
        )}

        {attempts && (
          <div className="flex flex-wrap gap-1 mb-2">
            {attempts.slice(0, 2).map((a) => (
              <span key={a} className="text-[10px] bg-orange-50 text-orange-700 border border-orange-100
                                       px-1.5 py-0.5 rounded-md font-medium">
                {a}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-2.5 border-t border-gray-100 flex items-center justify-between gap-2">
          <PriceRow />
          <span className="text-orange-500 group-hover:translate-x-1 transition-transform
                           inline-flex items-center text-xs font-semibold whitespace-nowrap flex-shrink-0">
            View <ArrowRight className="h-3 w-3 ml-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
