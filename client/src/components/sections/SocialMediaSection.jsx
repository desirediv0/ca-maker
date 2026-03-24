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
    <section ref={ref} className="py-12 md:py-16 bg-[#0F172A] relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* Header */}
        <div
          className={`text-center mb-14 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Follow CA Maker
          </h2>
          <p className="text-orange-400 max-w-xl mx-auto text-base md:text-lg leading-relaxed mb-8">
            Stay updated with free content, exam tips, and student success stories across all our platforms.
          </p>
          <a
            href={socialLinks[0]?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold
                       px-6 py-3 rounded transition-colors duration-300"
          >
            <RiGroupLine className="h-5 w-5" />
            Join our CA community
          </a>
        </div>

        {/* Social cards with orange icon circles */}
        <div className="grid md:grid-cols-3 gap-8">
          {socialLinks.map((s, i) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex flex-col items-center text-center p-6 rounded
                         bg-white/5 border border-white/10 hover:border-orange-500/30
                         transition-all duration-300 hover:-translate-y-1
                         ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Orange circle icon */}
              <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center mb-4
                              group-hover:bg-orange-400 transition-colors">
                <s.Icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-lg font-bold text-white mb-1">{s.name}</h3>
              <p className="text-orange-400 font-semibold text-sm mb-3">{s.handle}</p>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{s.desc}</p>

              <div className="flex items-center gap-2 text-orange-400 group-hover:text-orange-300
                              font-semibold text-sm transition-colors">
                Follow
                <RiArrowRightLine className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SocialMediaSection;
