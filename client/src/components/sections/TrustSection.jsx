import { Shield, Lock, BookOpen, GraduationCap, Target, Trophy } from "lucide-react";

const stats = [
  { value: "1,000+", label: "Students Enrolled" },
  { value: "95%", label: "Success Rate" },
  { value: "6+", label: "Years Experience" },
  { value: "50+", label: "Courses Offered" },
];

const trustBadges = [
  { icon: Shield, text: "100% Authentic Content" },
  { icon: Lock, text: "Secure Payment" },
  { icon: BookOpen, text: "Quality Study Material" },
  { icon: GraduationCap, text: "Expert Faculty" },
  { icon: Target, text: "Exam-Oriented Approach" },
  { icon: Trophy, text: "Proven Track Record" },
];

export const TrustSection = () => {
  return (
    <section className="py-20 bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 pb-16 border-b border-white/10">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="font-display text-4xl md:text-5xl font-black text-gradient mb-2">
                {stat.value}
              </p>
              <p className="text-white/60 text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ── Trust badges ── */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label mb-4 inline-block">Trust & Quality</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
              Why Trust{" "}
              <span className="text-gradient">CA Maker</span>?
            </h2>
            <p className="text-white/50 mt-3">Your success is our commitment</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {trustBadges.map((badge, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-5 py-4 rounded
                           bg-white/5 border border-white/10
                           hover:bg-white/10 hover:border-blue-500/40 transition-all duration-300"
              >
                <div className="w-9 h-9 bg-blue-500/15 rounded flex items-center justify-center flex-shrink-0">
                  <badge.icon className="h-4.5 w-4.5 text-blue-400" style={{ width: 18, height: 18 }} />
                </div>
                <p className="text-white/90 text-sm font-medium">{badge.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Payment methods ── */}
        <div className="mt-16 text-center">
          <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-5">
            Secure Payment Methods
          </p>
          <div className="flex justify-center items-center gap-4 flex-wrap">
            {["💳 Credit / Debit Cards", "📱 UPI", "🏦 Net Banking", "💰 Wallets"].map((method) => (
              <div key={method} className="bg-white/8 border border-white/10 px-4 py-2 rounded">
                <span className="text-white/70 text-sm font-medium">{method}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
