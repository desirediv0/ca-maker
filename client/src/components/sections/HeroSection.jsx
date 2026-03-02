"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Play,
} from "lucide-react";
import { fetchApi } from "@/lib/utils";

/* ─── Fallback slides shown if API returns nothing ─────────────── */
const fallbackSlides = [
  {
    label:        "CA Inter & Final — Expert Coaching",
    headline:     "Build Your CA Rank",
    highlight:    "With Confidence",
    description:  "Learn from CA Mohit Kukreja's 6 years of Big 4 audit experience — making Audit simple, relatable, and scoring.",
    desktopImage: "/hero-slide-1.jpg",
    mobileImage:  "/hero-slide-1-sm.jpg",
    link:         "/courses",
  },
];

export default function HeroSection() {
  const [slides,        setSlides]        = useState(fallbackSlides);
  const [current,       setCurrent]       = useState(0);
  const [autoPlay,      setAutoPlay]      = useState(true);
  const [loading,       setLoading]       = useState(true);
  const [isMobile,      setIsMobile]      = useState(false);
  const [imgLoaded,     setImgLoaded]     = useState(false);

  /* ── Detect mobile ── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ── Fetch banners from API ── */
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetchApi("/public/banners");
        if (res?.success && Array.isArray(res.data?.banners) && res.data.banners.length > 0) {
          setSlides(
            res.data.banners.map((b) => ({
              label:        b.label       || "CA Maker",
              headline:     b.title       || "",
              highlight:    b.subtitle    || "",
              description:  b.description || "",
              desktopImage: b.desktopImage,
              mobileImage:  b.mobileImage || b.desktopImage,
              link:         b.link        || "/courses",
            }))
          );
        }
      } catch {
        /* keep fallback */
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  /* ── Auto-play ── */
  const nextSlide = useCallback(
    () => setCurrent((p) => (p + 1) % slides.length),
    [slides.length]
  );
  const prevSlide = () =>
    setCurrent((p) => (p - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (!autoPlay) return;
    const t = setInterval(nextSlide, 5500);
    return () => clearInterval(t);
  }, [autoPlay, nextSlide]);

  const stopAuto = () => setAutoPlay(false);

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <section className="relative w-full bg-gray-900 overflow-hidden" style={{ minHeight: "80vh" }}>
        <div className="absolute inset-0 bg-gray-800 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-start">
          <div className="px-8 md:px-16 space-y-4 w-full max-w-2xl">
            <div className="h-4 bg-gray-700 rounded-full w-40" />
            <div className="h-14 bg-gray-700 rounded-xl w-3/4" />
            <div className="h-14 bg-gray-700 rounded-xl w-1/2" />
            <div className="h-5 bg-gray-700 rounded w-full" />
            <div className="h-5 bg-gray-700 rounded w-4/5" />
            <div className="flex gap-4 pt-4">
              <div className="h-12 bg-gray-700 rounded-full w-40" />
              <div className="h-12 bg-gray-700 rounded-full w-36" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  const slide    = slides[current];
  const imageSrc = isMobile ? slide.mobileImage : slide.desktopImage;

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: "80vh" }}
    >
      {/* ── Background image ── */}
      <div className="absolute inset-0">
        <Image
          src={imageSrc || "/hero-slide-1.png"}
          alt={slide.headline || "CA Maker"}
          fill
          className={`object-cover transition-opacity duration-700 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          priority
          sizes="100vw"
          onLoad={() => setImgLoaded(true)}
        />
        {/* Dark gradient overlay — strong on left, lighter on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
        {/* Bottom fade for smooth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* ── Content ── */}
      <div
        className="relative z-10 flex items-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-14 py-20">
          <div className="max-w-2xl">

            {/* Label pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/40 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              <span className="text-sm font-semibold text-orange-300 tracking-wide">
                {slide.label}
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] text-white mb-2 drop-shadow-lg">
              {slide.headline}
            </h1>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-black leading-[1.05] mb-7"
              style={{ color: "#F97316", textShadow: "0 2px 20px rgba(249,115,22,0.4)" }}>
              {slide.highlight}
            </h2>

            <p className="text-lg text-white/75 leading-relaxed max-w-lg mb-10">
              {slide.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link href={slide.link}>
                <button className="group h-14 px-8 rounded-full font-bold text-base text-white
                                   bg-orange-500 hover:bg-orange-600 transition-all duration-200
                                   flex items-center gap-2 shadow-lg shadow-orange-500/30">
                  Explore Courses
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/courses">
                <button className="group h-14 px-8 rounded-full font-semibold text-base text-white
                                   border-2 border-white/30 hover:border-orange-400 hover:text-orange-300
                                   transition-all duration-200 flex items-center gap-2 backdrop-blur-sm">
                  <Play className="h-4 w-4" />
                  View Batches
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Nav arrows ── */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => { stopAuto(); prevSlide(); }}
            className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20
                       w-11 h-11 rounded-full bg-white/10 hover:bg-white/20
                       border border-white/20 flex items-center justify-center
                       backdrop-blur-sm transition-all duration-200"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <button
            onClick={() => { stopAuto(); nextSlide(); }}
            className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20
                       w-11 h-11 rounded-full bg-white/10 hover:bg-white/20
                       border border-white/20 flex items-center justify-center
                       backdrop-blur-sm transition-all duration-200"
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </button>
        </>
      )}

      {/* ── Slide dots ── */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => { stopAuto(); setCurrent(idx); }}
              className={`rounded-full transition-all duration-300 ${
                idx === current
                  ? "w-8 h-2.5 bg-orange-500"
                  : "w-2.5 h-2.5 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
