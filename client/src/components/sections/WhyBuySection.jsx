import { BookOpen, Target, Users, Award } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Simple Explanations",
    description:
      "No complicated jargon. Every concept broken into easy language with relatable memory techniques that stick for exams.",
  },
  {
    icon: Target,
    title: "Exam-Oriented Approach",
    description:
      "Structured notes for quick revision, regular tests, and exam-focused practice to ensure total preparation.",
  },
  {
    icon: Users,
    title: "Personal Mentoring",
    description:
      "One-on-one guidance sessions with doubt support to help you overcome every challenge in your CA journey.",
  },
  {
    icon: Award,
    title: "Big 4 Expertise",
    description:
      "Real-world Big 4 audit examples incorporated into classes — making Audit relatable, practical, and scoring.",
  },
];

export const WhyBuySection = () => {
  return (
    <section className="section-padding bg-white">
      <div className="section-container">

        {/* ── Header ── */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="section-label mb-4 inline-block">Why CA Maker</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            What Makes Us{" "}
            <span className="text-gradient">Different</span>
          </h2>
          <div className="divider-orange mx-auto mb-5" />
          <p className="text-gray-500 text-lg leading-relaxed">
            Expert CA Inter Audit coaching with 6+ years of Big 4 experience.
            Making Audit simple, relatable, and scoring.
          </p>
        </div>

        {/* ── Feature grid ── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
          <div
            key={index}
            className="group text-center card-premium p-7 border border-gray-100"
          >
              {/* Icon */}
              <div
                className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100
                           flex items-center justify-center mx-auto mb-6
                           group-hover:bg-orange-500 transition-colors duration-300"
              >
                <feature.icon
                  className="h-7 w-7 text-orange-500 group-hover:text-white transition-colors duration-300"
                />
              </div>

              <h3 className="font-display text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
