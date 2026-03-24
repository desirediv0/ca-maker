import {
  RiRecordCircleLine as Target,
  RiArrowRightLine as ArrowRight,
  RiLightbulbLine as Zap,
  RiMessage2Line as MessageSquare,
  RiVideoLine as Video,
} from "react-icons/ri";
import Link from "next/link";

export const metadata = {
  title: "About Us | CA Maker – CA Mohit Kukreja",
  description:
    "Learn about CA Maker and CA Mohit Kukreja – bringing 6 years of Big 4 audit expertise to make CA Inter Audit simple, relatable, and scoring.",
};

const journeyMilestones = [
  { year: "2018", title: "Cleared CA Finals", desc: "Qualified as Chartered Accountant" },
  { year: "2019", title: "Joined Big 4", desc: "Audit Department — Deloitte/KPMG" },
  { year: "2023", title: "Started CA Maker", desc: "Founded CA Maker with a vision" },
  { year: "2024", title: "10,000+ Students", desc: "Students enrolled across India" },
];

const missionCards = [
  { emoji: "🎯", title: "Make Audit Simple", desc: "Break complex standards into easy-to-understand concepts with relatable examples." },
  { emoji: "📈", title: "Practical Learning", desc: "Real-world Big 4 audit scenarios woven into every lesson for practical understanding." },
  { emoji: "🏆", title: "Exam Focused", desc: "Structured notes, regular tests, and answer-writing practice for exam success." },
];

const whyChoose = [
  { icon: Zap, title: "Concept Clarity", desc: "Every topic explained from scratch with memory techniques that stick." },
  { icon: Target, title: "Exam Strategy", desc: "Know exactly what to write, how to present, and what examiners expect." },
  { icon: Video, title: "Quality Content", desc: "Recorded lectures, live doubt sessions, and comprehensive study material." },
  { icon: MessageSquare, title: "Doubt Support", desc: "Personal mentoring and dedicated doubt resolution for every student." },
];

/* ─── Page ────────────────────────────────────────────────── */
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ══ Hero Section ══ */}
      <section className="py-20 px-4 sm:px-6 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-full text-sm font-medium mb-4">
                About CA Maker
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                Making CA Audit Simple, Relatable &amp; Scoring
              </h1>
              <p className="text-gray-400 text-lg mt-4 leading-relaxed">
                Founded by CA Mohit Kukreja with 6 years of Big 4 experience —
                incorporating practical examples to make Audit simple, relatable,
                and scoring for every CA student.
              </p>
              {/* Inline stats */}
              <div className="flex flex-wrap items-center gap-4 mt-6">
                <div>
                  <p className="text-orange-500 font-bold text-xl">10,000+</p>
                  <p className="text-gray-400 text-sm">Students</p>
                </div>
                <span className="text-gray-600">|</span>
                <div>
                  <p className="text-orange-500 font-bold text-xl">6 Yrs</p>
                  <p className="text-gray-400 text-sm">Big 4</p>
                </div>
                <span className="text-gray-600">|</span>
                <div>
                  <p className="text-orange-500 font-bold text-xl">4.9★</p>
                  <p className="text-gray-400 text-sm">Rating</p>
                </div>
              </div>
            </div>

            {/* Right - Instructor card */}
            <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700">
              <div className="w-24 h-24 rounded-2xl bg-orange-500 text-white text-3xl font-bold flex items-center justify-center mb-4">
                CMK
              </div>
              <h2 className="text-2xl font-bold text-white">CA Mohit Kukreja</h2>
              <p className="text-orange-400 text-sm font-medium mt-1">
                Founder, CA Maker | CA Inter Audit Specialist
              </p>
              <p className="text-gray-400 text-sm leading-relaxed mt-3">
                Bringing 6+ years of Big 4 audit experience to help CA students
                understand Audit through practical, real-world examples.
              </p>
              <div className="flex flex-wrap gap-2 mt-5">
                {["Big 4 Experience", "CA Inter Expert", "6+ Years"].map((tag) => (
                  <span key={tag} className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ Mission Section ══ */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Mission</h2>
            <div className="w-12 h-1 bg-orange-500 rounded-full mx-auto mt-2" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {missionCards.map(({ emoji, title, desc }, i) => (
              <div key={i} className="bg-orange-50 rounded-2xl p-8 text-center">
                <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4 text-2xl">
                  {emoji}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Journey / Timeline Section ══ */}
      <section className="py-16 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">CA Mohit&apos;s Journey</h2>
            <div className="w-12 h-1 bg-orange-500 rounded-full mx-auto mt-2" />
          </div>
          <div className="relative max-w-2xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-orange-500 -translate-x-1/2 hidden md:block" />
            {journeyMilestones.map(({ year, title, desc }, i) => (
              <div
                key={i}
                className={`relative flex items-center gap-6 mb-12 last:mb-0
                  ${i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"}`}
              >
                <div className={`flex-1 ${i % 2 === 1 ? "md:text-right" : "md:text-left"}`}>
                  <span className="inline-block bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold mb-2">
                    {year}
                  </span>
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 max-w-xs md:max-w-full md:inline-block">
                    <h3 className="font-bold text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{desc}</p>
                  </div>
                </div>
                <div className="hidden md:block w-4 h-4 rounded-full bg-orange-500 flex-shrink-0 z-10" />
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Why CA Maker Section ══ */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why Students Choose CA Maker</h2>
            <div className="w-12 h-1 bg-orange-500 rounded-full mx-auto mt-2" />
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {whyChoose.map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-orange-500" />
                </div>
                <h3 className="font-bold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{desc}</p>
              </div>
            ))}
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
