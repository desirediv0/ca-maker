"use client";

import { useEffect, useRef, useState } from "react";
import { RiTeamLine, RiAwardLine, RiGraduationCapLine, RiBookOpenLine } from "react-icons/ri";

const STATS = [
  {
    icon: RiTeamLine,
    raw: 1000,
    suffix: "+",
    label: "Students Enrolled",
    description: "CA aspirants learning with us",
  },
  {
    icon: RiAwardLine,
    raw: 95,
    suffix: "%+",
    label: "Success Rate",
    description: "Students clearing their exams",
  },
  {
    icon: RiGraduationCapLine,
    raw: 6,
    suffix: "+ Yrs",
    label: "Big 4 Experience",
    description: "Faculty with real-world expertise",
  },
  {
    icon: RiBookOpenLine,
    raw: 50,
    suffix: "+",
    label: "Course Programs",
    description: "Across CA Foundation, Inter & Final",
  },
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
  const Icon  = stat.icon;

  return (
    <div
      className="stat-card-enter group relative bg-white rounded-2xl p-7
                 border border-gray-100 hover:border-orange-200
                 shadow-[0_2px_16px_rgba(0,0,0,0.06)]
                 hover:shadow-[0_16px_48px_rgba(251,146,60,0.15)]
                 hover:-translate-y-1.5
                 transition-all duration-300 ease-out cursor-default overflow-hidden"
      style={{ animationDelay: `${index * 120}ms` }}
    >
      {/* Background accent */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: "linear-gradient(135deg, rgba(251,146,60,0.03) 0%, transparent 60%)",
        }}
      />

      {/* Icon */}
      <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center
                      justify-center mb-5 group-hover:bg-gradient-to-br
                      group-hover:from-orange-400 group-hover:to-orange-600
                      transition-all duration-300 flex-shrink-0">
        <Icon className="h-5.5 w-5.5 text-orange-500 group-hover:text-white transition-colors duration-300" size={22} />
      </div>

      {/* Count */}
      <div className="mb-1 leading-none">
        <span className="text-4xl font-black text-gray-900 tabular-nums">
          {count.toLocaleString("en-IN")}
        </span>
        <span className="text-2xl font-black text-orange-500 ml-1">
          {stat.suffix}
        </span>
      </div>

      <p className="text-sm font-bold text-gray-800 mt-2.5 mb-1">{stat.label}</p>
      <p className="text-xs text-gray-500 leading-relaxed">{stat.description}</p>

      {/* Bottom accent */}
      <div className="mt-5 h-0.5 w-8 rounded-full
                      group-hover:w-full transition-all duration-500"
           style={{ background: "linear-gradient(90deg, #fb923c, #facc15)" }} />
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
    <section
      ref={ref}
      className="relative py-10 overflow-hidden bg-white"
    >
      {/* Subtle background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 100%, rgba(251,146,60,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-500 mb-3">
            By the Numbers
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">
            Our Impact So Far
          </h2>
          <p className="text-gray-500 text-base max-w-md mx-auto leading-relaxed">
            Trusted by ambitious CA aspirants across India
          </p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="h-px w-16 bg-orange-100 rounded-full" />
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: "linear-gradient(135deg, #fb923c, #facc15)" }}
            />
            <div className="h-px w-16 bg-orange-100 rounded-full" />
          </div>
        </div>

        {/* Cards */}
        {visible && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {STATS.map((stat, i) => (
              <StatCard key={i} stat={stat} index={i} active={active} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
