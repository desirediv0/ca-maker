"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { fetchApi, formatCurrency, loadScript } from "@/lib/utils";
import { playSuccessSound, fireConfetti } from "@/lib/sound-utils";
import { Button } from "@/components/ui/button";
import {
    CreditCard,
    AlertCircle,
    Loader2,
    CheckCircle,
    MapPin,
    Plus,
    IndianRupee,
    ShoppingBag,
    PartyPopper,
    Gift,
    Wallet,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import AddressForm from "@/components/AddressForm";
import Image from "next/image";

// Helper function to format image URLs correctly
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
    const [paymentSettings, setPaymentSettings] = useState({
        cashEnabled: true,
        razorpayEnabled: false,
        codCharge: 0,
    });
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
    const [redirectCountdown, setRedirectCountdown] = useState(2); // Reduced from 3 to 2 seconds
    const [confettiCannon, setConfettiCannon] = useState(false);

    const totals = getCartTotals();

    // Detect if every item in the cart is a digital product
    const isAllDigital = cart.items?.length > 0 &&
        cart.items.every((item) => item?.product?.digitalEnabled === true);

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/auth?redirect=checkout");
        }
    }, [isAuthenticated, router]);

    // Redirect if cart is empty (but not if order is already created)
    useEffect(() => {
        if (isAuthenticated && cart.items?.length === 0 && !orderCreated) {
            router.push("/cart");
        }
    }, [isAuthenticated, cart, router, orderCreated]);

    // Fetch payment settings
    useEffect(() => {
        const fetchPaymentSettings = async () => {
            try {
                const response = await fetchApi("/payment/settings", {
                    credentials: "include",
                });
                if (response.success) {
                    setPaymentSettings({
                        cashEnabled: response.data.cashEnabled ?? true,
                        razorpayEnabled: response.data.razorpayEnabled ?? false,
                        codCharge: response.data.codCharge ?? 0,
                    });
                    // Set default payment method based on settings (priority: Cash > Razorpay)
                    if (response.data.cashEnabled) {
                        setPaymentMethod("CASH");
                    } else if (response.data.razorpayEnabled) {
                        setPaymentMethod("RAZORPAY");
                    }
                }
            } catch (error) {
                console.error("Error fetching payment settings:", error);
                // Default to cash if fetch fails
                setPaymentMethod("CASH");
            }
        };
        fetchPaymentSettings();
    }, []);

    // Fetch addresses
    const fetchAddresses = useCallback(async () => {
        if (!isAuthenticated) return;

        setLoadingAddresses(true);
        try {
            const response = await fetchApi("/users/addresses", {
                credentials: "include",
            });

            if (response.success) {
                setAddresses(response.data.addresses || []);

                // Set the default address if available
                if (response.data.addresses?.length > 0) {
                    const defaultAddress = response.data.addresses.find(
                        (addr) => addr.isDefault
                    );
                    if (defaultAddress) {
                        setSelectedAddressId(defaultAddress.id);
                    } else {
                        setSelectedAddressId(response.data.addresses[0].id);
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching addresses:", error);
            toast.error("Failed to load your addresses");
        } finally {
            setLoadingAddresses(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchAddresses();
    }, [fetchAddresses]);

    // Fetch Razorpay key
    useEffect(() => {
        const fetchRazorpayKey = async () => {
            try {
                const response = await fetchApi("/payment/razorpay-key", {
                    credentials: "include",
                });
                if (response.success) {
                    console.log("Razorpay key fetched successfully");
                    setRazorpayKey(response.data.key);
                } else {
                    console.error("Failed to fetch Razorpay key:", response);
                }
            } catch (error) {
                console.error("Error fetching Razorpay key:", error);
            }
        };

        if (isAuthenticated) {
            fetchRazorpayKey();
        }
    }, [isAuthenticated]);

    // Handle address selection
    const handleAddressSelect = (id) => {
        setSelectedAddressId(id);
    };

    // Handle payment method selection
    const handlePaymentMethodSelect = (method) => {
        setPaymentMethod(method);
    };

    // Handle address form success
    const handleAddressFormSuccess = () => {
        setShowAddressForm(false);
        fetchAddresses();
    };

    // Add countdown for redirect
    useEffect(() => {
        if (orderCreated && redirectCountdown > 0) {
            const timer = setTimeout(() => {
                setRedirectCountdown(redirectCountdown - 1);
            }, 1000);

            return () => clearTimeout(timer);
        } else if (orderCreated && redirectCountdown === 0) {
            router.push(`/account/orders`);
        }
    }, [orderCreated, redirectCountdown, router]);

    // Enhanced confetti effect when order is successful
    useEffect(() => {
        if (successAnimation) {
            // Trigger the celebration confetti
            fireConfetti.celebration();

            // Follow with just one more cannon after 1.5 seconds for lighter effect
            const timer = setTimeout(() => {
                setConfettiCannon(true);
                fireConfetti.sides();
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [successAnimation]);

    // Update the payment handler with enhanced audio feedback
    const handleSuccessfulPayment = (
        paymentResponse = null,
        orderData = null
    ) => {
        // Handle Razorpay payment response
        if (paymentResponse?.razorpay_payment_id) {
            setPaymentId(paymentResponse.razorpay_payment_id);
        }

        // Handle order data (from both cash and razorpay orders)
        if (orderData?.orderNumber) {
            setOrderNumber(orderData.orderNumber);
        }

        // Start success animation
        setSuccessAnimation(true);

        // Play a single success sound
        // Don't play both sounds as that might be too much
        playSuccessSound();

        // Clear cart after successful order
        clearCart();

        // Show enhanced success toast
        const orderNum = orderData?.orderNumber || orderNumber || "";
        toast.success("Order placed successfully!", {
            duration: 4000,
            icon: <PartyPopper className="h-5 w-5 text-green-500" />,
            description: orderNum
                ? `Your order #${orderNum} has been confirmed. Redirecting to orders page...`
                : "Your order has been confirmed. Redirecting to orders page...",
        });

        // Set order created after a brief delay to ensure cart is cleared first
        setTimeout(() => {
            setOrderCreated(true);
        }, 100);
    };

    // Process checkout
    const handleCheckout = async () => {
        if (!selectedAddressId) {
            toast.error("Please select a shipping address");
            return;
        }

        setProcessing(true);
        setError("");

        try {
            // Get checkout amount
            const calculatedAmount = totals.total;
            // Fix: Keep 2 decimal places instead of rounding to preserve exact amount
            const amount = Math.max(parseFloat(calculatedAmount.toFixed(2)), 1);

            // Show warning if original amount was less than 1
            if (calculatedAmount < 1) {
                toast.info("Minimum order amount is ₹1. Your total has been adjusted.");
            }

            if (paymentMethod === "CASH") {
                // Create Cash on Delivery order
                toast.loading("Creating your order...", {
                    id: "order-creation",
                    duration: 10000,
                });

                const orderResponse = await fetchApi("/payment/cash-order", {
                    method: "POST",
                    credentials: "include",
                    body: JSON.stringify({
                        shippingAddressId: selectedAddressId,
                        billingAddressSameAsShipping: true,
                        couponCode: coupon?.code || null,
                        couponId: coupon?.id || null,
                        discountAmount: totals.discount || 0,
                    }),
                });

                toast.dismiss("order-creation");

                if (!orderResponse.success) {
                    throw new Error(orderResponse.message || "Failed to create order");
                }

                // Show success for cash order
                const orderData = {
                    orderNumber: orderResponse.data.orderNumber,
                    orderId: orderResponse.data.orderId,
                    paymentMethod: orderResponse.data.paymentMethod || "CASH",
                };
                setOrderNumber(orderResponse.data.orderNumber);
                setOrderId(orderResponse.data.orderId || "");
                handleSuccessfulPayment(null, orderData);
                return;
            } else if (paymentMethod === "RAZORPAY") {
                // Ensure Razorpay key is available
                if (!razorpayKey) {
                    // Try to fetch it again
                    try {
                        const keyResponse = await fetchApi("/payment/razorpay-key", {
                            method: "GET",
                            credentials: "include",
                        });
                        if (keyResponse.success && keyResponse.data?.key) {
                            setRazorpayKey(keyResponse.data.key);
                        } else {
                            throw new Error("Razorpay key not available. Please configure payment gateway settings.");
                        }
                    } catch (keyError) {
                        throw new Error("Failed to fetch Razorpay key. Please configure payment gateway settings in admin panel.");
                    }
                }

                // Show loading toast for order creation
                toast.loading("Creating your order...", {
                    id: "order-creation",
                    duration: 10000,
                });

                // Step 1: Create Razorpay order
                const orderResponse = await fetchApi("/payment/checkout", {
                    method: "POST",
                    credentials: "include",
                    body: JSON.stringify({
                        amount,
                        currency: "INR",
                        paymentGateway: "RAZORPAY",
                        // Include coupon information for proper tracking
                        couponCode: coupon?.code || null,
                        couponId: coupon?.id || null,
                        discountAmount: totals.discount || 0,
                    }),
                });

                // Dismiss order creation toast
                toast.dismiss("order-creation");

                if (!orderResponse.success) {
                    throw new Error(orderResponse.message || "Failed to create order");
                }

                // Show success toast for order creation
                toast.success("Order created! Opening payment gateway...", {
                    duration: 2000,
                });

                const razorpayOrder = orderResponse.data;
                setOrderId(razorpayOrder.id);

                // Step 2: Load Razorpay script with loading indicator
                toast.loading("Loading payment gateway...", {
                    id: "payment-gateway",
                    duration: 5000,
                });

                const loaded = await loadScript(
                    "https://checkout.razorpay.com/v1/checkout.js"
                );

                toast.dismiss("payment-gateway");

                if (!loaded) {
                    throw new Error("Razorpay SDK failed to load");
                }

                // Get the current razorpayKey (ensure it's available)
                let currentKey = razorpayKey;
                if (!currentKey) {
                    try {
                        const keyResponse = await fetchApi("/payment/razorpay-key", {
                            method: "GET",
                            credentials: "include",
                        });
                        if (keyResponse.success && keyResponse.data?.key) {
                            currentKey = keyResponse.data.key;
                            setRazorpayKey(currentKey);
                        }
                    } catch (keyError) {
                        console.error("Failed to fetch Razorpay key:", keyError);
                    }
                }

                if (!currentKey) {
                    throw new Error("Razorpay key is missing. Please configure payment gateway settings in admin panel.");
                }

                const options = {
                    key: currentKey,
                    amount: razorpayOrder.amount,
                    currency: razorpayOrder.currency,
                    name: "CA Maker",
                    description: "CA Courses & Study Material by CA Mohit Kukreja",
                    order_id: razorpayOrder.id,
                    prefill: {
                        name: user?.name || "",
                        email: user?.email || "",
                        contact: user?.phone || "",
                    },
                    handler: async function (response) {
                        // Step 4: Verify payment - Show loading state during verification
                        setProcessing(true);

                        // Add a toast to show payment verification is in progress
                        toast.loading("Verifying your payment...", {
                            id: "payment-verification",
                            duration: 10000,
                        });

                        try {
                            const verificationResponse = await fetchApi("/payment/verify", {
                                method: "POST",
                                credentials: "include",
                                body: JSON.stringify({
                                    // Send both formats to ensure compatibility
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature,
                                    // Also send camelCase versions
                                    razorpayOrderId: response.razorpay_order_id,
                                    razorpayPaymentId: response.razorpay_payment_id,
                                    razorpaySignature: response.razorpay_signature,
                                    // Include shipping and coupon information
                                    shippingAddressId: selectedAddressId,
                                    billingAddressSameAsShipping: true,
                                    // Also pass coupon information again to ensure it's included
                                    couponCode: coupon?.code || null,
                                    couponId: coupon?.id || null,
                                    discountAmount: totals.discount || 0,
                                    notes: "",
                                }),
                            });

                            // Dismiss the loading toast
                            toast.dismiss("payment-verification");

                            if (verificationResponse.success) {
                                // Show success message
                                toast.success("Payment verified successfully! 🎉", {
                                    duration: 3000,
                                });

                                setOrderId(verificationResponse.data.orderId);
                                handleSuccessfulPayment(response, verificationResponse.data);
                            } else {
                                throw new Error(
                                    verificationResponse.message || "Payment verification failed"
                                );
                            }
                        } catch (error) {
                            console.error("Payment verification error:", error);

                            // Dismiss the loading toast
                            toast.dismiss("payment-verification");

                            // If the error is about a previously cancelled order, guide the user
                            if (
                                error.message &&
                                error.message.includes("previously cancelled")
                            ) {
                                setError(
                                    "Your previous order was cancelled. Please refresh the page and try again."
                                );
                                toast.error("Please refresh the page to start a new checkout", {
                                    duration: 6000,
                                    style: {
                                        backgroundColor: "#FEF3C7",
                                        color: "#D97706",
                                        border: "1px solid #FCD34D",
                                    },
                                });
                            } else {
                                setError(error.message || "Payment verification failed");
                                toast.error(
                                    error.message ||
                                    "Payment verification failed. Please try again.",
                                    {
                                        duration: 5000,
                                        style: {
                                            backgroundColor: "#FEE2E2",
                                            color: "#DC2626",
                                            border: "1px solid #FECACA",
                                        },
                                    }
                                );
                            }

                            setProcessing(false);
                        }
                    },
                    theme: {
                        color: "#FD5D0D", // Use primary color for Razorpay modal
                    },
                    modal: {
                        ondismiss: function () {
                            // When Razorpay modal is dismissed
                            setProcessing(false);
                        },
                    },
                };

                const razorpay = new window.Razorpay(options);
                razorpay.open();
            } else {
                // No payment method selected or available
                toast.error("Please select a payment method");
                return;
            }
        } catch (error) {
            console.error("Checkout error:", error);

            // Dismiss any pending loading toasts
            toast.dismiss("order-creation");
            toast.dismiss("payment-gateway");
            toast.dismiss("payment-verification");

            if (
                error.message &&
                error.message.includes("order was previously cancelled")
            ) {
                // Clear local state and guide the user
                setError(
                    "This order was previously cancelled. Please refresh the page to start a new checkout."
                );
                toast.error("Please refresh the page to start a new checkout", {
                    duration: 6000,
                    style: {
                        backgroundColor: "#FEF3C7",
                        color: "#D97706",
                        border: "1px solid #FCD34D",
                    },
                });
            } else {
                setError(error.message || "Checkout failed");
                toast.error(error.message || "Checkout failed", {
                    duration: 4000,
                    style: {
                        backgroundColor: "#FEE2E2",
                        color: "#DC2626",
                        border: "1px solid #FECACA",
                    },
                });
            }
        } finally {
            setProcessing(false);
        }
    };

    if (!isAuthenticated || loadingAddresses) {
        return (
            <div className="container mx-auto px-4 py-10">
                <div className="flex justify-center items-center h-64">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    // If order created successfully
    if (orderCreated) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-lg mx-auto bg-white p-8 rounded border shadow-lg relative overflow-hidden">
                    {/* Background pattern for festive feel */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent z-0"></div>

                    {/* Celebration animation */}
                    <div className="relative z-10">
                        <div className="relative flex justify-center">
                            <div className="h-36 w-36 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                                <PartyPopper
                                    className={`h-20 w-20 text-primary ${confettiCannon ? "animate-pulse" : ""
                                        }`}
                                />
                            </div>

                            {/* Radiating circles animation */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="animate-ping absolute h-40 w-40 rounded-full bg-primary opacity-20"></div>
                                <div className="animate-ping absolute h-32 w-32 rounded-full bg-green-500 opacity-10 delay-150"></div>
                                <div className="animate-ping absolute h-24 w-24 rounded-full bg-yellow-500 opacity-10 delay-300"></div>
                            </div>
                        </div>

                        <div className="text-center">
                            <h1 className="text-4xl font-bold mb-2 text-gray-800 animate-pulse">
                                Woohoo!
                            </h1>

                            <h2 className="text-2xl font-bold mb-2 text-gray-800">
                                Order Confirmed!
                            </h2>

                            {orderNumber && (
                                <div className="bg-primary/10 py-2 px-4 rounded-full inline-block mb-3">
                                    <p className="text-lg font-semibold text-primary">
                                        Order #{orderNumber}
                                    </p>
                                </div>
                            )}

                            <div className="my-6 flex items-center justify-center bg-green-50 p-4 rounded">
                                <CheckCircle className="h-8 w-8 text-green-500 mr-2" />
                                <p className="text-xl text-green-600 font-medium">
                                    Payment Successful
                                </p>
                            </div>

                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                Thank you for your purchase! Your order has been successfully
                                placed and you&apos;ll receive an email confirmation shortly.
                            </p>

                            <div className="mb-6 bg-orange-50 p-4 rounded border border-orange-100">
                                <div className="flex items-center justify-center space-x-2 mb-3">
                                    <Loader2 className="h-4 w-4 text-orange-500 animate-spin" />
                                    <p className="text-orange-700 text-sm font-medium">
                                        Redirecting to orders in {redirectCountdown} seconds…
                                    </p>
                                </div>
                                <div className="text-center">
                                    <Link href="/account/orders">
                                        <button className="text-orange-600 hover:text-orange-800 text-sm font-semibold underline">
                                            Go to orders now →
                                        </button>
                                    </Link>
                                </div>
                            </div>

                            <div className="flex justify-center gap-4">
                                <Link href="/account/orders">
                                    <Button className="gap-2 bg-primary hover:bg-primary/90">
                                        <ShoppingBag size={16} />
                                        My Orders
                                    </Button>
                                </Link>
                                <Link href="/courses">
                                    <Button variant="outline" className="gap-2 border-orange-500 text-orange-600 hover:bg-orange-50">
                                        <Gift size={16} />
                                        Browse Courses
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Page header */}
            <div className="bg-white border-b border-gray-100 sticky top-[64px] z-30">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="h-1 w-6 bg-orange-500 rounded-full" />
                        <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 relative">
                {/* Loading Overlay for Payment Processing */}
                {processing && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                        <div className="bg-white rounded p-8 max-w-md mx-4 text-center shadow-2xl">
                            <div className="mb-6">
                                <div className="h-20 w-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    Processing Your Payment
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    Please wait while we securely process your payment. Do not
                                    refresh or close this page.
                                </p>
                            </div>
                            <div className="flex items-center justify-center gap-1.5">
                                <div className="h-2 w-2 bg-orange-500 rounded-full animate-bounce"></div>
                                <div className="h-2 w-2 bg-orange-500 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                                <div className="h-2 w-2 bg-orange-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded flex items-start">
                        <AlertCircle className="text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                            <p className="text-red-700 font-semibold">Payment Failed</p>
                            <p className="text-red-600">{error}</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Main checkout area */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Digital delivery notice */}
                        {isAllDigital && (
                            <div className="bg-green-50 border border-green-200 rounded p-4 flex items-start gap-3">
                                <span className="text-2xl flex-shrink-0">⚡</span>
                                <div>
                                    <p className="font-semibold text-green-800 text-sm">Digital Delivery</p>
                                    <p className="text-green-700 text-xs mt-0.5">
                                        Your order contains only digital products. No shipping address is required.
                                        Access details will be sent to your registered email after payment.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Shipping Addresses — hidden for all-digital carts */}
                        {!isAllDigital && <div className="bg-white rounded shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-base font-bold text-gray-900 flex items-center">
                                    <MapPin className="h-5 w-5 mr-2 text-orange-500" />
                                    Shipping Address
                                </h2>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                    onClick={() => setShowAddressForm(!showAddressForm)}
                                >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add New
                                </Button>
                            </div>

                            {showAddressForm && (
                                <AddressForm
                                    onSuccess={handleAddressFormSuccess}
                                    onCancel={() => setShowAddressForm(false)}
                                    isInline={true}
                                />
                            )}

                            {addresses.length === 0 && !showAddressForm ? (
                                <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
                                    <span className="text-yellow-700">
                                        You don&apos;t have any saved addresses.{" "}
                                        <button
                                            className="font-medium underline"
                                            onClick={() => setShowAddressForm(true)}
                                        >
                                            Add an address
                                        </button>{" "}
                                        to continue.
                                    </span>
                                </div>
                            ) : (
                                <div
                                    className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${showAddressForm ? "mt-6" : ""
                                        }`}
                                >
                                    {addresses.map((address) => (
                                        <div
                                            key={address.id}
                                            className={`border-2 rounded p-4 cursor-pointer transition-all ${selectedAddressId === address.id
                                                ? "border-orange-500 bg-orange-50/60"
                                                : "border-gray-200 hover:border-orange-300"
                                                }`}
                                            onClick={() => handleAddressSelect(address.id)}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-semibold text-gray-900">{address.name}</span>
                                                {address.isDefault && (
                                                    <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-600 space-y-0.5">
                                                <p>{address.street}</p>
                                                <p>{address.city}, {address.state} {address.postalCode}</p>
                                                <p>{address.country}</p>
                                                {address.phone && <p className="mt-1 text-gray-500">📞 {address.phone}</p>}
                                            </div>
                                            <div className="mt-3 flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="addressSelection"
                                                    checked={selectedAddressId === address.id}
                                                    onChange={() => handleAddressSelect(address.id)}
                                                    className="h-4 w-4 text-orange-500 border-gray-300 focus:ring-orange-400"
                                                />
                                                <label htmlFor={`address-${address.id}`} className="text-sm font-medium text-gray-700 cursor-pointer">
                                                    Deliver here
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>}

                        {/* Payment Method */}
                        <div className="bg-white rounded shadow-sm border border-gray-100 p-6">
                            <h2 className="text-base font-bold text-gray-900 flex items-center mb-4">
                                <CreditCard className="h-5 w-5 mr-2 text-orange-500" />
                                Payment Method
                            </h2>

                            {!paymentSettings.cashEnabled && !paymentSettings.razorpayEnabled ? (
                                <div className="border rounded p-4 bg-yellow-50 border-yellow-200">
                                    <p className="text-sm text-yellow-800">
                                        No payment methods are currently available. Please contact support or try again later.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {/* Cash on Delivery — not available for digital-only orders */}
                                    {paymentSettings.cashEnabled && !isAllDigital && (
                                        <div
                                            className={`border-2 rounded p-4 transition-all cursor-pointer ${paymentMethod === "CASH"
                                                ? "border-orange-500 bg-orange-50"
                                                : "border-gray-200 hover:border-orange-300"
                                                }`}
                                            onClick={() => { handlePaymentMethodSelect("CASH"); }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    id="cash"
                                                    name="paymentMethod"
                                                    checked={paymentMethod === "CASH"}
                                                    onChange={() => { handlePaymentMethodSelect("CASH"); }}
                                                    className="h-4 w-4 text-orange-500 border-gray-300 focus:ring-orange-400"
                                                />
                                                <label htmlFor="cash" className="flex items-center flex-1 cursor-pointer">
                                                    <span className="font-semibold text-gray-900">Cash on Delivery</span>
                                                    {paymentMethod === "CASH" && (
                                                        <span className="ml-2 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">SELECTED</span>
                                                    )}
                                                </label>
                                                <Wallet className="h-4 w-4 text-green-600 flex-shrink-0" />
                                            </div>
                                            <p className="text-xs mt-2 ml-7 text-gray-500">
                                                Pay when your order arrives at your doorstep
                                                {paymentSettings.codCharge > 0 && (
                                                    <span className="block mt-1 text-orange-600 font-semibold">
                                                        + {formatCurrency(paymentSettings.codCharge)} COD fee
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    )}

                                    {/* Razorpay Option */}
                                    {paymentSettings.razorpayEnabled && (
                                        <div
                                            className={`border-2 rounded p-4 transition-all cursor-pointer ${paymentMethod === "RAZORPAY"
                                                ? "border-orange-500 bg-orange-50"
                                                : "border-gray-200 hover:border-orange-300"
                                                }`}
                                            onClick={() => { handlePaymentMethodSelect("RAZORPAY"); }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    id="razorpay"
                                                    name="paymentMethod"
                                                    checked={paymentMethod === "RAZORPAY"}
                                                    onChange={() => { handlePaymentMethodSelect("RAZORPAY"); }}
                                                    className="h-4 w-4 text-orange-500 border-gray-300 focus:ring-orange-400"
                                                />
                                                <label htmlFor="razorpay" className="flex items-center flex-1 cursor-pointer">
                                                    <span className="font-semibold text-gray-900">Pay Online</span>
                                                    {paymentMethod === "RAZORPAY" && (
                                                        <span className="ml-2 text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">SELECTED</span>
                                                    )}
                                                </label>
                                                <IndianRupee className="h-4 w-4 text-orange-500 flex-shrink-0" />
                                            </div>
                                            <p className="text-xs mt-2 ml-7 text-gray-500">
                                                Credit/Debit Card, UPI, NetBanking & more
                                            </p>
                                        </div>
                                    )}

                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Order Summary Panel ── */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden sticky top-20">
                            {/* Panel header */}
                            <div className="px-6 py-4 bg-orange-50/60 border-b border-gray-100">
                                <h2 className="text-base font-bold text-gray-900">Order Summary</h2>
                                <p className="text-xs text-gray-500 mt-0.5">{cart.totalQuantity} item{cart.totalQuantity !== 1 ? "s" : ""} in cart</p>
                            </div>

                            {/* Item list */}
                            <div className="px-5 py-4 max-h-56 overflow-y-auto space-y-3 border-b border-gray-100">
                                {cart.items?.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3">
                                        <div className="h-12 w-12 bg-orange-50 rounded-[8px] flex-shrink-0 relative overflow-hidden border border-orange-100">
                                            {item.product.image && (
                                                <Image
                                                    src={getImageUrl(item.product.image)}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-contain p-1"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                href={item.product?.slug ? `/courses/${item.product.slug}` : "/courses"}
                                                className="text-sm font-semibold text-gray-900 truncate block hover:text-orange-600 transition-colors"
                                            >
                                                {item.product.name}
                                            </Link>
                                            {item.variant?.attributes?.length > 0 && (
                                                <p className="text-xs text-gray-500 truncate">
                                                    {item.variant.attributes.map((a) => `${a.attribute}: ${a.value}`).join(" · ")}
                                                </p>
                                            )}
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {item.quantity} × {formatCurrency(item.price)}
                                            </p>
                                        </div>
                                        <p className="font-bold text-sm text-gray-900 flex-shrink-0">
                                            {formatCurrency(item.subtotal)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Price breakdown */}
                            <div className="px-5 py-4 space-y-2.5 text-sm border-b border-gray-100">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-semibold text-gray-900">{formatCurrency(totals.subtotal)}</span>
                                </div>

                                {coupon && (
                                    <div className="flex justify-between items-center bg-green-50 px-3 py-2 rounded">
                                        <span className="text-green-700 font-semibold flex items-center gap-1.5">
                                            🏷 {coupon.code}
                                        </span>
                                        <span className="text-green-700 font-bold">-{formatCurrency(totals.discount)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Delivery</span>
                                    {totals.shipping > 0 ? (
                                        <span className="font-semibold">{formatCurrency(totals.shipping)}</span>
                                    ) : (
                                        <span className="text-green-600 font-bold">✓ FREE</span>
                                    )}
                                </div>

                                {paymentMethod === "CASH" && paymentSettings.codCharge > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">COD Charge</span>
                                        <span className="font-semibold">{formatCurrency(paymentSettings.codCharge)}</span>
                                    </div>
                                )}

                                {totals.shipping > 0 && cart.freeShippingThreshold > 0 && (
                                    <div className="text-xs text-amber-700 bg-amber-50 border border-amber-100 p-2.5 rounded text-center font-medium">
                                        Add <strong>{formatCurrency(cart.freeShippingThreshold - totals.subtotal)}</strong> more for <span className="text-green-600 font-bold">FREE delivery</span>
                                    </div>
                                )}
                            </div>

                            {/* Grand total + CTA */}
                            <div className="px-5 py-5 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-900 text-base">Grand Total</span>
                                    <span className="font-black text-orange-600 text-2xl">
                                        {formatCurrency(
                                            totals.total + (paymentMethod === "CASH" ? (paymentSettings.codCharge || 0) : 0)
                                        )}
                                    </span>
                                </div>

                                <Button
                                    className="w-full h-14 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white
                                           text-base font-bold rounded border-0 shadow-lg shadow-orange-500/25
                                           hover:shadow-orange-500/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                    size="lg"
                                    onClick={handleCheckout}
                                    disabled={
                                        processing ||
                                        (!isAllDigital && (!selectedAddressId || addresses.length === 0)) ||
                                        !paymentMethod
                                    }
                                >
                                    {processing ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Processing…
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <IndianRupee className="h-5 w-5" />
                                            Place Order
                                            <span className="bg-orange-600 px-2.5 py-0.5 rounded text-sm font-black">
                                                {formatCurrency(
                                                    totals.total + (paymentMethod === "CASH" ? (paymentSettings.codCharge || 0) : 0)
                                                )}
                                            </span>
                                        </span>
                                    )}
                                </Button>

                                <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
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
