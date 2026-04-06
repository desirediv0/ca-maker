"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
    RiMailLine as Mail,
    RiLockPasswordLine as Lock,
    RiUserLine as User,
    RiPhoneLine as Phone,
    RiArrowRightLine as ArrowRight,
    RiEyeLine as Eye,
    RiEyeOffLine as EyeOff,
    RiLoader4Line as Loader2,
    RiGraduationCapLine as GraduationCap,
    RiBookOpenLine as BookOpen,
    RiAwardLine as Award,
    RiLineChartLine as TrendingUp,
    RiShieldCheckLine,
} from "react-icons/ri";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

function AuthForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    const tabFromUrl = searchParams.get("tab") || "login";
    const [activeTab, setActiveTab] = useState(tabFromUrl);

    useEffect(() => { setActiveTab(tabFromUrl); }, [tabFromUrl]);
    useEffect(() => { if (isAuthenticated) router.push("/"); }, [isAuthenticated, router]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        router.push(`/auth?tab=${tab}`, { scroll: false });
    };

    const features = [
        { icon: GraduationCap, title: "Big 4 Expertise", desc: "Learn from 6+ years of audit experience" },
        { icon: BookOpen, title: "Structured Notes", desc: "Easy-to-revise, exam-focused material" },
        { icon: Award, title: "95%+ Success Rate", desc: "Proven track record of student success" },
        { icon: TrendingUp, title: "Daily Practice", desc: "Regular tests & answer writing sessions" },
    ];

    return (
        <div className="min-h-screen flex">
            {/* ── Left Panel ── */}
            <div
                className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col justify-between p-14"
                style={{
                    background: "linear-gradient(170deg, #0B1120 0%, #0F1A32 40%, #132044 70%, #0B1120 100%)",
                }}
            >
                {/* Background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div
                        className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-30"
                        style={{ background: "radial-gradient(circle, rgba(37,99,235,0.2), transparent 70%)" }}
                    />
                    <div
                        className="absolute bottom-20 right-10 w-64 h-64 rounded-full opacity-20"
                        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.15), transparent 70%)" }}
                    />
                    <div
                        className="absolute inset-0 opacity-[0.02]"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)",
                            backgroundSize: "60px 60px",
                        }}
                    />
                </div>

                {/* Content */}
                <div className="relative z-10">
                    {/* Logo */}
                    <div className="flex items-center gap-2.5 mb-14">
                        <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{
                                background: "linear-gradient(135deg, #1E40AF, #2563EB)",
                                boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
                            }}
                        >
                            <span className="text-white font-extrabold text-sm">CA</span>
                        </div>
                        <span className="text-white font-extrabold text-xl tracking-tight">CA Maker</span>
                    </div>

                    <div className="flex items-center gap-3 mb-5">
                        <div className="h-px w-8 bg-gradient-to-r from-transparent to-blue-400/30" />
                        <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-blue-400/40">
                            Welcome
                        </span>
                        <div className="h-px w-8 bg-gradient-to-l from-transparent to-blue-400/30" />
                    </div>

                    <h1 className="text-3xl font-extrabold text-white leading-tight mb-4 tracking-tight">
                        Your CA Journey<br />
                        <span
                            style={{
                                background: "linear-gradient(135deg, #60A5FA, #3B82F6, #93C5FD)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            Starts Here
                        </span>
                    </h1>
                    <p className="text-blue-200/35 text-sm leading-relaxed mb-10 max-w-sm">
                        Master CA Inter Audit with Big 4 expertise, practical examples, and exam-focused preparation.
                    </p>

                    <div className="space-y-3">
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                className="flex items-start gap-4 rounded-xl p-4 transition-all duration-200"
                                style={{
                                    background: "rgba(255, 255, 255, 0.03)",
                                    border: "1px solid rgba(255, 255, 255, 0.05)",
                                }}
                            >
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                    style={{
                                        background: "rgba(59, 130, 246, 0.1)",
                                        border: "1px solid rgba(59, 130, 246, 0.15)",
                                    }}
                                >
                                    <feature.icon className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm mb-0.5">{feature.title}</h3>
                                    <p className="text-blue-200/30 text-xs leading-relaxed">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quote */}
                <div className="relative z-10 pt-8" style={{ borderTop: "1px solid rgba(59, 130, 246, 0.08)" }}>
                    <p className="text-blue-200/25 text-sm italic leading-relaxed">
                        &ldquo;Making Audit simple, relatable, and scoring with practical Big 4 examples&rdquo;
                    </p>
                    <p className="text-blue-400/60 text-sm font-bold mt-2">— CA Mohit Kukreja</p>
                </div>
            </div>

            {/* ── Right Panel ── */}
            <div className="w-full lg:w-[55%] flex items-center justify-center p-6 md:p-10 bg-white">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                            style={{
                                background: "linear-gradient(135deg, #1E40AF, #2563EB)",
                                boxShadow: "0 4px 12px rgba(37,99,235,0.25)",
                            }}
                        >
                            <span className="text-white font-extrabold text-base">CA</span>
                        </div>
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-1 tracking-tight">CA Maker</h2>
                        <p className="text-gray-400 text-sm">Master CA Inter Audit</p>
                    </div>

                    {/* Card */}
                    <div
                        className="rounded-2xl overflow-hidden"
                        style={{
                            background: "#FFFFFF",
                            border: "1px solid #F0F0F0",
                            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.04)",
                        }}
                    >
                        {/* Tabs */}
                        <div className="flex" style={{ borderBottom: "1px solid #F0F0F0" }}>
                            {["login", "register"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => handleTabChange(tab)}
                                    className="flex-1 py-4 text-center font-bold text-sm transition-all relative"
                                    style={{
                                        color: activeTab === tab ? "#2563EB" : "#9CA3AF",
                                    }}
                                >
                                    {activeTab === tab && (
                                        <div
                                            className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full"
                                            style={{ background: "linear-gradient(90deg, #1E40AF, #3B82F6)" }}
                                        />
                                    )}
                                    {tab === "login" ? "Login" : "Register"}
                                </button>
                            ))}
                        </div>

                        <div className="p-7 md:p-8">
                            {activeTab === "login" && <LoginForm />}
                            {activeTab === "register" && <RegisterForm />}
                        </div>
                    </div>

                    {/* Security badge */}
                    <div className="flex items-center justify-center gap-1.5 mt-5">
                        <RiShieldCheckLine className="w-3.5 h-3.5 text-emerald-500/60" />
                        <span className="text-[11px] text-gray-400 font-medium">
                            Your data is encrypted and secure
                        </span>
                    </div>

                    {/* Mobile Feature Pills */}
                    <div className="lg:hidden mt-6 grid grid-cols-2 gap-2.5">
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                className="rounded-xl p-3 text-center"
                                style={{
                                    background: "#FFFFFF",
                                    border: "1px solid #F0F0F0",
                                }}
                            >
                                <div
                                    className="w-9 h-9 rounded-lg flex items-center justify-center mx-auto mb-2"
                                    style={{
                                        background: "rgba(37, 99, 235, 0.06)",
                                        border: "1px solid rgba(37, 99, 235, 0.1)",
                                    }}
                                >
                                    <feature.icon className="w-4 h-4 text-blue-500" />
                                </div>
                                <p className="text-xs font-bold text-gray-800">{feature.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) { toast.error("Email and password are required"); return; }
        setIsSubmitting(true);
        try {
            await login(email, password);
            sessionStorage.setItem("justLoggedIn", "true");
            toast.success("Login successful! Redirecting...");
            const returnUrl = searchParams.get("returnUrl") || searchParams.get("redirect");
            setTimeout(() => { router.push(returnUrl ? decodeURIComponent(returnUrl) : "/"); }, 300);
        } catch (error) {
            const errorMessage = error.message || "Login failed. Please check your credentials.";
            if (errorMessage.toLowerCase().includes("verify") || errorMessage.toLowerCase().includes("verification")) {
                toast.error(
                    <div>{errorMessage}{" "}
                        <Link href="/resend-verification" className="text-black font-medium underline">Resend verification email</Link>
                    </div>
                );
            } else { toast.error(errorMessage); }
        } finally { setIsSubmitting(false); }
    };

    const inputCls =
        "w-full pl-12 pr-4 py-3.5 rounded-xl text-sm text-gray-800 placeholder:text-gray-300 " +
        "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-400";
    const inputStyle = { border: "1px solid #EBEBEB", background: "#FAFAFA" };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-extrabold text-gray-900 mb-1 tracking-tight">Welcome Back!</h1>
                <p className="text-gray-400 text-sm">Sign in to continue your CA journey</p>
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                        placeholder="you@example.com" className={inputCls} style={inputStyle}
                        onFocus={(e) => { e.target.style.background = "#FFFFFF"; }}
                        onBlur={(e) => { if (!e.target.value) e.target.style.background = "#FAFAFA"; }} />
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required
                        placeholder="••••••••" className={`${inputCls} pr-12`} style={inputStyle}
                        onFocus={(e) => { e.target.style.background = "#FFFFFF"; }}
                        onBlur={(e) => { if (!e.target.value) e.target.style.background = "#FAFAFA"; }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            <div className="text-right">
                <Link href="/forgot-password" className="text-xs text-blue-600 hover:underline font-semibold">
                    Forgot password?
                </Link>
            </div>

            <button type="submit" disabled={isSubmitting}
                className="group w-full h-12 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2
                   transition-all duration-300 disabled:opacity-50 hover:scale-[1.01]"
                style={{
                    background: "linear-gradient(135deg, #1E40AF, #2563EB, #3B82F6)",
                    boxShadow: "0 4px 16px rgba(37, 99, 235, 0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
                }}>
                {isSubmitting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</>
                ) : (
                    <>Sign In <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
                )}
            </button>

            <p className="text-center text-sm text-gray-400">
                Don&apos;t have an account?{" "}
                <Link href="/auth?tab=register" className="text-blue-600 font-bold hover:underline">
                    Create Account
                </Link>
            </p>
        </form>
    );
}

function RegisterForm() {
    const [formData, setFormData] = useState({
        name: "", email: "", phone: "", password: "", confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register } = useAuth();
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (formData.name.trim().length < 3) { toast.error("Name should be at least 3 characters"); return false; }
        if (!formData.phone || formData.phone.length < 10) { toast.error("Please enter a valid phone number"); return false; }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) { toast.error("Please enter a valid email address"); return false; }
        if (formData.password.length < 8) { toast.error("Password should be at least 8 characters"); return false; }
        if (formData.password !== formData.confirmPassword) { toast.error("Passwords do not match"); return false; }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);
        try {
            await register({ name: formData.name, email: formData.email, phone: formData.phone, password: formData.password });
            toast.success("Registration successful! Enter the OTP sent to your email.", { duration: 3000 });
            localStorage.setItem("registeredEmail", formData.email);
            setTimeout(() => { router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}`); }, 600);
        } catch (error) { toast.error(error.message || "Registration failed. Please try again."); }
        finally { setIsSubmitting(false); }
    };

    const inputCls =
        "w-full pl-12 pr-4 py-3.5 rounded-xl text-sm text-gray-800 placeholder:text-gray-300 " +
        "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-400";
    const inputStyle = { border: "1px solid #EBEBEB", background: "#FAFAFA" };

    const fields = [
        { label: "Full Name", type: "text", name: "name", Icon: User, placeholder: "Your full name" },
        { label: "Email Address", type: "email", name: "email", Icon: Mail, placeholder: "you@example.com" },
        { label: "Phone Number", type: "tel", name: "phone", Icon: Phone, placeholder: "+91 9876543210" },
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-5">
                <h1 className="text-2xl font-extrabold text-gray-900 mb-1 tracking-tight">Join CA Maker</h1>
                <p className="text-gray-400 text-sm">Start your journey to CA success</p>
            </div>

            {fields.map(({ label, type, name, Icon, placeholder }) => (
                <div key={name}>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
                    <div className="relative">
                        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input type={type} name={name} value={formData[name]} onChange={handleChange} required
                            placeholder={placeholder} className={inputCls} style={inputStyle}
                            onFocus={(e) => { e.target.style.background = "#FFFFFF"; }}
                            onBlur={(e) => { if (!e.target.value) e.target.style.background = "#FAFAFA"; }} />
                    </div>
                </div>
            ))}

            <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type={showPassword ? "text" : "password"} name="password" value={formData.password}
                        onChange={handleChange} required placeholder="Min 8 characters"
                        className={`${inputCls} pr-12`} style={inputStyle}
                        onFocus={(e) => { e.target.style.background = "#FFFFFF"; }}
                        onBlur={(e) => { if (!e.target.value) e.target.style.background = "#FAFAFA"; }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Confirm Password</label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type={showPassword ? "text" : "password"} name="confirmPassword"
                        value={formData.confirmPassword} onChange={handleChange} required
                        placeholder="Confirm your password" className={inputCls} style={inputStyle}
                        onFocus={(e) => { e.target.style.background = "#FFFFFF"; }}
                        onBlur={(e) => { if (!e.target.value) e.target.style.background = "#FAFAFA"; }} />
                </div>
            </div>

            <button type="submit" disabled={isSubmitting}
                className="group w-full h-12 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2
                   transition-all duration-300 disabled:opacity-50 hover:scale-[1.01] mt-2"
                style={{
                    background: "linear-gradient(135deg, #1E40AF, #2563EB, #3B82F6)",
                    boxShadow: "0 4px 16px rgba(37, 99, 235, 0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
                }}>
                {isSubmitting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Creating Account…</>
                ) : (
                    <>Create Account <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
                )}
            </button>

            <p className="text-center text-sm text-gray-400">
                Already have an account?{" "}
                <Link href="/auth?tab=login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
            </p>
        </form>
    );
}

export default function AuthPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-white">
                    <div className="w-8 h-8 border-[3px] border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                </div>
            }
        >
            <AuthForm />
        </Suspense>
    );
}