"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ClientOnly } from "@/components/client-only";
import { fetchApi } from "@/lib/utils";
import {
    RiDeleteBin6Line as Trash2,
    RiHeartLine as Heart,
    RiShoppingBagLine as ShoppingBag,
    RiArrowRightLine,
    RiArrowRightSLine,
    RiHome4Line,
    RiAlertLine,
} from "react-icons/ri";
import { ProductCard } from "@/components/products/ProductCard";

export default function WishlistPage() {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loadingItems, setLoadingItems] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!loading && !isAuthenticated) router.push("/auth?redirect=/wishlist");
    }, [isAuthenticated, loading, router]);

    useEffect(() => {
        const fetchWishlist = async () => {
            if (!isAuthenticated) return;
            setLoadingItems(true);
            setError("");
            try {
                const response = await fetchApi("/users/wishlist", { credentials: "include" });
                setWishlistItems(response.data.wishlistItems || []);
            } catch (error) {
                console.error("Failed to fetch wishlist:", error);
                setError("Failed to load your wishlist. Please try again later.");
            } finally {
                setLoadingItems(false);
            }
        };
        fetchWishlist();
    }, [isAuthenticated]);

    const removeFromWishlist = async (wishlistItemId) => {
        try {
            await fetchApi(`/users/wishlist/${wishlistItemId}`, { method: "DELETE", credentials: "include" });
            setWishlistItems((current) => current.filter((item) => item.id !== wishlistItemId));
        } catch (error) {
            console.error("Failed to remove item from wishlist:", error);
            setError("Failed to remove item. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-12 h-12 border-[3px] border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <ClientOnly>
            <div className="min-h-screen bg-white">
                <div className="max-w-6xl mx-auto py-10 md:py-12 px-4 sm:px-6">

                    {/* Header */}
                    <div className="mb-8">
                        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                            <Link href="/" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                                <RiHome4Line className="w-3 h-3" /> Home
                            </Link>
                            <RiArrowRightSLine className="w-3 h-3" />
                            <span className="text-gray-700 font-medium">Wishlist</span>
                        </nav>

                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                                My Wishlist
                            </h1>
                            {!loadingItems && wishlistItems.length > 0 && (
                                <span
                                    className="text-xs font-bold px-3 py-1.5 rounded-lg"
                                    style={{
                                        background: "rgba(37, 99, 235, 0.06)",
                                        color: "#2563EB",
                                        border: "1px solid rgba(37, 99, 235, 0.1)",
                                    }}
                                >
                                    {wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div
                            className="mb-8 rounded-xl p-4 flex items-start gap-3"
                            style={{
                                background: "rgba(239, 68, 68, 0.04)",
                                border: "1px solid rgba(239, 68, 68, 0.12)",
                            }}
                        >
                            <RiAlertLine className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Loading */}
                    {loadingItems ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div
                                    key={i}
                                    className="rounded-2xl overflow-hidden animate-pulse"
                                    style={{ border: "1px solid #F0F0F0" }}
                                >
                                    <div className="h-48 w-full bg-gray-50" />
                                    <div className="p-5 space-y-3">
                                        <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
                                        <div className="h-3 bg-gray-50 rounded w-1/2" />
                                        <div className="h-9 bg-blue-50 rounded-xl w-full mt-2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : wishlistItems.length === 0 ? (
                        /* Empty */
                        <div
                            className="rounded-2xl p-12 text-center max-w-lg mx-auto"
                            style={{
                                border: "1px solid #F0F0F0",
                                boxShadow: "0 4px 24px rgba(0, 0, 0, 0.03)",
                            }}
                        >
                            <div
                                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                                style={{
                                    background: "rgba(37, 99, 235, 0.06)",
                                    border: "1px solid rgba(37, 99, 235, 0.1)",
                                }}
                            >
                                <Heart className="h-10 w-10 text-blue-400" />
                            </div>
                            <h2 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">
                                Your Wishlist is Empty
                            </h2>
                            <p className="text-gray-400 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
                                Looks like you haven&apos;t saved any items yet. Browse our courses
                                and heart your favorites!
                            </p>
                            <Link href="/courses">
                                <button
                                    className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold text-white
                             transition-all duration-300 hover:scale-[1.03]"
                                    style={{
                                        background: "linear-gradient(135deg, #1E40AF, #2563EB, #3B82F6)",
                                        boxShadow:
                                            "0 4px 16px rgba(37, 99, 235, 0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
                                    }}
                                >
                                    <ShoppingBag className="h-4 w-4" />
                                    Browse Courses
                                    <RiArrowRightLine className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                        </div>
                    ) : (
                        /* Grid */
                        <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-4 gap-5">
                            {wishlistItems.map((item) => (
                                <div key={item.id} className="relative group">
                                    <ProductCard product={item.product || item} />
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            removeFromWishlist(item.id);
                                        }}
                                        className="absolute top-3 right-3 z-30 p-2 bg-white/90 backdrop-blur-sm rounded-xl
                               text-gray-400 hover:text-red-500 hover:bg-red-50
                               opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105"
                                        style={{
                                            border: "1px solid rgba(0, 0, 0, 0.06)",
                                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                                        }}
                                        title="Remove from wishlist"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ClientOnly>
    );
}