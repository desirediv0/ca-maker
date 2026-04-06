"use client";

import React, { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import {
    RiDeleteBinLine,
    RiAddLine,
    RiSubtractLine,
    RiShoppingBagLine,
    RiAlertLine,
    RiLoader4Line,
    RiArrowLeftLine,
    RiArrowRightLine,
    RiShieldCheckLine,
    RiCoupon3Line,
    RiCheckboxCircleLine,
    RiHome4Line,
    RiArrowRightSLine,
    RiFlashlightLine,
} from "react-icons/ri";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

const getImageUrl = (image) => {
    if (!image) return "/placeholder.jpg";
    if (image.startsWith("http")) return image;
    return `https://desirediv-storage.blr1.digitaloceanspaces.com/${image}`;
};

const CartItem = React.memo(({ item, onUpdateQuantity, onRemove, isLoading }) => {
    const getProductImage = () => {
        if (item.variant?.images && Array.isArray(item.variant.images) && item.variant.images.length > 0) {
            const primaryImage = item.variant.images.find((img) => img.isPrimary);
            const imageUrl = primaryImage?.url || item.variant.images[0]?.url;
            if (imageUrl) return getImageUrl(imageUrl);
        }
        if (item.product?.image) return getImageUrl(item.product.image);
        if (item.image) return getImageUrl(item.image);
        return "/placeholder.jpg";
    };

    const getVariantName = () => {
        if (item.variantName && item.variantName.trim() !== "") return item.variantName;
        if (item.variant?.attributes && item.variant.attributes.length > 0) {
            return item.variant.attributes.map((attr) => `${attr.attribute}: ${attr.value}`).join(", ");
        }
        let color = item.variant?.color?.name || item.color?.name;
        let size = item.variant?.size?.name || item.size?.name;
        if (color && size) return `${color} · ${size}`;
        if (color) return color;
        if (size) return size;
        return null;
    };

    const variantName = getVariantName();
    const productImage = getProductImage();
    const productName = item.productName || item.product?.name || "Product";
    const productSlug = item.productSlug || item.product?.slug || "#";

    return (
        <div className="p-4 md:p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center transition-colors duration-200">
            <div className="md:col-span-6 flex items-center">
                <div
                    className="relative h-24 w-24 md:h-28 md:w-28 rounded-xl overflow-hidden mr-4 flex-shrink-0 group"
                    style={{ background: "#FAFAFA", border: "1px solid #F0F0F0" }}
                >
                    <Image src={productImage} alt={productName} fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="112px" />
                </div>
                <div className="flex-1 min-w-0">
                    <Link href={`/courses/${productSlug}`}
                        className="font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 text-sm">
                        {productName}
                    </Link>
                    {variantName && (
                        <div className="text-xs text-gray-400 mt-1.5 flex items-center gap-2">
                            {(item.variant?.color?.hexCode || item.color?.hexCode) && (
                                <div className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: item.variant?.color?.hexCode || item.color?.hexCode, border: "1px solid #E5E7EB" }} />
                            )}
                            <span className="truncate">{variantName}</span>
                        </div>
                    )}
                    {item.moq && item.moq > 1 && (
                        <div className="text-[11px] text-blue-600 mt-1 font-semibold">Min. Order: {item.moq} units</div>
                    )}
                    {item.pricingSlabs && item.pricingSlabs.length > 0 && (
                        <div className="text-[11px] text-gray-400 mt-0.5">Bulk pricing available</div>
                    )}
                </div>
            </div>

            <div className="md:col-span-2 flex items-center justify-between md:justify-center flex-col gap-1">
                <span className="md:hidden text-[10px] font-bold text-gray-400 uppercase tracking-wider">Price</span>
                <div className="flex flex-col items-end md:items-center">
                    {!isLoading && !item.isAuthenticated && item.hidePricesForGuests ? (
                        <span className="text-xs font-semibold text-amber-600">Login to view</span>
                    ) : (
                        <>
                            {item.originalPrice && item.originalPrice !== item.price && (
                                <span className="text-xs text-gray-400 line-through">{formatCurrency(item.originalPrice)}</span>
                            )}
                            <span className={`font-bold text-sm ${item.priceSource === "FLASH_SALE" ? "text-blue-600" : "text-gray-900"}`}>
                                {formatCurrency(item.price)}
                            </span>
                            {item.priceSource === "FLASH_SALE" && item.flashSale && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md inline-flex items-center gap-1 mt-0.5"
                                    style={{ background: "rgba(37,99,235,0.06)", color: "#2563EB", border: "1px solid rgba(37,99,235,0.1)" }}>
                                    <RiFlashlightLine className="w-3 h-3" /> {item.flashSale.discountPercentage}% OFF
                                </span>
                            )}
                            {item.priceSource && item.priceSource !== "DEFAULT" && item.priceSource !== "FLASH_SALE" && (
                                <span className="text-[10px] text-emerald-600 font-semibold">Bulk pricing</span>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className="md:col-span-2 flex items-center justify-between md:justify-center">
                <span className="md:hidden text-[10px] font-bold text-gray-400 uppercase tracking-wider">Qty</span>
                <div className="flex items-center rounded-xl overflow-hidden" style={{ border: "1px solid #EBEBEB" }}>
                    <button onClick={() => onUpdateQuantity(item.id, item.quantity, -1)}
                        className="px-3 py-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        disabled={isLoading || item.quantity <= (item.moq || 1)}>
                        <RiSubtractLine className="h-3.5 w-3.5" />
                    </button>
                    <span className="px-4 py-2 min-w-[3rem] text-center font-bold text-gray-900 text-sm"
                        style={{ borderLeft: "1px solid #EBEBEB", borderRight: "1px solid #EBEBEB" }}>
                        {isLoading ? <RiLoader4Line className="h-4 w-4 animate-spin inline" /> : item.quantity}
                    </span>
                    <button onClick={() => onUpdateQuantity(item.id, item.quantity, 1)}
                        className="px-3 py-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        disabled={isLoading}>
                        <RiAddLine className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>

            <div className="md:col-span-2 flex items-center justify-between md:justify-center">
                <div className="flex items-center md:block">
                    <span className="md:hidden mr-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total</span>
                    <span className="font-extrabold text-gray-900">
                        {!isLoading && !item.isAuthenticated && item.hidePricesForGuests ? "-" : formatCurrency(item.subtotal)}
                    </span>
                </div>
                <button onClick={() => onRemove(item.id)}
                    className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg ml-3 disabled:opacity-30 transition-all duration-200"
                    aria-label="Remove item" disabled={isLoading}>
                    {isLoading ? <RiLoader4Line className="h-4 w-4 animate-spin" /> : <RiDeleteBinLine className="h-4 w-4" />}
                </button>
            </div>
        </div>
    );
});
CartItem.displayName = "CartItem";

export default function CartPage() {
    const {
        cart, loading, cartItemsLoading, error, removeFromCart, updateCartItem,
        clearCart, applyCoupon, removeCoupon, coupon, couponLoading, getCartTotals,
        isAuthenticated, mergeProgress, hidePricesForGuests,
    } = useCart();
    const [couponCode, setCouponCode] = useState("");
    const [couponError, setCouponError] = useState("");
    const router = useRouter();

    const handleQuantityChange = useCallback(async (cartItemId, currentQuantity, change) => {
        const newQuantity = currentQuantity + change;
        const cartItem = cart.items.find((item) => item.id === cartItemId);
        const effectiveMOQ = cartItem?.moq || 1;
        if (newQuantity < effectiveMOQ) { toast.error(`Minimum order quantity is ${effectiveMOQ} units`); return; }
        if (newQuantity < 1) return;
        try { await updateCartItem(cartItemId, newQuantity); } catch (err) { toast.error(err.message || "Failed to update quantity"); }
    }, [updateCartItem, cart.items]);

    const handleRemoveItem = useCallback(async (cartItemId) => {
        try { await removeFromCart(cartItemId); } catch (err) { toast.error("Failed to remove item"); }
    }, [removeFromCart]);

    const handleClearCart = useCallback(async () => {
        if (window.confirm("Are you sure you want to clear your cart?")) {
            try { await clearCart(); toast.success("Cart has been cleared"); } catch (err) { toast.error("Failed to clear cart"); }
        }
    }, [clearCart]);

    const handleApplyCoupon = useCallback(async (e) => {
        e.preventDefault();
        if (!couponCode.trim()) { setCouponError("Please enter a coupon code"); return; }
        setCouponError("");
        try { await applyCoupon(couponCode); setCouponCode(""); } catch (err) { setCouponError(err.message || "Invalid coupon code"); toast.error(err.message || "Invalid coupon code"); }
    }, [couponCode, applyCoupon]);

    const handleRemoveCoupon = useCallback(() => {
        removeCoupon(); setCouponCode(""); setCouponError(""); toast.success("Coupon removed");
    }, [removeCoupon]);

    const totals = useMemo(() => getCartTotals(), [cart, coupon]);

    const handleCheckout = useCallback(() => {
        if (!isAuthenticated && hidePricesForGuests) { router.push("/auth?redirect=checkout"); return; }
        const calculatedAmount = totals.subtotal - totals.discount;
        if (calculatedAmount < 1) { toast.info("Minimum order amount is ₹1"); return; }
        if (!isAuthenticated) { router.push("/auth?redirect=checkout"); } else { router.push("/checkout"); }
    }, [isAuthenticated, router, totals, hidePricesForGuests]);

    /* Loading */
    if (loading && (!cart.items || cart.items.length === 0)) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-[3px] border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400 text-sm font-medium">Loading your cart…</p>
                </div>
            </div>
        );
    }

    /* Empty */
    if ((!cart.items || cart.items.length === 0) && !error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center px-4">
                <div className="rounded-2xl p-10 md:p-16 text-center max-w-lg w-full"
                    style={{ border: "1px solid #F0F0F0", boxShadow: "0 4px 24px rgba(0,0,0,0.03)" }}>
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                        style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.1)" }}>
                        <RiShoppingBagLine className="h-10 w-10 text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">Your cart is empty</h2>
                    <p className="text-gray-400 text-sm mb-8">Browse our courses and add them to your cart.</p>
                    <Link href="/courses">
                        <button className="group px-8 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:scale-[1.03] inline-flex items-center gap-2"
                            style={{ background: "linear-gradient(135deg, #1E40AF, #2563EB, #3B82F6)", boxShadow: "0 4px 16px rgba(37,99,235,0.25)" }}>
                            Browse Courses <RiArrowRightLine className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

                {/* Header */}
                <div className="mb-8">
                    <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                        <Link href="/" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                            <RiHome4Line className="w-3 h-3" /> Home
                        </Link>
                        <RiArrowRightSLine className="w-3 h-3" />
                        <span className="text-gray-700 font-medium">Cart</span>
                    </nav>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Shopping Cart</h1>
                        <span className="text-xs font-bold px-3 py-1.5 rounded-lg"
                            style={{ background: "rgba(37,99,235,0.06)", color: "#2563EB", border: "1px solid rgba(37,99,235,0.1)" }}>
                            {cart.items?.length || 0} item{(cart.items?.length || 0) !== 1 ? "s" : ""}
                        </span>
                    </div>
                </div>

                {/* Guest notice */}
                {!isAuthenticated && cart.items?.length > 0 && (
                    <div className="mb-6 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        style={{ background: "linear-gradient(170deg, #F8FAFF, #EFF6FF)", border: "1px solid rgba(59,130,246,0.06)" }}>
                        <div>
                            <p className="font-bold text-gray-900 text-sm">Login to complete your purchase</p>
                            <p className="text-xs text-gray-400 mt-0.5">Your cart is saved as guest. Login to checkout.</p>
                        </div>
                        <div className="flex gap-2.5 flex-shrink-0">
                            <Link href="/auth?redirect=cart">
                                <button className="px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all duration-200 hover:scale-[1.02]"
                                    style={{ background: "linear-gradient(135deg, #1E40AF, #2563EB)", boxShadow: "0 2px 8px rgba(37,99,235,0.2)" }}>
                                    Log In
                                </button>
                            </Link>
                            <Link href="/auth?tab=register&redirect=cart">
                                <button className="px-5 py-2.5 rounded-xl text-xs font-bold text-blue-600 transition-all duration-200 hover:bg-blue-50"
                                    style={{ border: "1px solid rgba(37,99,235,0.2)" }}>
                                    Sign Up
                                </button>
                            </Link>
                        </div>
                    </div>
                )}

                {/* Merge progress */}
                {mergeProgress && (
                    <div className="mb-6 rounded-xl p-4 flex items-center gap-3"
                        style={{ background: "rgba(37,99,235,0.04)", border: "1px solid rgba(37,99,235,0.1)" }}>
                        <RiLoader4Line className="text-blue-500 h-5 w-5 flex-shrink-0 animate-spin" />
                        <p className="text-blue-700 font-medium text-sm">{mergeProgress}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">

                    {/* LEFT */}
                    <div className="lg:col-span-2 space-y-3">
                        {/* Headers */}
                        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 rounded-xl"
                            style={{ background: "#FAFAFA", border: "1px solid #F0F0F0" }}>
                            {["Product", "Price", "Qty", "Total"].map((h, i) => (
                                <div key={h} className={`${i === 0 ? "col-span-6" : "col-span-2 text-center"} text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]`}>
                                    {h}
                                </div>
                            ))}
                        </div>

                        {/* Items */}
                        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #F0F0F0" }}>
                            {cart.items.map((item, i) => (
                                <div key={item.id} style={{ borderBottom: i < cart.items.length - 1 ? "1px solid #F8F8F8" : "none" }}>
                                    <CartItem
                                        item={{ ...item, isAuthenticated, hidePricesForGuests }}
                                        onUpdateQuantity={handleQuantityChange}
                                        onRemove={handleRemoveItem}
                                        isLoading={cartItemsLoading[item.id]}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row justify-between gap-3 rounded-xl px-5 py-4"
                            style={{ border: "1px solid #F0F0F0" }}>
                            <Link href="/courses">
                                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 transition-all duration-200 hover:text-blue-600 hover:bg-blue-50"
                                    style={{ border: "1px solid #EBEBEB" }}>
                                    <RiArrowLeftLine className="w-4 h-4" /> Continue Shopping
                                </button>
                            </Link>
                            <button onClick={handleClearCart} disabled={loading}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-red-400 transition-all duration-200 hover:text-red-600 hover:bg-red-50 disabled:opacity-40"
                                style={{ border: "1px solid rgba(239,68,68,0.15)" }}>
                                {loading ? <RiLoader4Line className="h-4 w-4 animate-spin" /> : <RiDeleteBinLine className="h-4 w-4" />}
                                Clear Cart
                            </button>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="lg:col-span-1">
                        <div className="rounded-2xl overflow-hidden sticky top-24"
                            style={{ border: "1px solid #F0F0F0", boxShadow: "0 4px 24px rgba(0,0,0,0.03)" }}>

                            <div className="px-6 py-4" style={{ background: "linear-gradient(170deg, #F8FAFF, #EFF6FF)", borderBottom: "1px solid rgba(59,130,246,0.06)" }}>
                                <h2 className="text-base font-extrabold text-gray-900 tracking-tight">Order Summary</h2>
                            </div>

                            <div className="p-6 space-y-5">
                                {/* Coupon */}
                                {(!hidePricesForGuests || isAuthenticated) && (
                                    <div className="rounded-xl p-4" style={{ background: "rgba(37,99,235,0.03)", border: "1px dashed rgba(37,99,235,0.15)" }}>
                                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-3 flex items-center gap-1.5">
                                            <RiCoupon3Line className="w-3.5 h-3.5" /> Coupon Code
                                        </p>
                                        {coupon ? (
                                            <div className="rounded-lg p-3" style={{ background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.12)" }}>
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-bold text-emerald-800 text-sm">{coupon.code}</span>
                                                            <span className="text-[9px] px-1.5 py-0.5 rounded font-bold text-emerald-700"
                                                                style={{ background: "rgba(16,185,129,0.1)" }}>APPLIED</span>
                                                        </div>
                                                        <p className="text-xs text-emerald-600 font-semibold">
                                                            {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}% discount` : `₹${coupon.discountValue} off`}
                                                        </p>
                                                        {coupon.applicableSubtotal && (
                                                            <p className="text-[11px] text-emerald-500 mt-0.5">On {formatCurrency(coupon.applicableSubtotal)} eligible</p>
                                                        )}
                                                    </div>
                                                    <button onClick={handleRemoveCoupon} disabled={couponLoading}
                                                        className="text-xs text-red-400 hover:text-red-600 font-semibold px-2 py-1 rounded-lg hover:bg-red-50 transition-colors">
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex gap-2">
                                                    <input type="text" placeholder="ENTER CODE" value={couponCode}
                                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                        className="flex-1 h-10 px-3 text-sm font-mono font-bold tracking-widest rounded-xl placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-400"
                                                        style={{ border: couponError ? "1px solid rgba(239,68,68,0.3)" : "1px solid #EBEBEB", background: "#FAFAFA" }} />
                                                    <button type="button" onClick={handleApplyCoupon} disabled={couponLoading}
                                                        className="h-10 px-4 rounded-xl text-xs font-bold text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50"
                                                        style={{ background: "linear-gradient(135deg, #1E40AF, #2563EB)" }}>
                                                        {couponLoading ? <RiLoader4Line className="h-4 w-4 animate-spin" /> : "Apply"}
                                                    </button>
                                                </div>
                                                {couponError && (
                                                    <div className="mt-2 flex items-start gap-1.5 p-2 rounded-lg text-xs"
                                                        style={{ background: "rgba(239,68,68,0.04)", color: "#DC2626", border: "1px solid rgba(239,68,68,0.1)" }}>
                                                        <RiAlertLine className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                                                        <p>{couponError}</p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* Price breakdown */}
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Subtotal ({cart.items?.length} items)</span>
                                        <span className="font-bold text-gray-900">
                                            {!isAuthenticated && hidePricesForGuests ? (
                                                <Link href="/auth?redirect=cart" className="text-blue-600 hover:underline text-xs">Login to view</Link>
                                            ) : formatCurrency(totals.subtotal)}
                                        </span>
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
                                            <span className="font-bold text-gray-900">{formatCurrency(totals.shipping)}</span>
                                        ) : (
                                            <span className="text-emerald-600 font-bold flex items-center gap-1 text-xs">
                                                <RiCheckboxCircleLine className="w-3.5 h-3.5" /> FREE
                                            </span>
                                        )}
                                    </div>

                                    {totals.shipping > 0 && cart.freeShippingThreshold > 0 && (
                                        <div className="text-xs p-2.5 rounded-lg text-center font-medium"
                                            style={{ background: "rgba(37,99,235,0.04)", color: "#1E40AF", border: "1px solid rgba(37,99,235,0.08)" }}>
                                            Add <strong>{formatCurrency(cart.freeShippingThreshold - totals.subtotal)}</strong> more for{" "}
                                            <span className="text-emerald-600 font-bold">FREE delivery</span>
                                        </div>
                                    )}
                                </div>

                                {/* Grand total */}
                                <div className="flex justify-between items-center pt-4" style={{ borderTop: "2px solid #F0F0F0" }}>
                                    <span className="font-bold text-gray-900">Grand Total</span>
                                    <span className="font-extrabold text-blue-600 text-2xl tracking-tight">
                                        {!isAuthenticated && hidePricesForGuests ? (
                                            <Link href="/auth?redirect=cart" className="text-blue-500 hover:underline text-sm">Login</Link>
                                        ) : formatCurrency(totals.total)}
                                    </span>
                                </div>

                                {/* Checkout */}
                                <button
                                    className="group w-full h-12 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2
                             transition-all duration-300 hover:scale-[1.01]"
                                    style={{
                                        background: "linear-gradient(135deg, #1E40AF, #2563EB, #3B82F6)",
                                        boxShadow: "0 4px 16px rgba(37,99,235,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
                                    }}
                                    onClick={handleCheckout}
                                >
                                    {!isAuthenticated && hidePricesForGuests ? (
                                        <>Login to Checkout <RiArrowRightLine className="w-4 h-4" /></>
                                    ) : (
                                        <>
                                            <RiShoppingBagLine className="h-4 w-4" />
                                            Checkout
                                            <span className="bg-white/15 px-2.5 py-0.5 rounded-lg text-xs font-extrabold">
                                                {formatCurrency(totals.total)}
                                            </span>
                                        </>
                                    )}
                                </button>

                                <p className="text-center text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
                                    <RiShieldCheckLine className="w-3.5 h-3.5 text-emerald-500/60" />
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