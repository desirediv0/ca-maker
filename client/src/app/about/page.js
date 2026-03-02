import {
  RiBookOpenLine as BookOpen,
  RiGroupLine as Users,
  RiTrophyLine as Trophy,
  RiRecordCircleLine as Target,
  RiCheckboxCircleLine as CheckCircle,
  RiArrowRightLine as ArrowRight,
  RiGraduationCapLine as GraduationCap,
  RiAwardLine as Award,
  RiLightbulbLine as Zap,
  RiShieldCheckLine as Shield,
} from "react-icons/ri";
import Link from "next/link";

export const metadata = {
  title: "About Us | CA Maker – CA Mohit Kukreja",
  description:
    "Learn about CA Maker and CA Mohit Kukreja – bringing 6 years of Big 4 audit expertise to make CA Inter Audit simple, relatable, and scoring.",
};

/* ─── Static data ─────────────────────────────────────────── */
const stats = [
  { value: "6+", label: "Years Big 4 Experience", icon: Trophy },
  { value: "1000+", label: "Students Mentored", icon: Users },
  { value: "95%+", label: "Success Rate", icon: Award },
  { value: "50+", label: "Courses Available", icon: BookOpen },
];

const whyUs = [
  {
    icon: BookOpen,
    title: "Simple Explanations",
    description:
      "No complicated jargon. Every concept is broken into easy language with relatable memory techniques that stick.",
  },
  {
    icon: Target,
    title: "Exam-Oriented Approach",
    description:
      "Structured notes for quick revision, regular tests, and exam-oriented practice to ensure full preparation.",
  },
  {
    icon: Users,
    title: "Personal Mentoring",
    description:
      "One-on-one guidance sessions and dedicated doubt support to help you overcome every challenge.",
  },
  {
    icon: Shield,
    title: "Big 4 Practical Examples",
    description:
      "Real-world Big 4 audit examples woven into every class to make Audit relatable and easy to score.",
  },
];

const highlights = [
  "Big 4 Expertise",
  "Daily Written Practice",
  "Latest ICAI Amendments",
  "Personal Mentoring",
  "Structured Notes",
  "Regular Tests",
];

const benefits = [
  "Simple explanations with relatable memory techniques",
  "Structured notes for quick revision",
  "Focus on daily written practice",
  "Regular tests & exam-oriented practice",
  "Latest ICAI amendments covered clearly",
  "Doubt support & personal mentoring",
];

/* ─── Page ────────────────────────────────────────────────── */
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ══ Hero ══ */}
      <section className="py-12 bg-[#F9FAFB] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-700 font-medium">About</span>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left: Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 border border-orange-200
                              rounded-full text-orange-600 text-xs font-bold uppercase tracking-widest mb-7">
                <GraduationCap className="w-3.5 h-3.5" />
                About CA Maker
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-5 leading-tight tracking-tight">
                Making Audit{" "}
                <span className="text-orange-500">Simple &amp; Scoring</span>
              </h1>

              <p className="text-lg text-gray-500 mb-5 leading-relaxed">
                CA Mohit Kukreja brings 6&nbsp;years of Big&nbsp;4 audit expertise
                to CA Maker — incorporating practical examples to make Audit
                simple, relatable, and scoring for every CA student.
              </p>

              {/* Highlight pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {highlights.map((h, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border
                               border-orange-200 rounded-full text-sm text-orange-700 font-medium
                               shadow-sm"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-orange-500" />
                    {h}
                  </span>
                ))}
              </div>

              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-orange-500
                           hover:bg-orange-600 text-white rounded-xl font-semibold text-sm
                           transition-colors shadow-sm shadow-orange-200"
              >
                Explore Courses <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right: Founder card */}
            <div className="flex justify-center md:justify-end">
              <div className="relative w-72 md:w-80">
                {/* Main card */}
                <div className="bg-white rounded-xl border-2 border-orange-100 overflow-hidden
                                shadow-sm" style={{ boxShadow: "0 4px 24px rgba(249,115,22,0.10)" }}>
                  {/* Top colored strip */}
                  <div className="h-3 bg-orange-500 w-full" />

                  <div className="p-8 text-center">
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-full bg-orange-500 flex items-center
                                    justify-center mx-auto mb-4 shadow-md shadow-orange-200">
                      <span className="text-white text-3xl font-black tracking-tight">MK</span>
                    </div>

                    <p className="text-gray-900 font-bold text-lg mb-0.5">CA Mohit Kukreja</p>
                    <p className="text-orange-500 text-sm font-semibold mb-5">Founder &amp; Faculty, CA Maker</p>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                      {[
                        { value: "6+", label: "Yrs Big 4" },
                        { value: "1K+", label: "Students" },
                        { value: "95%", label: "Success" },
                      ].map(({ value, label }) => (
                        <div key={label} className="text-center">
                          <p className="font-black text-orange-500 text-xl leading-none">{value}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5 font-medium">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-4 -right-4 bg-white border border-orange-200
                                rounded-xl px-4 py-2.5 shadow-md">
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Experience</p>
                  <p className="text-orange-500 font-black text-lg leading-tight">6+ Years</p>
                  <p className="text-[10px] text-gray-500">Big 4 Audit</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ Stats Strip ══ */}
      <section className="bg-white border-b border-gray-100 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map(({ value, label, icon: Icon }, i) => (
              <div
                key={i}
                className={`flex flex-col items-center py-8 px-6 text-center
                            ${i < stats.length - 1 ? "lg:border-r border-gray-100" : ""}
                            ${i % 2 === 0 ? "border-r border-gray-100 lg:border-r-0" : ""}
                            ${i < 2 ? "border-b border-gray-100 lg:border-b-0" : ""}`}
              >
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-orange-500" />
                </div>
                <p className="text-4xl font-black text-gray-900 mb-1 leading-none">{value}</p>
                <p className="text-sm text-gray-400 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Founder Story ══ */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section label */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gray-100" />
            <span className="px-4 py-1.5 bg-orange-50 border border-orange-200 text-orange-600
                             text-xs font-bold uppercase tracking-widest rounded-full whitespace-nowrap">
              Meet the Founder
            </span>
            <div className="h-px flex-1 bg-gray-100" />
          </div>

          <div className="grid md:grid-cols-5 gap-8 items-start">
            {/* Left quote / accent */}
            <div className="md:col-span-2">
              <div className="bg-[#F9FAFB] rounded-xl border border-gray-100 p-7">
                <div className="text-5xl text-orange-300 font-serif leading-none mb-4">&ldquo;</div>
                <p className="text-xl font-bold text-gray-900 leading-snug mb-4">
                  Here, you don&apos;t just study Audit —{" "}
                  <span className="text-orange-500">you understand it.</span>
                </p>
                <div className="h-px bg-orange-100 mb-4" />
                <p className="text-sm text-gray-500 font-medium">— CA Mohit Kukreja</p>
              </div>
            </div>

            {/* Right content */}
            <div className="md:col-span-3">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-5 tracking-tight">
                CA Mohit Kukreja
              </h2>
              <p className="text-gray-500 leading-relaxed mb-5">
                <strong className="text-gray-900">CA Mohit Kukreja</strong> brings his{" "}
                <strong className="text-gray-900">6&nbsp;years of audit expertise from Big&nbsp;4</strong>{" "}
                firms to CA Maker — incorporating practical real-world examples in every
                class to make Audit simple, relatable, and scoring.
              </p>
              <p className="text-gray-500 leading-relaxed mb-6">
                We understand what students go through — bulky Standards on Auditing,
                confusing language, presentation pressure, and the fear of writing answers.
                That is why our classes are designed to break every concept into easy
                language, practical examples, and exam-focused formats.
              </p>

              {/* Inline stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: "6+", label: "Years Big 4" },
                  { value: "1000+", label: "Students" },
                  { value: "95%+", label: "Success Rate" },
                ].map(({ value, label }) => (
                  <div key={label} className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-center">
                    <p className="text-2xl font-black text-orange-500 leading-none mb-1">{value}</p>
                    <p className="text-xs text-gray-500 font-medium">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ Why Choose Us ══ */}
      <section className="py-12 bg-[#F9FAFB] border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 border border-orange-200
                            rounded-full text-orange-600 text-xs font-bold uppercase tracking-widest mb-5">
              Our Approach
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tight">
              What Makes Us Different?
            </h2>
            <p className="text-gray-500 text-base">
              A comprehensive approach to CA Inter Audit preparation
            </p>
          </div>

          {/* 4 cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {whyUs.map(({ icon: Icon, title, description }, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 border border-gray-100
                           hover:border-orange-200 hover:-translate-y-0.5
                           hover:shadow-[0_6px_24px_rgba(249,115,22,0.10)]
                           shadow-[0_1px_6px_rgba(0,0,0,0.04)]
                           transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-5">
                  <Icon className="h-5 w-5 text-orange-500" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
                  {title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>

          {/* Benefits checklist */}
          <div className="bg-white rounded-xl p-8 border border-gray-100">
            <h3 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-5 h-5 bg-orange-500 rounded-md flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
              Additional Benefits
            </h3>
            <ul className="grid sm:grid-cols-2 gap-3">
              {benefits.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-500 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ══ Mission ══ */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 border border-orange-200
                          rounded-full text-orange-600 text-xs font-bold uppercase tracking-widest mb-7">
            Our Mission
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-5 tracking-tight">
            Building Confidence, Not Just Knowledge
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed mb-7 max-w-2xl mx-auto">
            Whether it&apos;s your first attempt or a comeback attempt, we guide you
            step-by-step — from understanding Standards on Auditing to confidently
            attempting the paper.
          </p>

          {/* Highlight box */}
          <div className="bg-[#F9FAFB] border border-orange-100 rounded-xl p-8 md:p-10 text-left
                          max-w-2xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 mb-2">
                  Our goal is not just to help you pass.
                </p>
                <p className="text-gray-500 mb-3 leading-relaxed text-sm">
                  Our goal is to help you walk into the exam hall feeling prepared
                  and confident.
                </p>
                <p className="text-orange-500 font-bold text-base border-l-4 border-orange-500 pl-4">
                  Because when concepts are clear, confidence follows.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="py-10 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-3">
            Start Today
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Master CA Inter Audit?
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-9 text-sm">
            Join CA Maker and learn from Big&nbsp;4 expertise with practical,
            exam-focused preparation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-orange-500
                         hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors"
            >
              View Courses <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border
                         border-white/20 hover:border-orange-400 text-white hover:text-orange-400
                         rounded-xl font-semibold transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
