"use client";

import { useState } from "react";
import {
  RiMapPinLine as MapPin,
  RiMailLine as Mail,
  RiTimeLine as Clock,
  RiSendPlaneLine as Send,
  RiLoader4Line as Loader2,
  RiMessage2Line as MessageSquare,
  RiPhoneLine as Phone,
  RiArrowRightLine as ArrowRight,
  RiCheckboxCircleLine as CheckCircle,
  RiYoutubeLine,
  RiInstagramLine,
  RiWhatsappLine,
} from "react-icons/ri";
import Link from "next/link";
import { fetchApi } from "@/lib/utils";
import { toast } from "sonner";

/* ─── Static contact data ────────────────────────────────── */
const contactItems = [
  {
    icon: Phone,
    label: "Phone / WhatsApp",
    value: "+91 98765 43210",
    sub: "Call or WhatsApp us",
    href: "tel:+919876543210",
  },
  {
    icon: Mail,
    label: "Email",
    value: "camakerIndia@gmail.com",
    sub: "We reply within 24 hours",
    href: "mailto:camakerIndia@gmail.com",
  },
  {
    icon: MapPin,
    label: "Office",
    value: "Delhi NCR, India",
    sub: "Head Office",
    href: null,
  },
  {
    icon: Clock,
    label: "Business Hours",
    value: "Mon – Sat: 9 AM – 7 PM",
    sub: "Closed on Sundays",
    href: null,
  },
];

/* ─── Page ───────────────────────────────────────────────── */
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

  const inputCls =
    "w-full px-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white " +
    "focus:ring-2 focus:ring-orange-300 focus:border-orange-400 focus:outline-none " +
    "transition-all text-sm text-gray-900 placeholder:text-gray-400";

  return (
    <div className="min-h-screen bg-white">

      {/* ══ Hero ══ */}
      <section className="py-10 bg-[#F9FAFB] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-5">
            <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-700 font-medium">Contact</span>
          </div>

          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 border border-orange-200
                            rounded-full text-orange-600 text-xs font-bold uppercase tracking-widest mb-7">
              <MessageSquare className="w-3.5 h-3.5" />
              Get In Touch
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-5 leading-tight tracking-tight">
              We&apos;d Love to{" "}
              <span className="text-orange-500">Hear from You</span>
            </h1>

            <p className="text-lg text-gray-500 leading-relaxed">
              Have questions about our courses, batch schedules, or anything
              else? Our team is ready to help.
            </p>
          </div>
        </div>
      </section>

      {/* ══ Main 2-col layout ══ */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-14 items-start">

            {/* ── LEFT: Info panel ── */}
            <div className="lg:col-span-2 space-y-4">

              {/* Info card */}
              <div className="bg-[#F9FAFB] rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-orange-50/60">
                  <p className="text-xs font-bold text-orange-600 uppercase tracking-widest">
                    Contact Information
                  </p>
                </div>
                <div className="p-5 space-y-4">
                  {/* Social links row */}
                  {contactItems.map(({ icon: Icon, label, value, sub, href }, i) => {
                    const content = (
                      <div className="flex items-start gap-4" key={i}>
                        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center
                                        justify-center flex-shrink-0 mt-0.5">
                          <Icon className="w-4.5 h-4.5 text-orange-500 w-[18px] h-[18px]" />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">
                            {label}
                          </p>
                          <p className="text-sm font-semibold text-gray-900">{value}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                        </div>
                      </div>
                    );
                    return href ? (
                      <a key={i} href={href} className="block hover:opacity-80 transition-opacity">
                        {content}
                      </a>
                    ) : (
                      <div key={i}>{content}</div>
                    );
                  })}
                  {/* Social icons */}
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2.5">Follow Us</p>
                    <div className="flex gap-2.5">
                      {[
                        { icon: RiYoutubeLine, href: "https://youtube.com/@camakerindia", cls: "hover:bg-red-500" },
                        { icon: RiInstagramLine, href: "https://instagram.com/official_camaker", cls: "hover:bg-pink-600" },
                        { icon: RiWhatsappLine, href: "https://wa.me/919876543210", cls: "hover:bg-green-500" },
                      ].map(({ icon: SIcon, href, cls }, i) => (
                        <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                          className={`w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center
                                      text-gray-500 hover:text-white transition-colors ${cls}`}>
                          <SIcon className="w-4 h-4" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Office hours card */}
              <div className="bg-orange-500 rounded-xl p-5 text-white">
                <p className="text-xs font-bold uppercase tracking-widest text-orange-200 mb-3">
                  Response Time
                </p>
                <p className="text-2xl font-black mb-1">Within 24 Hours</p>
                <p className="text-orange-100 text-sm">
                  We take every query seriously and respond promptly during
                  business hours.
                </p>
                <div className="mt-5 pt-4 border-t border-orange-400 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-200 flex-shrink-0" />
                  <span className="text-sm text-orange-100">
                    Mon – Sat: 9:00 AM – 7:00 PM IST
                  </span>
                </div>
              </div>

              {/* Quick CTA */}
              <div className="bg-[#F9FAFB] border border-gray-100 rounded-xl p-5">
                <p className="text-sm font-bold text-gray-900 mb-1">
                  Ready to start learning?
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Browse our courses and find the right one for you.
                </p>
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-500
                             hover:text-orange-600 transition-colors"
                >
                  View All Courses <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* ── RIGHT: Form ── */}
            <div className="lg:col-span-3">
              <div
                className="bg-white rounded-xl border border-gray-100 overflow-hidden"
                style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
              >
                {/* Form header */}
                <div className="px-8 py-5 border-b border-gray-100 bg-[#F9FAFB]">
                  <h2 className="text-lg font-bold text-gray-900">Send a Message</h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Fill the form below and we&apos;ll get back to you shortly.
                  </p>
                </div>

                <div className="p-6">
                  {/* Success message */}
                  {formSuccess && (
                    <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <p className="text-sm font-semibold text-green-800">
                        Your message has been sent! We&apos;ll get back to you within 24 hours.
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Row 1: Name + Phone */}
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                          Full Name <span className="text-orange-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Your full name"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                          Phone <span className="text-orange-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          placeholder="+91 98765 43210"
                          className={inputCls}
                        />
                      </div>
                    </div>

                    {/* Row 2: Email */}
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                        Email Address <span className="text-orange-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="you@example.com"
                        className={inputCls}
                      />
                    </div>

                    {/* Row 3: Subject */}
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                        Subject
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className={inputCls}
                      >
                        <option>Course Inquiry</option>
                        <option>Batch Details</option>
                        <option>Technical Support</option>
                        <option>Enrollment</option>
                        <option>Other</option>
                      </select>
                    </div>

                    {/* Row 4: Message */}
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                        Message <span className="text-orange-500">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        placeholder="Tell us how we can help you…"
                        className={`${inputCls} resize-none`}
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="w-full h-14 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700
                                 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-base
                                 flex items-center justify-center gap-2.5 transition-colors
                                 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30"
                    >
                      {formLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send className="w-4.5 h-4.5 w-[18px] h-[18px]" />
                          Send Message
                        </>
                      )}
                    </button>

                    <p className="text-xs text-center text-gray-400">
                      We respect your privacy. Your details are never shared.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="py-10 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">
                Start Learning
              </p>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
                Ready to start your CA journey?
              </h2>
              <p className="text-gray-400 text-sm">
                Browse our courses and find the right one for you.
              </p>
            </div>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-orange-500
                         hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors
                         whitespace-nowrap flex-shrink-0"
            >
              Browse Courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
