"use client";

import React, { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Trash2,
    Plus,
    Minus,
    ShoppingBag,
    AlertCircle,
    Loader2,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

// Helper function to format image URLs correctly
const getImageUrl = (image) => {
    if (!image) return "/placeholder.jpg";
    if (image.startsWith("http")) return image;
    return `https://desirediv-storage.blr1.digitaloceanspaces.com/${image}`;
};

// Cart item component to optimize re-renders
const CartItem = React.memo(
    ({ item, onUpdateQuantity, onRemove, isLoading }) => {
        // Get product image - priority: variant images > product image > item image > placeholder
        const getProductImage = () => {
            // Priority 1: Variant images (from server cart)
            if (
                item.variant?.images &&
                Array.isArray(item.variant.images) &&
                item.variant.images.length > 0
            ) {
                const primaryImage = item.variant.images.find((img) => img.isPrimary);
                const imageUrl = primaryImage?.url || item.variant.images[0]?.url;
                if (imageUrl) return getImageUrl(imageUrl);
            }

            // Priority 2: Product image (from server cart)
            if (item.product?.image) {
                return getImageUrl(item.product.image);
            }

            // Priority 3: Direct image property (from guest cart)
            if (item.image) {
                return getImageUrl(item.image);
            }

            // Fallback to placeholder
            return "/placeholder.jpg";
        };

        // Get variant display name - handle both guest cart and server cart structures
        const getVariantName = () => {
            // If variantName exists and is not empty, use it
            if (item.variantName && item.variantName.trim() !== "") {
                return item.variantName;
            }

            // Try to get attributes from variant object (server cart)
            if (item.variant?.attributes && item.variant.attributes.length > 0) {
                const attrStrings = item.variant.attributes.map(
                    (attr) => `${attr.attribute}: ${attr.value}`
                );
                return attrStrings.join(", ");
            }

            // Fallback to legacy color/size for backward compatibility
            let color = item.variant?.color?.name;
            let size = item.variant?.size?.name;
            if (!color) color = item.color?.name;
            if (!size) size = item.size?.name;

            if (color && size) {
                return `${color} • ${size}`;
            } else if (color) {
                return color;
            } else if (size) {
                return size;
            }

            // Return null if no variant info - don't show "Standard"
            return null;
        };

        const variantName = getVariantName();
        const productImage = getProductImage();
        const productName = item.productName || item.product?.name || "Product";
        const productSlug = item.productSlug || item.product?.slug || "#";

        return (
            <div className="p-4 md:p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center hover:bg-gray-50/50 transition-colors duration-200">
                <div className="md:col-span-6 flex items-center">
                    <div className="relative h-24 w-24 md:h-28 md:w-28 bg-gray-100 rounded-lg overflow-hidden mr-4 flex-shrink-0 shadow-sm border border-gray-200 group">
                        <Image
                            src={productImage}
                            alt={productName}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="112px"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <Link
                            href={`/products/${productSlug}`}
                            className="font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-2"
                        >
                            {productName}
                        </Link>
                        {variantName && (
                            <div className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                                {/* Show color swatch only if it's a color attribute (for backward compatibility) */}
                                {(item.variant?.color?.hexCode || item.color?.hexCode) && (
                                    <div
                                        className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0 shadow-sm"
                                        style={{
                                            backgroundColor:
                                                item.variant?.color?.hexCode || item.color?.hexCode,
                                        }}
                                    />
                                )}
                                <span className="truncate">{variantName}</span>
                            </div>
                        )}
                        {/* MOQ Display */}
                        {item.moq && item.moq > 1 && (
                            <div className="text-xs text-orange-600 mt-1 font-medium">
                                Min. Order: {item.moq} units
                            </div>
                        )}
                        {/* Pricing Slabs Info */}
                        {item.pricingSlabs && item.pricingSlabs.length > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                                Bulk pricing available
                            </div>
                        )}
                    </div>
                </div>

                <div className="md:col-span-2 flex items-center justify-between md:justify-center flex-col gap-1">
                    <span className="md:hidden font-medium text-gray-600">Price:</span>
                    <div className="flex flex-col items-end md:items-center">
                        {/* Price Visibility Logic */}
                        {!isLoading && !item.isAuthenticated && item.hidePricesForGuests ? (
                            <span className="text-sm font-medium text-amber-600">
                                Login to view
                            </span>
                        ) : (
                            <>
                                {item.originalPrice && item.originalPrice !== item.price && (
                                    <span className="text-xs text-gray-500 line-through">
                                        {formatCurrency(item.originalPrice)}
                                    </span>
                                )}
                                <span className={`font-semibold ${item.priceSource === 'FLASH_SALE' ? 'text-orange-600' : 'text-gray-900'}`}>
                                    {formatCurrency(item.price)}
                                </span>
                                {item.priceSource === 'FLASH_SALE' && item.flashSale && (
                                    <span className="text-xs bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                                        ⚡ {item.flashSale.discountPercentage}% OFF
                                    </span>
                                )}
                                {item.priceSource && item.priceSource !== "DEFAULT" && item.priceSource !== "FLASH_SALE" && (
                                    <span className="text-xs text-green-600 font-medium">
                                        Bulk pricing applied
                                    </span>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="md:col-span-2 flex items-center justify-between md:justify-center">
                    <span className="md:hidden font-medium text-gray-600">Quantity:</span>
                    <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden shadow-sm">
                        <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity, -1)}
                            className="px-3 py-2 hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            disabled={isLoading || item.quantity <= (item.moq || 1)}
                        >
                            <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-2 min-w-[3rem] text-center font-semibold bg-white border-x border-gray-200">
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin inline" />
                            ) : (
                                item.quantity
                            )}
                        </span>
                        <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity, 1)}
                            className="px-3 py-2 hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            disabled={isLoading}
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="md:col-span-2 flex items-center justify-between md:justify-center">
                    <div className="flex items-center md:block">
                        <span className="md:hidden mr-2 font-medium text-gray-600">
                            Subtotal:
                        </span>
                        <span className="font-bold text-gray-900 text-lg">
                            {!isLoading && !item.isAuthenticated && item.hidePricesForGuests ? "-" : formatCurrency(item.subtotal)}
                        </span>
                    </div>
                    <button
                        onClick={() => onRemove(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg ml-4 disabled:opacity-50 transition-all duration-200"
                        aria-label="Remove item"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <Trash2 className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>
        );
    }
);
CartItem.displayName = "CartItem";

export default function CartPage() {
    const {
        cart,
        loading,
        cartItemsLoading,
        error,
        removeFromCart,
        updateCartItem,
        clearCart,
        applyCoupon,
        removeCoupon,
        coupon,
        couponLoading,
        getCartTotals,
        isAuthenticated,
        mergeProgress,
        hidePricesForGuests,
    } = useCart();
    const [couponCode, setCouponCode] = useState("");
    const [couponError, setCouponError] = useState("");
    const router = useRouter();

    // Use useCallback to memoize handlers
    const handleQuantityChange = useCallback(
        async (cartItemId, currentQuantity, change) => {
            const newQuantity = currentQuantity + change;

            // Find the cart item to get MOQ
            const cartItem = cart.items.find(item => item.id === cartItemId);
            const effectiveMOQ = cartItem?.moq || 1;

            // Don't allow quantity below MOQ
            if (newQuantity < effectiveMOQ) {
                toast.error(`Minimum order quantity is ${effectiveMOQ} units`);
                return;
            }

            if (newQuantity < 1) return;

            try {
                await updateCartItem(cartItemId, newQuantity);
                // Toast notification for success
                // toast.success("Cart updated successfully");
            } catch (err) {
                console.error("Error updating quantity:", err);
                toast.error(err.message || "Failed to update quantity");
            }
        },
        [updateCartItem, cart.items]
    );

    const handleRemoveItem = useCallback(
        async (cartItemId) => {
            try {
                await removeFromCart(cartItemId);
                // toast.success("Item removed from cart");
            } catch (err) {
                console.error("Error removing item:", err);
                toast.error("Failed to remove item");
            }
        },
        [removeFromCart]
    );

    const handleClearCart = useCallback(async () => {
        if (window.confirm("Are you sure you want to clear your cart?")) {
            try {
                await clearCart();
                toast.success("Cart has been cleared");
            } catch (err) {
                console.error("Error clearing cart:", err);
                toast.error("Failed to clear cart");
            }
        }
    }, [clearCart]);

    const handleApplyCoupon = useCallback(
        async (e) => {
            e.preventDefault();

            if (!couponCode.trim()) {
                setCouponError("Please enter a coupon code");
                return;
            }

            setCouponError("");

            try {
                await applyCoupon(couponCode);
                setCouponCode("");
            } catch (err) {
                setCouponError(err.message || "Invalid coupon code");
                toast.error(err.message || "Invalid coupon code");
            }
        },
        [couponCode, applyCoupon]
    );

    const handleRemoveCoupon = useCallback(() => {
        removeCoupon();
        setCouponCode("");
        setCouponError("");
        toast.success("Coupon removed");
    }, [removeCoupon]);

    // Memoize cart totals to prevent re-renders
    // getCartTotals only uses cart and coupon, which are already in dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const totals = useMemo(() => getCartTotals(), [cart, coupon]);

    const handleCheckout = useCallback(() => {
        // If guest and prices hidden, force login
        if (!isAuthenticated && hidePricesForGuests) {
            router.push("/auth?redirect=checkout");
            return;
        }

        // Ensure minimum amount is 1
        const calculatedAmount = totals.subtotal - totals.discount;
        if (calculatedAmount < 1) {
            toast.info("Minimum order amount is ₹1");
            return;
        }

        if (!isAuthenticated) {
            router.push("/auth?redirect=checkout");
        } else {
            router.push("/checkout");
        }
    }, [isAuthenticated, router, totals, hidePricesForGuests]);

    /* ── Loading ── */
    if (loading && (!cart.items || cart.items.length === 0)) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-14 h-14 border-[3px] border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Loading your cart…</p>
                </div>
            </div>
        );
    }

    /* ── Empty cart ── */
    if ((!cart.items || cart.items.length === 0) && !error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 md:p-16 text-center max-w-lg w-full">
                    <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="h-12 w-12 text-orange-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-8">Browse our courses and add them to your cart.</p>
                    <Link href="/courses">
                        <Button className="bg-orange-500 hover:bg-orange-600 text-white px-10 h-12 text-base font-semibold rounded-xl shadow-sm shadow-orange-200">
                            Browse Courses
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/80">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

                {/* ── Page header ── */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Shopping Cart</h1>
                        <span className="bg-orange-100 text-orange-700 text-sm font-bold px-3 py-1 rounded-full">
                            {cart.items?.length || 0} item{(cart.items?.length || 0) !== 1 ? "s" : ""}
                        </span>
                    </div>
                    <div className="w-10 h-0.5 bg-orange-500 rounded-full mt-2" />
                </div>

                {/* ── Guest notice ── */}
                {!isAuthenticated && cart.items?.length > 0 && (
                    <div className="mb-6 bg-orange-50 border border-orange-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <p className="font-semibold text-orange-900">Login to complete your purchase</p>
                            <p className="text-sm text-orange-700 mt-0.5">Your cart is saved as guest. Login to checkout.</p>
                        </div>
                        <div className="flex gap-3 flex-shrink-0">
                            <Link href="/auth?redirect=cart">
                                <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 h-10 rounded-lg border-0 text-sm">
                                    Log In
                                </Button>
                            </Link>
                            <Link href="/auth?redirect=cart">
                                <Button variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50 font-semibold px-5 h-10 rounded-lg text-sm">
                                    Sign Up
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}

                {/* ── Merge progress ── */}
                {mergeProgress && (
                    <div className="mb-6 bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg flex items-center gap-3">
                        <Loader2 className="text-orange-500 h-5 w-5 flex-shrink-0 animate-spin" />
                        <p className="text-orange-700 font-medium text-sm">{mergeProgress}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">

                    {/* ══ LEFT: Cart Items ══ */}
                    <div className="lg:col-span-2 space-y-3">
                        {/* Column headers (desktop) */}
                        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-white rounded-xl border border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <div className="col-span-6">Product</div>
                            <div className="col-span-2 text-center">Price</div>
                            <div className="col-span-2 text-center">Qty</div>
                            <div className="col-span-2 text-center">Total</div>
                        </div>

                        {/* Cart items */}
                        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50 overflow-hidden shadow-sm">
                            {cart.items.map((item) => (
                                <CartItem
                                    key={item.id}
                                    item={{ ...item, isAuthenticated, hidePricesForGuests }}
                                    onUpdateQuantity={handleQuantityChange}
                                    onRemove={handleRemoveItem}
                                    isLoading={cartItemsLoading[item.id]}
                                />
                            ))}
                        </div>

                        {/* Cart actions */}
                        <div className="flex flex-col sm:flex-row justify-between gap-3 bg-white rounded-xl border border-gray-100 px-5 py-4 shadow-sm">
                            <Link href="/courses">
                                <Button variant="outline" className="border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600 h-10 px-5 rounded-lg text-sm font-semibold">
                                    ← Continue Shopping
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                onClick={handleClearCart}
                                className="border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 h-10 px-5 rounded-lg text-sm font-semibold"
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
                                Clear Cart
                            </Button>
                        </div>
                    </div>

                    {/* ══ RIGHT: Order Summary ══ */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">

                            {/* Summary header */}
                            <div className="px-6 py-4 border-b border-gray-100 bg-orange-50/50">
                                <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
                            </div>

                            <div className="p-6 space-y-5">

                                {/* ── Coupon section ── */}
                                {(!hidePricesForGuests || isAuthenticated) && (
                                    <div className="rounded-xl border-2 border-dashed border-orange-200 bg-orange-50/30 p-4">
                                        <p className="text-xs font-bold text-orange-700 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                            🏷 Coupon Code
                                        </p>
                                        {coupon ? (
                                            <div className="flex items-start justify-between gap-2 bg-green-50 border border-green-200 p-3 rounded-lg">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-bold text-green-800 text-sm">{coupon.code}</span>
                                                        <span className="text-[10px] bg-green-200 text-green-800 px-2 py-0.5 rounded-full font-bold">APPLIED</span>
                                                    </div>
                                                    <p className="text-xs text-green-700 font-semibold">
                                                        {coupon.discountType === "PERCENTAGE"
                                                            ? `${coupon.discountValue}% discount`
                                                            : `₹${coupon.discountValue} off`}
                                                    </p>
                                                    {coupon.applicableSubtotal && (
                                                        <p className="text-[11px] text-green-600 mt-0.5">
                                                            On {formatCurrency(coupon.applicableSubtotal)} eligible items
                                                        </p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={handleRemoveCoupon}
                                                    className="text-xs text-red-500 hover:text-red-700 font-semibold flex-shrink-0 hover:bg-red-50 px-2 py-1 rounded-md transition-colors"
                                                    disabled={couponLoading}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                                                    <Input
                                                        type="text"
                                                        placeholder="ENTER CODE"
                                                        value={couponCode}
                                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                        className={`flex-1 h-10 text-sm font-mono font-bold tracking-widest border-2 rounded-lg bg-white placeholder:font-normal placeholder:tracking-normal ${couponError ? "border-red-300" : "border-orange-200 focus-visible:ring-orange-400"
                                                            }`}
                                                    />
                                                    <Button
                                                        type="submit"
                                                        disabled={couponLoading}
                                                        className="bg-orange-500 hover:bg-orange-600 text-white border-0 h-10 px-4 rounded-lg font-bold text-sm"
                                                    >
                                                        {couponLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                                                    </Button>
                                                </form>
                                                {couponError && (
                                                    <div className="mt-2 flex items-start gap-1.5 text-red-600 bg-red-50 p-2 rounded-lg border border-red-100">
                                                        <AlertCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                                                        <p className="text-xs">{couponError}</p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* ── Price breakdown ── */}
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">Subtotal ({cart.items?.length} items)</span>
                                        <span className="font-semibold text-gray-900">
                                            {!isAuthenticated && hidePricesForGuests ? (
                                                <Link href="/auth?redirect=cart" className="text-orange-600 hover:underline text-xs">Login to view</Link>
                                            ) : formatCurrency(totals.subtotal)}
                                        </span>
                                    </div>

                                    {coupon && (
                                        <div className="flex justify-between items-center bg-green-50 px-3 py-2 rounded-lg">
                                            <span className="text-green-700 font-semibold flex items-center gap-1">
                                                🏷 Coupon ({coupon.code})
                                            </span>
                                            <span className="text-green-700 font-bold">-{formatCurrency(totals.discount)}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">Delivery</span>
                                        {totals.shipping > 0 ? (
                                            <span className="font-semibold text-gray-900">{formatCurrency(totals.shipping)}</span>
                                        ) : (
                                            <span className="text-green-600 font-bold flex items-center gap-1">✓ FREE</span>
                                        )}
                                    </div>

                                    {totals.shipping > 0 && cart.freeShippingThreshold > 0 && (
                                        <div className="text-xs text-amber-700 bg-amber-50 border border-amber-100 p-2.5 rounded-lg text-center font-medium">
                                            Add <strong>{formatCurrency(cart.freeShippingThreshold - totals.subtotal)}</strong> more for <span className="text-green-600 font-bold">FREE delivery</span>
                                        </div>
                                    )}
                                </div>

                                {/* ── Grand total ── */}
                                <div className="flex justify-between items-center pt-4 border-t-2 border-gray-100">
                                    <span className="font-bold text-gray-900 text-lg">Grand Total</span>
                                    <span className="font-black text-orange-600 text-2xl">
                                        {!isAuthenticated && hidePricesForGuests ? (
                                            <Link href="/auth?redirect=cart" className="text-orange-500 hover:underline text-sm">Login</Link>
                                        ) : formatCurrency(totals.total)}
                                    </span>
                                </div>

                                {/* ── Checkout button ── */}
                                <Button
                                    className="w-full h-12 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white
                                               text-base font-bold rounded-lg border-0 shadow-lg shadow-orange-500/25
                                               hover:shadow-orange-500/40 transition-all duration-300"
                                    onClick={handleCheckout}
                                >
                                    {!isAuthenticated && hidePricesForGuests ? (
                                        "Login to Checkout →"
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <ShoppingBag className="h-5 w-5" />
                                            Checkout
                                            <span className="bg-orange-600 px-2.5 py-0.5 rounded-lg text-sm font-black">
                                                {formatCurrency(totals.total)}
                                            </span>
                                        </span>
                                    )}
                                </Button>

                                <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Secure checkout · All taxes included
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
