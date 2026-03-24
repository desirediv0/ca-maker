"use client";

import { useEffect, useRef, useState } from "react";
import { RiTeamLine, RiAwardLine, RiGraduationCapLine, RiBookOpenLine } from "react-icons/ri";

const STATS = [
  { icon: RiTeamLine, raw: 10000, suffix: "+", label: "Students Enrolled" },
  { icon: RiGraduationCapLine, raw: 6, suffix: " Yrs", label: "Big 4 Experience" },
  { icon: RiAwardLine, raw: 4.9, suffix: "★", label: "Average Rating", isDecimal: true },
  { icon: RiBookOpenLine, raw: 95, suffix: "%", label: "Pass Rate Improvement" },
];

function useCountUp(target, duration = 1600, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let current = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return count;
}

function StatCard({ stat, index, active }) {
  const count = useCountUp(stat.raw, 1600 + index * 80, active);
  const displayVal = stat.isDecimal ? stat.raw : count.toLocaleString("en-IN");

  return (
    <div
      className="stat-card-enter text-center"
      style={{ animationDelay: `${index * 120}ms` }}
    >
      <div className="text-4xl md:text-5xl font-bold text-[#F97316] tabular-nums">
        {displayVal}{stat.suffix}
      </div>
      <p className="mt-2 text-sm font-medium text-[#111827]">{stat.label}</p>
    </div>
  );
}

export default function StatsSection() {
  const ref = useRef(null);
  const [active,   setActive]   = useState(false);
  const [visible,  setVisible]  = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative py-16 md:py-20 overflow-hidden bg-white">
      {/* Top orange divider */}
      <div className="h-0.5 bg-[#F97316]/30" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {visible && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {STATS.map((stat, i) => (
              <StatCard key={i} stat={stat} index={i} active={active} />
            ))}
          </div>
        )}
      </div>
      {/* Bottom orange divider */}
      <div className="h-0.5 bg-[#F97316]/30" />
    </section>
  );
}
