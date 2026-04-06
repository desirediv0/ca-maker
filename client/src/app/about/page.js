"use client";
import {
  RiRecordCircleLine as Target,
  RiArrowRightLine as ArrowRight,
  RiLightbulbLine as Zap,
  RiMessage2Line as MessageSquare,
  RiVideoLine as Video,
  RiArrowRightSLine,
  RiHome4Line,

  RiBarChartBoxLine,
  RiTrophyLine,
  RiShieldCheckLine,
  RiGroupLine,
  RiStarLine,
} from "react-icons/ri";
import Link from "next/link";



const journeyMilestones = [
  { year: "2018", title: "Cleared CA Finals", desc: "Qualified as a Chartered Accountant with distinction." },
  { year: "2019", title: "Joined Big 4", desc: "Started audit career at a leading Big 4 firm." },
  { year: "2023", title: "Founded CA Maker", desc: "Launched CA Maker to simplify CA education." },
  { year: "2024", title: "10,000+ Students", desc: "Crossed 10K enrolled students across India." },
];

const missionCards = [
  {
    icon: Target,
    title: "Make Audit Simple",
    desc: "Break complex standards into easy-to-understand concepts with relatable, real-world examples.",
  },
  {
    icon: RiBarChartBoxLine,
    title: "Practical Learning",
    desc: "Real Big 4 audit scenarios woven into every lesson so you learn how auditing actually works.",
  },
  {
    icon: RiTrophyLine,
    title: "Exam Focused",
    desc: "Structured notes, regular tests, and answer-writing practice designed around examiner expectations.",
  },
];

const whyChoose = [
  { icon: Zap, title: "Concept Clarity", desc: "Every topic explained from scratch with memory techniques that stick." },
  { icon: Target, title: "Exam Strategy", desc: "Know exactly what to write, how to present, and what examiners expect." },
  { icon: Video, title: "Quality Content", desc: "Recorded lectures, live doubt sessions, and comprehensive study material." },
  { icon: MessageSquare, title: "Doubt Support", desc: "Personal mentoring and dedicated doubt resolution for every student." },
];

const instructorTags = [
  "Big 4 Audit Experience",
  "CA Inter Specialist",
  "6+ Years Teaching",
  "Practical Approach",
];

/* ─── Page ────────────────────────────────────────────────── */
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ══ Hero ══ */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1E3A8A 0%, #1E40AF 30%, #2563EB 70%, #3B82F6 100%)",
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <div
            className="absolute -top-20 -right-20 w-[400px] h-[400px] opacity-20"
            style={{ background: "radial-gradient(circle, rgba(96,165,250,0.6), transparent 70%)" }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-8">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1.5">
              <RiHome4Line className="w-3.5 h-3.5" /> Home
            </Link>
            <RiArrowRightSLine className="w-3.5 h-3.5" />
            <span className="text-white font-medium">About</span>
          </nav>

          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-white/30" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-blue-200/60">
              Who We Are
            </span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-white/30" />
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight max-w-2xl">
            Making CA Audit Simple, Relatable &amp; Scoring
          </h1>
          <p className="text-base md:text-lg text-blue-100/70 max-w-xl leading-relaxed">
            Founded by CA Mohit Kukreja — 6+ years of Big 4 audit expertise, now
            dedicated to helping every CA student succeed.
          </p>
        </div>
      </section>

      {/* ══ Instructor + Stats ══ */}
      <section className="py-12 md:py-14 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-14 items-start">

            {/* Instructor — takes 2 cols */}
            <div className="lg:col-span-2">
              <div
                className="rounded-2xl p-7 h-full"
                style={{
                  background: "linear-gradient(170deg, #F8FAFF, #EFF6FF)",
                  border: "1px solid rgba(59, 130, 246, 0.08)",
                }}
              >
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
                  style={{
                    background: "linear-gradient(135deg, #1E40AF, #2563EB)",
                    boxShadow: "0 4px 16px rgba(37, 99, 235, 0.25)",
                  }}
                >
                  <span className="text-white text-2xl font-extrabold tracking-tight">CMK</span>
                </div>

                <h2 className="text-xl font-extrabold text-gray-900 mb-1">CA Mohit Kukreja</h2>
                <p className="text-blue-600 text-sm font-semibold mb-3">
                  Founder, CA Maker
                </p>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">
                  Bringing 6+ years of Big 4 audit experience to help CA students
                  understand Audit through practical, real-world examples. Every concept
                  is taught the way it's applied in actual audit engagements.
                </p>

                <div className="flex flex-wrap gap-2">
                  {instructorTags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-semibold px-3 py-1.5 rounded-lg"
                      style={{
                        background: "rgba(37, 99, 235, 0.06)",
                        color: "#2563EB",
                        border: "1px solid rgba(37, 99, 235, 0.1)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats + quick info — takes 3 cols */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: "10,000+", label: "Students", icon: RiGroupLine },
                  { value: "6 Years", label: "Big 4 Exp.", icon: RiShieldCheckLine },
                  { value: "4.9 / 5", label: "Rating", icon: RiStarLine },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="rounded-2xl p-5 text-center"
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #F0F0F0",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3"
                      style={{
                        background: "rgba(37, 99, 235, 0.06)",
                        border: "1px solid rgba(37, 99, 235, 0.1)",
                      }}
                    >
                      <s.icon className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">{s.value}</p>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Why choose — compact cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                {whyChoose.map(({ icon: Icon, title, desc }, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 rounded-xl p-5"
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #F0F0F0",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: "rgba(37, 99, 235, 0.06)",
                        border: "1px solid rgba(37, 99, 235, 0.1)",
                      }}
                    >
                      <Icon className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{title}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed mt-1">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ Mission ══ */}
      <section
        className="py-12 md:py-14 px-4 sm:px-6"
        style={{ background: "linear-gradient(180deg, #FAFBFF, #FFFFFF)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-blue-400/30" />
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-blue-500/50">
                Our Mission
              </span>
              <div className="h-px w-10 bg-gradient-to-l from-transparent to-blue-400/30" />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              What Drives{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #1E40AF, #3B82F6, #60A5FA)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                CA Maker
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {missionCards.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={i}
                className="rounded-2xl p-7 text-center group transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #EEEEEE",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(59,130,246,0.15)";
                  e.currentTarget.style.boxShadow = "0 8px 28px rgba(37,99,235,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#EEEEEE";
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.03)";
                }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-5
                             transition-transform duration-300 group-hover:scale-105"
                  style={{
                    background: "rgba(37, 99, 235, 0.06)",
                    border: "1px solid rgba(37, 99, 235, 0.1)",
                  }}
                >
                  <Icon className="w-7 h-7 text-blue-500" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Journey ══ */}
      <section className="py-12 md:py-14 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-blue-400/30" />
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-blue-500/50">
                The Journey
              </span>
              <div className="h-px w-10 bg-gradient-to-l from-transparent to-blue-400/30" />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              From Big 4 to{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #1E40AF, #3B82F6, #60A5FA)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                CA Maker
              </span>
            </h2>
          </div>

          {/* Horizontal timeline */}
          <div className="relative max-w-3xl mx-auto">
            {/* Line */}
            <div
              className="hidden md:block absolute top-8 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, #DBEAFE 15%, #93C5FD 50%, #DBEAFE 85%, transparent)" }}
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
              {journeyMilestones.map(({ year, title, desc }, i) => (
                <div key={i} className="text-center relative">
                  {/* Dot */}
                  <div className="flex justify-center mb-4">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center relative z-10"
                      style={{
                        background: "linear-gradient(135deg, #2563EB, #3B82F6)",
                        boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
                      }}
                    >
                      <span className="text-white text-sm font-extrabold">{year}</span>
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">{title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}