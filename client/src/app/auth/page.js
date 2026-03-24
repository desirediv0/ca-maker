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
    RiLineChartLine as TrendingUp
} from "react-icons/ri";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

function AuthForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    const tabFromUrl = searchParams.get("tab") || "login";
    const [activeTab, setActiveTab] = useState(tabFromUrl);

    useEffect(() => {
        setActiveTab(tabFromUrl);
    }, [tabFromUrl]);

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, router]);

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
            {/* ── Left Panel: Charcoal + Orange branding ── */}
            <div className="hidden lg:flex lg:w-[45%] bg-[#111111] relative overflow-hidden flex-col justify-between p-14">
                {/* Decorative blobs */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-20 -left-20 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-10 w-64 h-64 bg-orange-400/8 rounded-full blur-3xl" />
                </div>

                {/* Logo */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-14">
                        <div className="w-10 h-10 bg-orange-500 rounded flex items-center justify-center">
                            <span className="text-white font-black text-lg">CA</span>
                        </div>
                        <span className="text-white font-bold text-xl tracking-tight">CA Maker</span>
                    </div>

                    <h1 className="text-4xl font-black text-white leading-tight mb-4">
                        Welcome Back to<br />
                        <span style={{ color: "#F97316" }}>CA Maker</span>
                    </h1>
                    <p className="text-gray-400 text-base leading-relaxed mb-10">
                        Master CA Inter Audit with Big&nbsp;4 expertise and practical examples.
                    </p>

                    <div className="space-y-4">
                        {features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-4 bg-white/5 border border-white/10 rounded p-4 hover:bg-white/8 transition-colors">
                                <div className="w-10 h-10 bg-orange-500/20 rounded flex items-center justify-center flex-shrink-0">
                                    <feature.icon className="w-5 h-5 text-orange-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white text-sm mb-0.5">{feature.title}</h3>
                                    <p className="text-gray-500 text-xs leading-relaxed">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quote */}
                <div className="relative z-10 border-t border-white/10 pt-8">
                    <p className="text-gray-400 text-sm italic leading-relaxed">
                        &ldquo;Making Audit simple, relatable, and scoring with practical Big&nbsp;4 examples&rdquo;
                    </p>
                    <p className="text-orange-400 text-sm font-semibold mt-2">— CA Mohit Kukreja</p>
                </div>
            </div>

            {/* ── Right Panel: Auth Forms ── */}
            <div className="w-full lg:w-[55%] flex items-center justify-center p-6 md:p-10 bg-[#FFF7ED]">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="w-12 h-12 bg-orange-500 rounded flex items-center justify-center mx-auto mb-3">
                            <span className="text-white font-black text-lg">CA</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">CA Maker</h2>
                        <p className="text-gray-500 text-sm">Master CA Inter Audit</p>
                    </div>

                    {/* Card */}
                    <div className="bg-white rounded shadow-lg border border-gray-100 overflow-hidden">
                        {/* Tabs */}
                        <div className="flex border-b border-gray-100">
                            {["login", "register"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => handleTabChange(tab)}
                                    className={`flex-1 py-4 text-center font-semibold text-sm transition-all relative ${activeTab === tab ? "text-orange-600" : "text-gray-400 hover:text-gray-700"
                                        }`}
                                >
                                    {activeTab === tab && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-t-full" />
                                    )}
                                    {tab === "login" ? "Login" : "Register"}
                                </button>
                            ))}
                        </div>

                        <div className="p-8">
                            {activeTab === "login" && <LoginForm />}
                            {activeTab === "register" && <RegisterForm />}
                        </div>
                    </div>

                    {/* Mobile Feature Pills */}
                    <div className="lg:hidden mt-6 grid grid-cols-2 gap-3">
                        {features.map((feature, idx) => (
                            <div key={idx} className="bg-white rounded p-3 border border-gray-100 text-center shadow-sm">
                                <div className="w-9 h-9 bg-orange-100 rounded flex items-center justify-center mx-auto mb-2">
                                    <feature.icon className="w-4 h-4 text-orange-500" />
                                </div>
                                <p className="text-xs font-semibold text-gray-800">{feature.title}</p>
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

        if (!email || !password) {
            toast.error("Email and password are required");
            return;
        }

        setIsSubmitting(true);

        try {
            await login(email, password);
            sessionStorage.setItem("justLoggedIn", "true");
            toast.success("Login successful! Redirecting...");

            const returnUrl = searchParams.get("returnUrl") || searchParams.get("redirect");

            setTimeout(() => {
                router.push(returnUrl ? decodeURIComponent(returnUrl) : "/");
            }, 300);
        } catch (error) {
            const errorMessage = error.message || "Login failed. Please check your credentials.";

            if (errorMessage.toLowerCase().includes("verify") || errorMessage.toLowerCase().includes("verification")) {
                toast.error(
                    <div>
                        {errorMessage}{" "}
                        <Link href="/resend-verification" className="text-black font-medium underline">
                            Resend verification email
                        </Link>
                    </div>
                );
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputCls = "w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-300 focus:border-orange-500 focus:outline-none transition-all text-gray-900 placeholder:text-gray-400 text-sm";

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back!</h1>
                <p className="text-gray-500 text-sm">Sign in to continue your CA journey</p>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className={inputCls} />
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className={`${inputCls} pr-12`} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            <div className="text-right">
                <Link href="/forgot-password" className="text-sm text-orange-600 hover:underline font-medium">Forgot password?</Link>
            </div>

            <button type="submit" disabled={isSubmitting}
                className="w-full h-12 rounded text-sm font-bold bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white flex items-center justify-center gap-2 transition-colors">
                {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" />Signing in…</> : <>Sign In <ArrowRight className="h-4 w-4" /></>}
            </button>

            <p className="text-center text-sm text-gray-500">
                Don&apos;t have an account?{" "}
                <Link href="/auth?tab=register" className="text-orange-600 font-semibold hover:underline">Create Account</Link>
            </p>
        </form>
    );
}

function RegisterForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
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
        if (formData.name.trim().length < 3) {
            toast.error("Name should be at least 3 characters");
            return false;
        }

        if (!formData.phone || formData.phone.length < 10) {
            toast.error("Please enter a valid phone number");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error("Please enter a valid email address");
            return false;
        }

        if (formData.password.length < 8) {
            toast.error("Password should be at least 8 characters");
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await register({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
            });

            toast.success("Registration successful! Enter the OTP sent to your email.", { duration: 3000 });
            localStorage.setItem("registeredEmail", formData.email);

            setTimeout(() => {
                router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
            }, 600);
        } catch (error) {
            toast.error(error.message || "Registration failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputCls = "w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-300 focus:border-orange-500 focus:outline-none transition-all text-gray-900 placeholder:text-gray-400 text-sm";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-5">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Join CA Maker</h1>
                <p className="text-gray-500 text-sm">Start your journey to CA success</p>
            </div>

            {[
                { label: "Full Name", type: "text", name: "name", Icon: User, placeholder: "Your full name" },
                { label: "Email Address", type: "email", name: "email", Icon: Mail, placeholder: "you@example.com" },
                { label: "Phone Number", type: "tel", name: "phone", Icon: Phone, placeholder: "+91 9876543210" },
            ].map(({ label, type, name, Icon, placeholder }) => (
                <div key={name}>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                    <div className="relative">
                        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input type={type} name={name} value={formData[name]} onChange={handleChange} required placeholder={placeholder} className={inputCls} />
                    </div>
                </div>
            ))}

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required placeholder="Min 8 characters" className={`${inputCls} pr-12`} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type={showPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="Confirm your password" className={inputCls} />
                </div>
            </div>

            <button type="submit" disabled={isSubmitting}
                className="w-full h-12 rounded text-sm font-bold bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white flex items-center justify-center gap-2 transition-colors mt-2">
                {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" />Creating Account…</> : <>Create Account <ArrowRight className="h-4 w-4" /></>}
            </button>

            <p className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link href="/auth?tab=login" className="text-orange-600 font-semibold hover:underline">Sign In</Link>
            </p>
        </form>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <AuthForm />
        </Suspense>
    );
}
