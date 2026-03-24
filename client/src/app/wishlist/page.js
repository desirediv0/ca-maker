"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ClientOnly } from "@/components/client-only";
import { fetchApi } from "@/lib/utils";

import {
    RiDeleteBin6Line as Trash2,
    RiHeartLine as Heart,
    RiShoppingBagLine as ShoppingBag
} from "react-icons/ri";
import { ProductCard } from "@/components/products/ProductCard";


export default function WishlistPage() {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loadingItems, setLoadingItems] = useState(true);
    const [error, setError] = useState("");

    // Redirect if not authenticated
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push("/auth?redirect=/wishlist");
        }
    }, [isAuthenticated, loading, router]);

    // Fetch wishlist items
    useEffect(() => {
        const fetchWishlist = async () => {
            if (!isAuthenticated) return;

            setLoadingItems(true);
            setError("");

            try {
                const response = await fetchApi("/users/wishlist", {
                    credentials: "include",
                });

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

    // Remove item from wishlist
    const removeFromWishlist = async (wishlistItemId) => {
        try {
            await fetchApi(`/users/wishlist/${wishlistItemId}`, {
                method: "DELETE",
                credentials: "include",
            });

            // Remove the item from state
            setWishlistItems((current) =>
                current.filter((item) => item.id !== wishlistItemId)
            );
        } catch (error) {
            console.error("Failed to remove item from wishlist:", error);
            setError("Failed to remove item. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto py-20 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    return (
        <ClientOnly>
            <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6">
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                        My Wishlist
                    </h1>
                    <div className="w-10 h-1 bg-orange-500 rounded-full mt-2" />
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-8 flex items-center">
                        <span className="mr-2">⚠️</span>
                        {error}
                    </div>
                )}

                {loadingItems ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded p-4 shadow-sm border border-gray-100 animate-pulse h-80">
                                <div className="bg-gray-200 rounded h-48 w-full mb-4"></div>
                                <div className="bg-gray-200 h-6 w-3/4 rounded mb-2"></div>
                                <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : wishlistItems.length === 0 ? (
                    <div className="bg-white rounded shadow-sm border border-gray-100 p-12 text-center max-w-2xl mx-auto">
                        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="h-10 w-10 text-orange-500 fill-orange-200" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Your Wishlist is Empty</h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            Looks like you haven&apos;t saved any items yet. Browse our collection and heart your favorites!
                        </p>
                        <Link href="/courses">
                            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded font-semibold transition-colors">
                                <ShoppingBag className="mr-2 h-5 w-5" />
                                Browse Courses
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {wishlistItems.map((item) => (
                            <div key={item.id} className="relative group">
                                <ProductCard product={item.product || item} />

                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        removeFromWishlist(item.id);
                                    }}
                                    className="absolute top-3 right-3 z-30 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-50 shadow-sm border border-red-100 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                                    title="Remove from wishlist"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ClientOnly>
    );
}
