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
} from "react-icons/ri";
import Link from "next/link";
import { fetchApi } from "@/lib/utils";
import { toast } from "sonner";

/* ─── Static contact data ────────────────────────────────── */
const contactInfoCards = [
  { icon: Mail, label: "Email", value: "camakerIndia@gmail.com", href: "mailto:camakerIndia@gmail.com" },
  { icon: Phone, label: "Phone / WhatsApp", value: "+91 98765 43210", href: "tel:+919876543210" },
  { icon: MapPin, label: "Location", value: "Delhi NCR, India", href: null },
  { icon: Clock, label: "Response Time", value: "Within 24 hours", href: null },
];

const socialLinks = [
  { icon: RiYoutubeLine, href: "https://youtube.com/@camakerindia", label: "YouTube" },
  { icon: RiInstagramLine, href: "https://instagram.com/official_camaker", label: "Instagram" },
  { icon: RiWhatsappLine, href: "https://wa.me/919876543210", label: "WhatsApp" },
  { icon: RiLinkedinBoxLine, href: "https://www.linkedin.com/company/camaker", label: "LinkedIn" },
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

  const handleSendAnother = () => {
    setFormSuccess(false);
  };

  const inputCls =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 " +
    "focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all";

  return (
    <div className="min-h-screen bg-white">

      {/* ══ Page Hero ══ */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-14 px-4 sm:px-6 text-center">
        <h1 className="text-4xl font-bold text-white">Get In Touch</h1>
        <p className="text-white/90 mt-2 text-lg">
          Have questions about our CA courses? We&apos;re here to help.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-white/70 mt-4">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span>Contact</span>
        </div>
      </section>

      {/* ══ Main Section (two-column) ══ */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12 items-start">

            {/* ── LEFT: Contact Form (col-span-3) ── */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-900">Send us a Message</h2>
                <p className="text-sm text-orange-500 mt-1 mb-6">We reply within 24 hours</p>

                {formSuccess ? (
                  /* Success state */
                  <div className="py-8 text-center">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Message Sent!</h3>
                    <p className="text-gray-500 mt-2">We&apos;ll get back to you within 24 hours</p>
                    <button
                      type="button"
                      onClick={handleSendAnother}
                      className="mt-6 px-6 py-2.5 border-2 border-orange-500 text-orange-500 rounded-xl
                                 font-semibold hover:bg-orange-500 hover:text-white transition-all duration-200"
                    >
                      Send Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="your@email.com"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="+91 XXXXX XXXXX"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        placeholder="Write your message here..."
                        className={`${inputCls} h-32 resize-none`}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3.5 rounded-xl
                                 flex items-center justify-center gap-2 transition-all duration-200
                                 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {formLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* ── RIGHT: Contact Info (col-span-2) ── */}
            <div className="lg:col-span-2 space-y-4">
              {contactInfoCards.map(({ icon: Icon, label, value, href }, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl p-5">
                  <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
                  {href ? (
                    <a href={href} className="text-base font-semibold text-gray-900 mt-1 block hover:text-orange-500 transition-colors">
                      {value}
                    </a>
                  ) : (
                    <p className="text-base font-semibold text-gray-900 mt-1">{value}</p>
                  )}
                </div>
              ))}

              {/* Social Links Card */}
              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                <p className="text-sm font-bold text-gray-900 mb-3">Follow CA Maker</p>
                <div className="flex gap-3">
                  {socialLinks.map(({ icon: SIcon, href, label }, i) => (
                    <a
                      key={i}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center
                                 text-gray-600 hover:bg-orange-500 hover:text-white transition-all duration-200"
                    >
                      <SIcon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FAQ Teaser Section ══ */}
      <section className="bg-gray-50 py-12 px-4 sm:px-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Still have questions?</h2>
        <p className="text-gray-500 mt-1 mb-6">Check our FAQ page for quick answers</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/faqs"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500
                       hover:bg-orange-600 text-white font-semibold rounded-xl transition-all duration-200"
          >
            View FAQs
          </Link>
          <Link
            href="/courses"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-orange-500
                       text-orange-500 hover:bg-orange-500 hover:text-white font-semibold rounded-xl
                       transition-all duration-200"
          >
            Explore Courses
          </Link>
        </div>
      </section>
    </div>
  );
}
