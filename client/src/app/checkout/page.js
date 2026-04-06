"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { fetchApi, formatCurrency, loadScript } from "@/lib/utils";
import { playSuccessSound, fireConfetti } from "@/lib/sound-utils";
import {
    RiBankCardLine,
    RiAlertLine,
    RiLoader4Line,
    RiCheckboxCircleLine,
    RiMapPinLine,
    RiAddLine,
    RiMoneyRupeeCircleLine,
    RiShoppingBagLine,
    RiGiftLine,
    RiWalletLine,
    RiShieldCheckLine,
    RiArrowRightSLine,
    RiHome4Line,
    RiFlashlightLine,
    RiPhoneLine,
    RiCoupon3Line,
} from "react-icons/ri";
import { toast } from "sonner";
import Link from "next/link";
import AddressForm from "@/components/AddressForm";
import Image from "next/image";

const getImageUrl = (image) => {
    if (!image) return "/placeholder.jpg";
    if (image.startsWith("http")) return image;
    return `https://desirediv-storage.blr1.digitaloceanspaces.com/${image}`;
};

export default function CheckoutPage() {
    const { isAuthenticated, user } = useAuth();
    const router = useRouter();
    const { cart, coupon, getCartTotals, clearCart } = useCart();
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState("");
    const [loadingAddresses, setLoadingAddresses] = useState(true);
    const [paymentSettings, setPaymentSettings] = useState({ cashEnabled: true, razorpayEnabled: false, codCharge: 0 });
    const [paymentMethod, setPaymentMethod] = useState("CASH");
    const [processing, setProcessing] = useState(false);
    const [orderCreated, setOrderCreated] = useState(false);
    const [orderId, setOrderId] = useState("");
    const [paymentId, setPaymentId] = useState("");
    const [razorpayKey, setRazorpayKey] = useState("");
    const [error, setError] = useState("");
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [orderNumber, setOrderNumber] = useState("");
    const [successAnimation, setSuccessAnimation] = useState(false);
    const [redirectCountdown, setRedirectCountdown] = useState(2);
    const [confettiCannon, setConfettiCannon] = useState(false);

    const totals = getCartTotals();
    const isAllDigital = cart.items?.length > 0 && cart.items.every((item) => item?.product?.digitalEnabled === true);

    useEffect(() => { if (!isAuthenticated) router.push("/auth?redirect=checkout"); }, [isAuthenticated, router]);
    useEffect(() => { if (isAuthenticated && cart.items?.length === 0 && !orderCreated) router.push("/cart"); }, [isAuthenticated, cart, router, orderCreated]);

    useEffect(() => {
        const fetchPaymentSettings = async () => {
            try {
                const response = await fetchApi("/payment/settings", { credentials: "include" });
                if (response.success) {
                    setPaymentSettings({ cashEnabled: response.data.cashEnabled ?? true, razorpayEnabled: response.data.razorpayEnabled ?? false, codCharge: response.data.codCharge ?? 0 });
                    if (response.data.cashEnabled) setPaymentMethod("CASH");
                    else if (response.data.razorpayEnabled) setPaymentMethod("RAZORPAY");
                }
            } catch (error) { console.error("Error fetching payment settings:", error); setPaymentMethod("CASH"); }
        };
        fetchPaymentSettings();
    }, []);

    const fetchAddresses = useCallback(async () => {
        if (!isAuthenticated) return;
        setLoadingAddresses(true);
        try {
            const response = await fetchApi("/users/addresses", { credentials: "include" });
            if (response.success) {
                setAddresses(response.data.addresses || []);
                if (response.data.addresses?.length > 0) {
                    const defaultAddress = response.data.addresses.find((addr) => addr.isDefault);
                    setSelectedAddressId(defaultAddress ? defaultAddress.id : response.data.addresses[0].id);
                }
            }
        } catch (error) { console.error("Error fetching addresses:", error); toast.error("Failed to load your addresses"); }
        finally { setLoadingAddresses(false); }
    }, [isAuthenticated]);

    useEffect(() => { fetchAddresses(); }, [fetchAddresses]);

    useEffect(() => {
        const fetchRazorpayKey = async () => {
            try {
                const response = await fetchApi("/payment/razorpay-key", { credentials: "include" });
                if (response.success) setRazorpayKey(response.data.key);
            } catch (error) { console.error("Error fetching Razorpay key:", error); }
        };
        if (isAuthenticated) fetchRazorpayKey();
    }, [isAuthenticated]);

    const handleAddressSelect = (id) => setSelectedAddressId(id);
    const handlePaymentMethodSelect = (method) => setPaymentMethod(method);
    const handleAddressFormSuccess = () => { setShowAddressForm(false); fetchAddresses(); };

    useEffect(() => {
        if (orderCreated && redirectCountdown > 0) {
            const timer = setTimeout(() => setRedirectCountdown(redirectCountdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (orderCreated && redirectCountdown === 0) { router.push("/account/orders"); }
    }, [orderCreated, redirectCountdown, router]);

    useEffect(() => {
        if (successAnimation) {
            fireConfetti.celebration();
            const timer = setTimeout(() => { setConfettiCannon(true); fireConfetti.sides(); }, 1500);
            return () => clearTimeout(timer);
        }
    }, [successAnimation]);

    const handleSuccessfulPayment = (paymentResponse = null, orderData = null) => {
        if (paymentResponse?.razorpay_payment_id) setPaymentId(paymentResponse.razorpay_payment_id);
        if (orderData?.orderNumber) setOrderNumber(orderData.orderNumber);
        setSuccessAnimation(true);
        playSuccessSound();
        clearCart();
        const orderNum = orderData?.orderNumber || orderNumber || "";
        toast.success("Order placed successfully!", {
            duration: 4000,
            description: orderNum ? `Order #${orderNum} confirmed. Redirecting…` : "Order confirmed. Redirecting…",
        });
        setTimeout(() => setOrderCreated(true), 100);
    };

    const handleCheckout = async () => {
        if (!isAllDigital && !selectedAddressId) { toast.error("Please select a shipping address"); return; }
        setProcessing(true);
        setError("");
        try {
            const calculatedAmount = totals.total;
            const amount = Math.max(parseFloat(calculatedAmount.toFixed(2)), 1);
            if (calculatedAmount < 1) toast.info("Minimum order amount is ₹1. Your total has been adjusted.");

            if (paymentMethod === "CASH") {
                toast.loading("Creating your order…", { id: "order-creation", duration: 10000 });
                const orderResponse = await fetchApi("/payment/cash-order", {
                    method: "POST", credentials: "include",
                    body: JSON.stringify({ shippingAddressId: selectedAddressId, billingAddressSameAsShipping: true, couponCode: coupon?.code || null, couponId: coupon?.id || null, discountAmount: totals.discount || 0 }),
                });
                toast.dismiss("order-creation");
                if (!orderResponse.success) throw new Error(orderResponse.message || "Failed to create order");
                setOrderNumber(orderResponse.data.orderNumber);
                setOrderId(orderResponse.data.orderId || "");
                handleSuccessfulPayment(null, { orderNumber: orderResponse.data.orderNumber, orderId: orderResponse.data.orderId, paymentMethod: "CASH" });
                return;
            } else if (paymentMethod === "RAZORPAY") {
                if (!razorpayKey) {
                    try {
                        const keyResponse = await fetchApi("/payment/razorpay-key", { method: "GET", credentials: "include" });
                        if (keyResponse.success && keyResponse.data?.key) setRazorpayKey(keyResponse.data.key);
                        else throw new Error("Razorpay key not available.");
                    } catch (keyError) { throw new Error("Failed to fetch Razorpay key."); }
                }
                toast.loading("Creating your order…", { id: "order-creation", duration: 10000 });
                const orderResponse = await fetchApi("/payment/checkout", {
                    method: "POST", credentials: "include",
                    body: JSON.stringify({ amount, currency: "INR", paymentGateway: "RAZORPAY", couponCode: coupon?.code || null, couponId: coupon?.id || null, discountAmount: totals.discount || 0 }),
                });
                toast.dismiss("order-creation");
                if (!orderResponse.success) throw new Error(orderResponse.message || "Failed to create order");
                toast.success("Order created! Opening payment…", { duration: 2000 });
                const razorpayOrder = orderResponse.data;
                setOrderId(razorpayOrder.id);
                toast.loading("Loading payment gateway…", { id: "payment-gateway", duration: 5000 });
                const loaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
                toast.dismiss("payment-gateway");
                if (!loaded) throw new Error("Razorpay SDK failed to load");
                let currentKey = razorpayKey;
                if (!currentKey) {
                    try {
                        const keyResponse = await fetchApi("/payment/razorpay-key", { method: "GET", credentials: "include" });
                        if (keyResponse.success && keyResponse.data?.key) { currentKey = keyResponse.data.key; setRazorpayKey(currentKey); }
                    } catch (keyError) { console.error("Failed to fetch Razorpay key:", keyError); }
                }
                if (!currentKey) throw new Error("Razorpay key is missing.");
                const options = {
                    key: currentKey, amount: razorpayOrder.amount, currency: razorpayOrder.currency,
                    name: "CA Maker", description: "CA Courses & Study Material by CA Mohit Kukreja",
                    order_id: razorpayOrder.id,
                    prefill: { name: user?.name || "", email: user?.email || "", contact: user?.phone || "" },
                    handler: async function (response) {
                        setProcessing(true);
                        toast.loading("Verifying your payment…", { id: "payment-verification", duration: 10000 });
                        try {
                            const verificationResponse = await fetchApi("/payment/verify", {
                                method: "POST", credentials: "include",
                                body: JSON.stringify({
                                    razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature,
                                    razorpayOrderId: response.razorpay_order_id, razorpayPaymentId: response.razorpay_payment_id, razorpaySignature: response.razorpay_signature,
                                    shippingAddressId: selectedAddressId, billingAddressSameAsShipping: true,
                                    couponCode: coupon?.code || null, couponId: coupon?.id || null, discountAmount: totals.discount || 0, notes: "",
                                }),
                            });
                            toast.dismiss("payment-verification");
                            if (verificationResponse.success) {
                                toast.success("Payment verified successfully!", { duration: 3000 });
                                setOrderId(verificationResponse.data.orderId);
                                handleSuccessfulPayment(response, verificationResponse.data);
                            } else { throw new Error(verificationResponse.message || "Payment verification failed"); }
                        } catch (error) {
                            console.error("Payment verification error:", error);
                            toast.dismiss("payment-verification");
                            if (error.message?.includes("previously cancelled")) {
                                setError("Your previous order was cancelled. Please refresh and try again.");
                                toast.error("Please refresh the page to start a new checkout", { duration: 6000 });
                            } else {
                                setError(error.message || "Payment verification failed");
                                toast.error(error.message || "Payment verification failed.", { duration: 5000 });
                            }
                            setProcessing(false);
                        }
                    },
                    theme: { color: "#2563EB" },
                    modal: { ondismiss: function () { setProcessing(false); } },
                };
                const razorpay = new window.Razorpay(options);
                razorpay.open();
            } else { toast.error("Please select a payment method"); return; }
        } catch (error) {
            console.error("Checkout error:", error);
            toast.dismiss("order-creation"); toast.dismiss("payment-gateway"); toast.dismiss("payment-verification");
            if (error.message?.includes("previously cancelled")) {
                setError("This order was previously cancelled. Please refresh to start new checkout.");
                toast.error("Please refresh the page to start a new checkout", { duration: 6000 });
            } else { setError(error.message || "Checkout failed"); toast.error(error.message || "Checkout failed", { duration: 4000 }); }
        } finally { setProcessing(false); }
    };

    /* Loading */
    if (!isAuthenticated || loadingAddresses) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-[3px] border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400 text-sm font-medium">Loading checkout…</p>
                </div>
            </div>
        );
    }

    /* Order success */
    if (orderCreated) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center px-4">
                <div className="max-w-lg w-full rounded-2xl p-8 md:p-10 text-center relative overflow-hidden"
                    style={{ border: "1px solid #F0F0F0", boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
                    <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 0%, rgba(37,99,235,0.03), transparent 70%)" }} />

                    <div className="relative z-10">
                        <div className="relative flex justify-center mb-6">
                            <div className="w-24 h-24 rounded-3xl flex items-center justify-center"
                                style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.12)" }}>
                                <RiCheckboxCircleLine className={`w-14 h-14 text-emerald-500 ${confettiCannon ? "animate-pulse" : ""}`} />
                            </div>
                        </div>

                        <h1 className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">Order Confirmed!</h1>

                        {orderNumber && (
                            <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg mt-3 mb-4"
                                style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.1)" }}>
                                <span className="text-sm font-bold text-blue-600">Order #{orderNumber}</span>
                            </div>
                        )}

                        <div className="my-6 flex items-center justify-center gap-2 p-4 rounded-xl"
                            style={{ background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.1)" }}>
                            <RiCheckboxCircleLine className="h-6 w-6 text-emerald-500" />
                            <p className="text-emerald-700 font-bold">Payment Successful</p>
                        </div>

                        <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
                            Thank you for your purchase! You&apos;ll receive an email confirmation shortly.
                        </p>

                        <div className="mb-6 rounded-xl p-4" style={{ background: "rgba(37,99,235,0.03)", border: "1px solid rgba(37,99,235,0.08)" }}>
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <RiLoader4Line className="h-4 w-4 text-blue-500 animate-spin" />
                                <p className="text-blue-700 text-sm font-medium">Redirecting in {redirectCountdown}s…</p>
                            </div>
                            <Link href="/account/orders" className="text-blue-600 hover:underline text-xs font-bold">Go to orders now →</Link>
                        </div>

                        <div className="flex justify-center gap-3">
                            <Link href="/account/orders">
                                <button className="group px-6 py-3 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:scale-[1.03] inline-flex items-center gap-2"
                                    style={{ background: "linear-gradient(135deg, #1E40AF, #2563EB, #3B82F6)", boxShadow: "0 4px 16px rgba(37,99,235,0.25)" }}>
                                    <RiShoppingBagLine className="w-4 h-4" /> My Orders
                                </button>
                            </Link>
                            <Link href="/courses">
                                <button className="px-6 py-3 rounded-xl text-sm font-semibold text-blue-600 transition-all duration-200 hover:bg-blue-50 inline-flex items-center gap-2"
                                    style={{ border: "1px solid rgba(37,99,235,0.2)" }}>
                                    <RiGiftLine className="w-4 h-4" /> Browse Courses
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-white sticky top-[64px] z-30" style={{ borderBottom: "1px solid #F0F0F0" }}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
                    <nav className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                        <Link href="/" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                            <RiHome4Line className="w-3 h-3" /> Home
                        </Link>
                        <RiArrowRightSLine className="w-3 h-3" />
                        <Link href="/cart" className="hover:text-blue-600 transition-colors">Cart</Link>
                        <RiArrowRightSLine className="w-3 h-3" />
                        <span className="text-gray-700 font-medium">Checkout</span>
                    </nav>
                    <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Checkout</h1>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 relative">
                {/* Processing overlay */}
                {processing && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
                        <div className="rounded-2xl p-8 max-w-md mx-4 text-center" style={{ background: "#FFFFFF", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
                            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
                                style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.1)" }}>
                                <RiLoader4Line className="h-10 w-10 text-blue-500 animate-spin" />
                            </div>
                            <h3 className="text-lg font-extrabold text-gray-900 mb-2 tracking-tight">Processing Payment</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">Please wait. Do not refresh or close this page.</p>
                            <div className="flex items-center justify-center gap-1.5 mt-4">
                                {[0, 1, 2].map((i) => (
                                    <div key={i} className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 rounded-xl flex items-start gap-3"
                        style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.12)" }}>
                        <RiAlertLine className="text-red-500 mt-0.5 flex-shrink-0 w-5 h-5" />
                        <div>
                            <p className="text-red-700 font-bold text-sm">Payment Failed</p>
                            <p className="text-red-500 text-sm mt-0.5">{error}</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
                    {/* LEFT */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Digital notice */}
                        {isAllDigital && (
                            <div className="rounded-xl p-4 flex items-start gap-3"
                                style={{ background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.1)" }}>
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                    style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)" }}>
                                    <RiFlashlightLine className="w-4 h-4 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="font-bold text-emerald-800 text-sm">Digital Delivery</p>
                                    <p className="text-emerald-600 text-xs mt-0.5">Your order contains only digital products. Access details will be sent to your email after payment.</p>
                                </div>
                            </div>
                        )}

                        {/* Address */}
                        {!isAllDigital && (
                            <div className="rounded-2xl p-6" style={{ border: "1px solid #F0F0F0" }}>
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="text-sm font-extrabold text-gray-900 flex items-center gap-2 tracking-tight">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                                            style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.1)" }}>
                                            <RiMapPinLine className="h-4 w-4 text-blue-500" />
                                        </div>
                                        Shipping Address
                                    </h2>
                                    <button onClick={() => setShowAddressForm(!showAddressForm)}
                                        className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                                        <RiAddLine className="h-3.5 w-3.5" /> Add New
                                    </button>
                                </div>

                                {showAddressForm && <AddressForm onSuccess={handleAddressFormSuccess} onCancel={() => setShowAddressForm(false)} isInline={true} />}

                                {addresses.length === 0 && !showAddressForm ? (
                                    <div className="rounded-xl p-4" style={{ background: "rgba(37,99,235,0.03)", border: "1px solid rgba(37,99,235,0.08)" }}>
                                        <span className="text-blue-700 text-sm">
                                            No saved addresses.{" "}
                                            <button className="font-bold underline" onClick={() => setShowAddressForm(true)}>Add an address</button> to continue.
                                        </span>
                                    </div>
                                ) : (
                                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${showAddressForm ? "mt-6" : ""}`}>
                                        {addresses.map((address) => (
                                            <div key={address.id}
                                                className="rounded-xl p-4 cursor-pointer transition-all duration-200"
                                                style={{
                                                    border: selectedAddressId === address.id ? "2px solid #2563EB" : "1px solid #EBEBEB",
                                                    background: selectedAddressId === address.id ? "linear-gradient(170deg, #F8FAFF, #EFF6FF)" : "#FFFFFF",
                                                    boxShadow: selectedAddressId === address.id ? "0 2px 8px rgba(37,99,235,0.08)" : "none",
                                                }}
                                                onClick={() => handleAddressSelect(address.id)}>
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="font-bold text-gray-900 text-sm">{address.name}</span>
                                                    {address.isDefault && (
                                                        <span className="text-[9px] font-bold px-2 py-0.5 rounded"
                                                            style={{ background: "rgba(37,99,235,0.06)", color: "#2563EB", border: "1px solid rgba(37,99,235,0.1)" }}>DEFAULT</span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-400 space-y-0.5">
                                                    <p>{address.street}</p>
                                                    <p>{address.city}, {address.state} {address.postalCode}</p>
                                                    <p>{address.country}</p>
                                                    {address.phone && (
                                                        <p className="mt-1 text-gray-500 flex items-center gap-1">
                                                            <RiPhoneLine className="w-3 h-3" /> {address.phone}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="mt-3 flex items-center gap-2">
                                                    <input type="radio" name="addressSelection" checked={selectedAddressId === address.id}
                                                        onChange={() => handleAddressSelect(address.id)} className="h-4 w-4 text-blue-500 border-gray-300 focus:ring-blue-400" />
                                                    <label className="text-xs font-semibold text-gray-500 cursor-pointer">Deliver here</label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Payment */}
                        <div className="rounded-2xl p-6" style={{ border: "1px solid #F0F0F0" }}>
                            <h2 className="text-sm font-extrabold text-gray-900 flex items-center gap-2 mb-5 tracking-tight">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.1)" }}>
                                    <RiBankCardLine className="h-4 w-4 text-blue-500" />
                                </div>
                                Payment Method
                            </h2>

                            {!paymentSettings.cashEnabled && !paymentSettings.razorpayEnabled ? (
                                <div className="rounded-xl p-4" style={{ background: "rgba(37,99,235,0.03)", border: "1px solid rgba(37,99,235,0.08)" }}>
                                    <p className="text-sm text-blue-700">No payment methods available. Please contact support.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {paymentSettings.cashEnabled && !isAllDigital && (
                                        <div className="rounded-xl p-4 transition-all duration-200 cursor-pointer"
                                            style={{
                                                border: paymentMethod === "CASH" ? "2px solid #2563EB" : "1px solid #EBEBEB",
                                                background: paymentMethod === "CASH" ? "linear-gradient(170deg, #F8FAFF, #EFF6FF)" : "#FFFFFF",
                                            }}
                                            onClick={() => handlePaymentMethodSelect("CASH")}>
                                            <div className="flex items-center gap-3">
                                                <input type="radio" id="cash" name="paymentMethod" checked={paymentMethod === "CASH"}
                                                    onChange={() => handlePaymentMethodSelect("CASH")} className="h-4 w-4 text-blue-500" />
                                                <label htmlFor="cash" className="flex items-center flex-1 cursor-pointer">
                                                    <span className="font-bold text-gray-900 text-sm">Cash on Delivery</span>
                                                    {paymentMethod === "CASH" && (
                                                        <span className="ml-2 text-[9px] font-bold px-2 py-0.5 rounded"
                                                            style={{ background: "rgba(16,185,129,0.06)", color: "#059669", border: "1px solid rgba(16,185,129,0.1)" }}>SELECTED</span>
                                                    )}
                                                </label>
                                                <RiWalletLine className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                                            </div>
                                            <p className="text-xs mt-2 ml-7 text-gray-400">
                                                Pay when your order arrives
                                                {paymentSettings.codCharge > 0 && (
                                                    <span className="block mt-1 text-blue-600 font-semibold">+ {formatCurrency(paymentSettings.codCharge)} COD fee</span>
                                                )}
                                            </p>
                                        </div>
                                    )}

                                    {paymentSettings.razorpayEnabled && (
                                        <div className="rounded-xl p-4 transition-all duration-200 cursor-pointer"
                                            style={{
                                                border: paymentMethod === "RAZORPAY" ? "2px solid #2563EB" : "1px solid #EBEBEB",
                                                background: paymentMethod === "RAZORPAY" ? "linear-gradient(170deg, #F8FAFF, #EFF6FF)" : "#FFFFFF",
                                            }}
                                            onClick={() => handlePaymentMethodSelect("RAZORPAY")}>
                                            <div className="flex items-center gap-3">
                                                <input type="radio" id="razorpay" name="paymentMethod" checked={paymentMethod === "RAZORPAY"}
                                                    onChange={() => handlePaymentMethodSelect("RAZORPAY")} className="h-4 w-4 text-blue-500" />
                                                <label htmlFor="razorpay" className="flex items-center flex-1 cursor-pointer">
                                                    <span className="font-bold text-gray-900 text-sm">Pay Online</span>
                                                    {paymentMethod === "RAZORPAY" && (
                                                        <span className="ml-2 text-[9px] font-bold px-2 py-0.5 rounded"
                                                            style={{ background: "rgba(37,99,235,0.06)", color: "#2563EB", border: "1px solid rgba(37,99,235,0.1)" }}>SELECTED</span>
                                                    )}
                                                </label>
                                                <RiMoneyRupeeCircleLine className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                            </div>
                                            <p className="text-xs mt-2 ml-7 text-gray-400">Credit/Debit Card, UPI, NetBanking & more</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT — Summary */}
                    <div className="lg:col-span-1">
                        <div className="rounded-2xl overflow-hidden sticky top-24"
                            style={{ border: "1px solid #F0F0F0", boxShadow: "0 4px 24px rgba(0,0,0,0.03)" }}>
                            <div className="px-6 py-4" style={{ background: "linear-gradient(170deg, #F8FAFF, #EFF6FF)", borderBottom: "1px solid rgba(59,130,246,0.06)" }}>
                                <h2 className="text-sm font-extrabold text-gray-900 tracking-tight">Order Summary</h2>
                                <p className="text-[11px] text-gray-400 mt-0.5">{cart.totalQuantity} item{cart.totalQuantity !== 1 ? "s" : ""}</p>
                            </div>

                            {/* Items */}
                            <div className="px-5 py-4 max-h-56 overflow-y-auto space-y-3" style={{ borderBottom: "1px solid #F0F0F0" }}>
                                {cart.items?.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-xl flex-shrink-0 relative overflow-hidden"
                                            style={{ background: "#FAFAFA", border: "1px solid #F0F0F0" }}>
                                            {item.product.image && (
                                                <Image src={getImageUrl(item.product.image)} alt={item.product.name} fill className="object-contain p-1" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <Link href={item.product?.slug ? `/courses/${item.product.slug}` : "/courses"}
                                                className="text-xs font-bold text-gray-900 truncate block hover:text-blue-600 transition-colors">
                                                {item.product.name}
                                            </Link>
                                            {item.variant?.attributes?.length > 0 && (
                                                <p className="text-[11px] text-gray-400 truncate">{item.variant.attributes.map((a) => `${a.value}`).join(" · ")}</p>
                                            )}
                                            <p className="text-[11px] text-gray-400">{item.quantity} × {formatCurrency(item.price)}</p>
                                        </div>
                                        <p className="font-bold text-xs text-gray-900 flex-shrink-0">{formatCurrency(item.subtotal)}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Breakdown */}
                            <div className="px-5 py-4 space-y-2.5 text-sm" style={{ borderBottom: "1px solid #F0F0F0" }}>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Subtotal</span>
                                    <span className="font-bold text-gray-900">{formatCurrency(totals.subtotal)}</span>
                                </div>
                                {coupon && (
                                    <div className="flex justify-between items-center rounded-lg px-3 py-2"
                                        style={{ background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.1)" }}>
                                        <span className="text-emerald-700 font-semibold flex items-center gap-1 text-xs">
                                            <RiCoupon3Line className="w-3.5 h-3.5" /> {coupon.code}
                                        </span>
                                        <span className="text-emerald-700 font-bold">-{formatCurrency(totals.discount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Delivery</span>
                                    {totals.shipping > 0 ? (
                                        <span className="font-bold">{formatCurrency(totals.shipping)}</span>
                                    ) : (
                                        <span className="text-emerald-600 font-bold flex items-center gap-1 text-xs">
                                            <RiCheckboxCircleLine className="w-3.5 h-3.5" /> FREE
                                        </span>
                                    )}
                                </div>
                                {paymentMethod === "CASH" && paymentSettings.codCharge > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">COD Charge</span>
                                        <span className="font-bold">{formatCurrency(paymentSettings.codCharge)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Total + CTA */}
                            <div className="px-5 py-5 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-900">Grand Total</span>
                                    <span className="font-extrabold text-blue-600 text-2xl tracking-tight">
                                        {formatCurrency(totals.total + (paymentMethod === "CASH" ? (paymentSettings.codCharge || 0) : 0))}
                                    </span>
                                </div>

                                <button
                                    className="group w-full h-12 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2
                             transition-all duration-300 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{
                                        background: "linear-gradient(135deg, #1E40AF, #2563EB, #3B82F6)",
                                        boxShadow: "0 4px 16px rgba(37,99,235,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
                                    }}
                                    onClick={handleCheckout}
                                    disabled={processing || (!isAllDigital && (!selectedAddressId || addresses.length === 0)) || !paymentMethod}>
                                    {processing ? (
                                        <><RiLoader4Line className="h-5 w-5 animate-spin" /> Processing…</>
                                    ) : (
                                        <>
                                            <RiMoneyRupeeCircleLine className="h-4 w-4" />
                                            Place Order
                                            <span className="bg-white/15 px-2.5 py-0.5 rounded-lg text-xs font-extrabold">
                                                {formatCurrency(totals.total + (paymentMethod === "CASH" ? (paymentSettings.codCharge || 0) : 0))}
                                            </span>
                                        </>
                                    )}
                                </button>

                                <p className="text-center text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
                                    <RiShieldCheckLine className="w-3.5 h-3.5 text-emerald-500/60" />
                                    Secure checkout · Terms apply
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}