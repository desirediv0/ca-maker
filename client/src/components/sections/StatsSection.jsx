"use client";

import { useEffect, useRef, useState } from "react";
import {
  RiTeamLine,
  RiAwardLine,
  RiGraduationCapLine,
  RiBookOpenLine,
} from "react-icons/ri";

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

function StatCard({ stat, index, active, visible }) {
  const count = useCountUp(stat.raw, 1600 + index * 80, active);
  const displayVal = stat.isDecimal ? stat.raw : count.toLocaleString("en-IN");
  const Icon = stat.icon;

  return (
    <div
      className={`relative text-center group transition-all duration-700 ease-out
                  ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${150 + index * 120}ms` }}
    >
      {/* Card */}
      <div
        className="relative rounded-2xl px-6 py-8 transition-all duration-300
                   hover:-translate-y-1"
        style={{
          background:
            "linear-gradient(170deg, rgba(15, 23, 42, 0.95), rgba(10, 18, 40, 0.98))",
          border: "1px solid rgba(59, 130, 246, 0.1)",
          boxShadow:
            "0 4px 24px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.03)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.3)";
          e.currentTarget.style.boxShadow =
            "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 30px rgba(59, 130, 246, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.1)";
          e.currentTarget.style.boxShadow =
            "0 4px 24px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.03)";
        }}
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center
                       transition-transform duration-300 group-hover:scale-105"
            style={{
              background: "rgba(59, 130, 246, 0.1)",
              border: "1px solid rgba(59, 130, 246, 0.15)",
            }}
          >
            <Icon className="w-6 h-6 text-blue-400" />
          </div>
        </div>

        {/* Number */}
        <div
          className="text-3xl md:text-4xl font-extrabold tabular-nums tracking-tight mb-1"
          style={{
            background: "linear-gradient(135deg, #FFFFFF 20%, #93C5FD 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {displayVal}
          {stat.suffix}
        </div>

        {/* Label */}
        <p className="text-blue-200/40 text-sm font-medium tracking-wide">
          {stat.label}
        </p>

        {/* Bottom accent bar */}
        <div
          className="absolute bottom-0 left-8 right-8 h-[2px] rounded-full opacity-0
                     group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "linear-gradient(90deg, transparent, #3B82F6, transparent)",
          }}
        />
      </div>
    </div>
  );
}

export default function StatsSection() {
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);

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
      className="relative overflow-hidden py-16 md:py-20"
      style={{
        background:
          "linear-gradient(175deg, #020817 0%, #0A1628 40%, #0C1E3E 70%, #020817 100%)",
      }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, #3B82F6 30%, #60A5FA 50%, #3B82F6 70%, transparent)",
          }}
        />

        {/* Radial glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] opacity-[0.05]"
          style={{
            background:
              "radial-gradient(ellipse, #3B82F6, transparent 70%)",
          }}
        />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, #3B82F6 30%, #60A5FA 50%, #3B82F6 70%, transparent)",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section header */}
        <div
          className={`text-center mb-12 transition-all duration-700 ease-out
                      ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >

          <h2
            className="text-2xl md:text-3xl font-extrabold tracking-tight"
            style={{
              background: "linear-gradient(135deg, #FFFFFF 30%, #93C5FD 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Trusted by Thousands
          </h2>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {STATS.map((stat, i) => (
            <StatCard
              key={i}
              stat={stat}
              index={i}
              active={active}
              visible={visible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}