"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { fetchApi } from "@/lib/utils";

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetchApi("/public/testimonials");
        if (res?.success && Array.isArray(res.data?.testimonials)) {
          setTestimonials(res.data.testimonials);
        }
      } catch {
        /* No testimonials endpoint yet — section stays hidden */
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  /* Hide entirely if no data from API */
  if (loading || testimonials.length === 0) return null;

  const t = testimonials[current];

  return (
    <section className="py-12 md:py-16 bg-[#FFF7ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Students Say
          </h2>
          <div className="divider-orange mx-auto mb-4" />
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded shadow-sm p-8 md:p-10 border border-gray-100">
            {/* Quote icon */}
            <div className="flex justify-start mb-4">
              <svg className="w-10 h-10 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v7h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v7h-9.983z" />
              </svg>
            </div>

            {/* Stars */}
            {t.rating > 0 && (
              <div className="flex gap-1 mb-5">
                {[...Array(Math.min(t.rating, 5))].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-orange-500 fill-orange-500" />
                ))}
              </div>
            )}

            {/* Text */}
            {t.text && (
              <p className="text-gray-700 leading-relaxed text-base md:text-lg italic mb-6">
                &ldquo;{t.text}&rdquo;
              </p>
            )}

            {/* Result badge */}
            {t.result && (
              <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700
                              font-semibold text-sm px-4 py-2 rounded-full mb-6">
                ✓ {t.result}
              </div>
            )}

            {/* Author */}
            <div className="flex items-center gap-3 pt-5 border-t border-gray-200">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center
                              text-white font-bold text-base flex-shrink-0">
                {t.name?.charAt(0) || "S"}
              </div>
              <div>
                {t.name && <p className="font-bold text-gray-900">{t.name}</p>}
                {(t.role || t.exam) && (
                  <p className="text-sm text-gray-500">
                    {[t.role, t.exam].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Navigation — only show if > 1 testimonial */}
          {testimonials.length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => setCurrent((current - 1 + testimonials.length) % testimonials.length)}
                className="w-9 h-9 rounded-full border border-gray-200 hover:border-orange-300
                           hover:text-orange-500 flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex gap-1.5">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-1.5 rounded-full transition-all ${i === current ? "w-6 bg-orange-500" : "w-1.5 bg-gray-300"
                      }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setCurrent((current + 1) % testimonials.length)}
                className="w-9 h-9 rounded-full border border-gray-200 hover:border-orange-300
                           hover:text-orange-500 flex items-center justify-center transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
