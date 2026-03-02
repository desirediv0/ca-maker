"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { fetchApi } from "@/lib/utils";

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [current, setCurrent]           = useState(0);
  const [loading, setLoading]           = useState(true);

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
    <section className="py-16 md:py-20 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-orange-100 border border-orange-200
                           text-orange-600 text-xs font-bold uppercase tracking-widest rounded-full mb-4">
            Student Success Stories
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            What Our Students Say
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-[#F9FAFB] rounded-xl border border-gray-100 p-8 md:p-10">
            {/* Stars */}
            {t.rating > 0 && (
              <div className="flex gap-1 mb-5">
                {[...Array(Math.min(t.rating, 5))].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-orange-400 fill-orange-400" />
                ))}
              </div>
            )}

            {/* Text */}
            {t.text && (
              <p className="text-gray-700 leading-relaxed text-base italic mb-6">
                &ldquo;{t.text}&rdquo;
              </p>
            )}

            {/* Result badge */}
            {t.result && (
              <div className="inline-flex items-center gap-1.5 bg-orange-100 border border-orange-200
                              text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                ✓ {t.result}
              </div>
            )}

            {/* Author */}
            <div className="flex items-center gap-3 pt-5 border-t border-gray-200">
              <div className="w-11 h-11 bg-orange-500 rounded-full flex items-center justify-center
                              text-white font-bold text-base flex-shrink-0">
                {t.name?.charAt(0) || "S"}
              </div>
              <div>
                {t.name && <p className="font-bold text-gray-900 text-sm">{t.name}</p>}
                {(t.role || t.exam) && (
                  <p className="text-xs text-gray-400">
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
                    className={`h-1.5 rounded-full transition-all ${
                      i === current ? "w-6 bg-orange-500" : "w-1.5 bg-gray-300"
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
