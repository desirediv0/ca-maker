"use client";

import { useRef, useState, useEffect } from "react";
import { RiYoutubeLine, RiInstagramLine, RiFacebookCircleLine, RiArrowRightLine, RiGroupLine } from "react-icons/ri";

const socialLinks = [
  {
    name: "YouTube",
    handle: "@camakerindia",
    url: "https://youtube.com/@camakerindia?si=ZkkCpU1DEh48NBSe",
    Icon: RiYoutubeLine,
    gradient: "from-red-500 to-rose-600",
    glow: "hover:shadow-red-500/25",
    ring: "hover:ring-red-200",
    desc: "Free lectures, exam tips, and concept explanations from CA Mohit Kukreja.",
    count: "50K+",
    countLabel: "Subscribers",
  },
  {
    name: "Instagram",
    handle: "@official_camaker",
    url: "https://www.instagram.com/official_camaker/",
    Icon: RiInstagramLine,
    gradient: "from-pink-500 to-purple-600",
    glow: "hover:shadow-pink-500/25",
    ring: "hover:ring-pink-200",
    desc: "Daily exam updates, motivation, and behind-the-scenes from CA Maker.",
    count: "30K+",
    countLabel: "Followers",
  },
  {
    name: "Facebook",
    handle: "CA Maker India",
    url: "https://www.facebook.com/share/1DCsKYB5Uy/?mibextid=wwXIfr",
    Icon: RiFacebookCircleLine,
    gradient: "from-blue-500 to-blue-700",
    glow: "hover:shadow-blue-500/25",
    ring: "hover:ring-blue-200",
    desc: "Join thousands of CA students in our growing learning community.",
    count: "10K+",
    countLabel: "Members",
  },
];

export function SocialMediaSection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-10 bg-white relative overflow-hidden">
      {/* Decorative gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(251,146,60,0.05) 0%, rgba(250,204,21,0.03) 40%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200
                          text-orange-600 text-xs font-bold uppercase tracking-widest rounded-full mb-5">
            <RiGroupLine className="h-4 w-4" />
            Join Our Community
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
            Follow CA Maker
          </h2>
          <div className="divider-orange mx-auto mb-5" />
          <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Stay updated with free content, exam tips, and student success stories across all our platforms.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {socialLinks.map((s, i) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative bg-white rounded-2xl p-7 border border-gray-100
                         transition-all duration-300
                         hover:-translate-y-2 hover:shadow-xl ${s.glow}
                         ring-1 ring-transparent ${s.ring}
                         ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{
                transitionDelay: `${i * 100}ms`,
                boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
              }}
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.gradient}
                            flex items-center justify-center mb-5 shadow-md
                            group-hover:scale-110 transition-transform duration-300`}
              >
                <s.Icon className="w-7 h-7 text-white" />
              </div>

              {/* Count badge */}
              <div className="absolute top-6 right-6">
                <div className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-1.5 text-center">
                  <p className="font-black text-gray-900 text-sm leading-none">{s.count}</p>
                  <p className="text-gray-400 text-[10px] font-medium mt-0.5">{s.countLabel}</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-1">{s.name}</h3>
              <p className="text-orange-500 text-sm font-semibold mb-3">{s.handle}</p>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">{s.desc}</p>

              <div className="flex items-center gap-2 text-gray-700 group-hover:text-orange-600
                              font-semibold text-sm transition-colors">
                Follow Us
                <RiArrowRightLine className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          ))}
        </div>

        {/* Stats bar */}
        <div
          className={`mt-14 flex flex-col sm:flex-row items-center justify-center gap-8
                       transition-all duration-700 delay-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {[
            { label: "YouTube Subscribers", value: "50K+" },
            { label: "Instagram Followers", value: "30K+" },
            { label: "Community Members",   value: "1,000+" },
          ].map(({ label, value }, i) => (
            <div key={label} className="text-center px-6 py-4">
              <p
                className="text-2xl font-black text-gradient mb-1"
              >
                {value}
              </p>
              <p className="text-gray-500 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SocialMediaSection;
