import { BookOpen, Award, Users, Target, CheckCircle, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const features = [
  {
    icon: BookOpen,
    title: "Simple Explanations",
    description: "No complicated jargon - relatable memory techniques",
  },
  {
    icon: GraduationCap,
    title: "Structured Notes",
    description: "Quick revision notes for exam preparation",
  },
  {
    icon: Target,
    title: "Daily Written Practice",
    description: "Focus on answer writing and presentation",
  },
  {
    icon: CheckCircle,
    title: "Regular Tests",
    description: "Exam-oriented practice and evaluation",
  },
  {
    icon: Award,
    title: "Latest Amendments",
    description: "ICAI amendments covered clearly",
  },
  {
    icon: Users,
    title: "Personal Mentoring",
    description: "Doubt support and one-on-one guidance",
  },
];

const stats = [
  { value: "6+", label: "Years Big 4 Experience" },
  { value: "500+", label: "Happy Students" },
  { value: "100%", label: "Practical Examples" },
  { value: "24/7", label: "Doubt Support" },
];

export const AboutSection = () => {
  return (
    <section className="section-padding bg-warm-bg">
      <div className="section-container">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            About Us
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
            Making Audit <span className="text-gradient">Simple, Relatable & Scoring</span>
          </h2>
          <div className="text-muted-foreground text-lg space-y-4 text-left">
            <p>
              <strong className="text-foreground">CA Mohit Kukreja</strong> brings in his <strong>6 years of audit expertise from Big 4</strong> to CA Maker, incorporating practical examples in his classes to make Audit simple, relatable, and scoring.
            </p>
            <p>
              We understand what students go through — bulky Standards on Auditing, confusing language, presentation pressure, and the fear of writing answers. That&apos;s why our classes are designed to break every concept into easy language, practical examples, and exam-focused formats.
            </p>
            <p className="text-xl font-semibold text-primary">
              Here, you don&apos;t just study Audit — you understand it.
            </p>
          </div>
        </div>

        {/* What Makes Us Different */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-8">
            What Makes Us <span className="text-gradient">Different?</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl text-center card-shadow hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Goal */}
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 md:p-12 mb-12 border border-primary/10">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Our Goal
            </h3>
            <p className="text-lg text-muted-foreground mb-4">
              Whether it&apos;s your first attempt or a comeback attempt, we guide you step-by-step — from understanding SAs to confidently attempting the paper.
            </p>
            <div className="space-y-2 text-lg">
              <p className="text-foreground font-semibold">
                Our goal is not just to help you pass.
              </p>
              <p className="text-primary font-bold text-xl">
                Our goal is to help you walk into the exam hall feeling prepared and confident.
              </p>
              <p className="text-muted-foreground italic mt-4">
                Because when concepts are clear, confidence follows.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl md:text-4xl font-display font-bold text-primary">
                  {stat.value}
                </p>
                <p className="text-white/70 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link href="/courses">
            <Button variant="hero" size="lg" className="gap-2">
              <BookOpen className="h-5 w-5" />
              Explore Our Courses
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
