"use client";

import { useState } from "react";
import {
  RiMapPinLine as MapPin,
  RiMailLine as Mail,
  RiTimeLine as Clock,
  RiSendPlaneLine as Send,
  RiLoader4Line as Loader2,
  RiPhoneLine as Phone,
  RiArrowRightLine as ArrowRight,
  RiCheckboxCircleLine as CheckCircle,
  RiYoutubeLine,
  RiInstagramLine,
  RiWhatsappLine,
  RiLinkedinBoxLine,
  RiArrowRightSLine,
  RiHome4Line,
} from "react-icons/ri";
import Link from "next/link";
import { fetchApi } from "@/lib/utils";
import { toast } from "sonner";

const contactInfoCards = [
  { icon: Mail, label: "Email", value: "camakerIndia@gmail.com", href: "mailto:camakerIndia@gmail.com" },
  { icon: Phone, label: "Phone / WhatsApp", value: "+91 98765 43210", href: "tel:+919876543210" },
  { icon: MapPin, label: "Location", value: "Delhi NCR, India", href: null },
  { icon: Clock, label: "Response Time", value: "Within 24 hours", href: null },
];

const socialLinks = [
  { icon: RiYoutubeLine, href: "https://youtube.com/@camakerindia", label: "YouTube", hover: "#EF4444" },
  { icon: RiInstagramLine, href: "https://instagram.com/official_camaker", label: "Instagram", hover: "#EC4899" },
  { icon: RiWhatsappLine, href: "https://wa.me/919876543210", label: "WhatsApp", hover: "#22C55E" },
  { icon: RiLinkedinBoxLine, href: "https://www.linkedin.com/company/camaker", label: "LinkedIn", hover: "#2563EB" },
];

export default function ContactPage() {
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", subject: "Course Inquiry", message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const response = await fetchApi("/content/contact", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      toast.success(response.data?.message || "Your message has been sent!");
      setFormData({ name: "", email: "", phone: "", subject: "Course Inquiry", message: "" });
      setFormSuccess(true);
      setTimeout(() => setFormSuccess(false), 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleSendAnother = () => {
    setFormSuccess(false);
  };

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
            <span className="text-white font-medium">Contact</span>
          </nav>

          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-white/30" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-blue-200/60">
              Get In Touch
            </span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-white/30" />
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            We&apos;d Love to Hear From You
          </h1>
          <p className="text-base md:text-lg text-blue-100/70 max-w-xl leading-relaxed">
            Have questions about our CA courses? Reach out and we&apos;ll get back
            to you within 24 hours.
          </p>
        </div>
      </section>

      {/* ══ Main Section ══ */}
      <section className="py-14 md:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-14 items-start">

            {/* ── LEFT: Form ── */}
            <div className="lg:col-span-3">
              <div
                className="rounded-2xl p-7 md:p-9"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #F0F0F0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                }}
              >
                <div className="mb-7">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-px w-6 bg-gradient-to-r from-transparent to-blue-400/30" />
                    <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-blue-500/50">
                      Message Us
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
                    Send a Message
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Fill in the form and we&apos;ll reply within 24 hours.
                  </p>
                </div>

                {formSuccess ? (
                  <div className="py-10 text-center">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                      style={{
                        background: "rgba(34, 197, 94, 0.06)",
                        border: "1px solid rgba(34, 197, 94, 0.12)",
                      }}
                    >
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                      Message Sent!
                    </h3>
                    <p className="text-gray-400 mt-2 text-sm">
                      We&apos;ll get back to you within 24 hours.
                    </p>
                    <button
                      type="button"
                      onClick={handleSendAnother}
                      className="mt-6 px-6 py-2.5 rounded-xl text-sm font-bold
                                 text-blue-600 transition-all duration-200 hover:bg-blue-50"
                      style={{
                        border: "1px solid rgba(37, 99, 235, 0.2)",
                      }}
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Your full name"
                        className="w-full px-4 py-3 rounded-xl text-sm text-gray-800
                                   placeholder:text-gray-300 transition-all duration-200
                                   focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-400"
                        style={{ border: "1px solid #EBEBEB", background: "#FAFAFA" }}
                        onFocus={(e) => { e.target.style.background = "#FFFFFF"; }}
                        onBlur={(e) => { if (!e.target.value) e.target.style.background = "#FAFAFA"; }}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 rounded-xl text-sm text-gray-800
                                   placeholder:text-gray-300 transition-all duration-200
                                   focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-400"
                        style={{ border: "1px solid #EBEBEB", background: "#FAFAFA" }}
                        onFocus={(e) => { e.target.style.background = "#FFFFFF"; }}
                        onBlur={(e) => { if (!e.target.value) e.target.style.background = "#FAFAFA"; }}
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full px-4 py-3 rounded-xl text-sm text-gray-800
                                   placeholder:text-gray-300 transition-all duration-200
                                   focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-400"
                        style={{ border: "1px solid #EBEBEB", background: "#FAFAFA" }}
                        onFocus={(e) => { e.target.style.background = "#FFFFFF"; }}
                        onBlur={(e) => { if (!e.target.value) e.target.style.background = "#FAFAFA"; }}
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Subject
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl text-sm text-gray-800
                                   transition-all duration-200 appearance-none
                                   focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-400"
                        style={{
                          border: "1px solid #EBEBEB",
                          background: "#FAFAFA",
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 16px center",
                        }}
                      >
                        <option>Course Inquiry</option>
                        <option>Batch Details</option>
                        <option>Technical Support</option>
                        <option>Enrollment</option>
                        <option>Other</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        placeholder="Write your message here…"
                        className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 resize-none
                                   placeholder:text-gray-300 transition-all duration-200
                                   focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-400"
                        style={{ border: "1px solid #EBEBEB", background: "#FAFAFA", minHeight: "120px" }}
                        onFocus={(e) => { e.target.style.background = "#FFFFFF"; }}
                        onBlur={(e) => { if (!e.target.value) e.target.style.background = "#FAFAFA"; }}
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="group w-full py-3.5 rounded-xl text-sm font-bold text-white
                                 flex items-center justify-center gap-2 transition-all duration-300
                                 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.01]"
                      style={{
                        background: "linear-gradient(135deg, #1E40AF, #2563EB, #3B82F6)",
                        boxShadow: "0 4px 16px rgba(37, 99, 235, 0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
                      }}
                    >
                      {formLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          Send Message
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* ── RIGHT: Info ── */}
            <div className="lg:col-span-2 space-y-4">
              {contactInfoCards.map(({ icon: Icon, label, value, href }, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #F0F0F0",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(59,130,246,0.12)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(37,99,235,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#F0F0F0";
                    e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.03)";
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: "rgba(37, 99, 235, 0.06)",
                        border: "1px solid rgba(37, 99, 235, 0.1)",
                      }}
                    >
                      <Icon className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          className="text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="text-sm font-bold text-gray-900">{value}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Social */}
              <div
                className="rounded-2xl p-5"
                style={{
                  background: "linear-gradient(170deg, #F8FAFF, #EFF6FF)",
                  border: "1px solid rgba(59, 130, 246, 0.06)",
                }}
              >
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Follow CA Maker
                </p>
                <div className="flex gap-2.5">
                  {socialLinks.map(({ icon: SIcon, href, label, hover }, i) => (
                    <a
                      key={i}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-10 h-10 rounded-xl flex items-center justify-center
                                 text-gray-400 transition-all duration-300 hover:-translate-y-0.5 hover:text-white"
                      style={{
                        background: "#FFFFFF",
                        border: "1px solid #F0F0F0",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = hover;
                        e.currentTarget.style.borderColor = hover;
                        e.currentTarget.style.boxShadow = `0 4px 12px ${hover}44`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#FFFFFF";
                        e.currentTarget.style.borderColor = "#F0F0F0";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <SIcon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick CTA */}
              <div
                className="rounded-2xl p-6 text-center"
                style={{
                  background: "linear-gradient(135deg, #1E3A8A 0%, #1E40AF 40%, #2563EB 100%)",
                  boxShadow: "0 4px 20px rgba(37, 99, 235, 0.15)",
                }}
              >
                <h3 className="text-base font-extrabold text-white mb-1.5 tracking-tight">
                  Prefer to explore first?
                </h3>
                <p className="text-blue-200/60 text-xs mb-4 leading-relaxed">
                  Browse our courses and find what suits your preparation level.
                </p>
                <Link
                  href="/courses"
                  className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-lg
                             text-sm font-bold text-blue-700 transition-all duration-200
                             hover:bg-white/95"
                  style={{
                    background: "rgba(255,255,255,0.9)",
                    border: "1px solid rgba(255,255,255,0.3)",
                  }}
                >
                  View Courses
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FAQ CTA ══ */}
      <section
        className="py-12 md:py-14 px-4 sm:px-6"
        style={{ background: "linear-gradient(180deg, #FAFBFF, #FFFFFF)" }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-blue-400/30" />
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-blue-500/50">
              Need Quick Answers?
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-blue-400/30" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
            Still have questions?
          </h2>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            Check our FAQ page for quick answers to common questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/faqs"
              className="group inline-flex items-center justify-center gap-2 px-7 py-3.5
                         rounded-xl text-sm font-bold text-white transition-all duration-300
                         hover:scale-[1.03]"
              style={{
                background: "linear-gradient(135deg, #1E40AF, #2563EB, #3B82F6)",
                boxShadow: "0 4px 16px rgba(37, 99, 235, 0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
              }}
            >
              View FAQs
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5
                         rounded-xl text-sm font-semibold text-blue-600 transition-all duration-200
                         hover:bg-blue-50"
              style={{ border: "1px solid rgba(37, 99, 235, 0.2)" }}
            >
              Explore Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}