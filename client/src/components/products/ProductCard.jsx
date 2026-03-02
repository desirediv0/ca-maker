"use client";

import Link from "next/link";
import { Heart, Loader2, ShoppingBag } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { fetchApi, formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

/* ─── Helpers ─────────────────────────────────────────────── */
const stripHtml = (html, maxLen = 120) => {
  if (!html) return "";
  const plain = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
  return maxLen && plain.length > maxLen
    ? plain.slice(0, maxLen).trimEnd() + "…"
    : plain;
};

const getImageUrl = (image) => {
  if (!image) return "/placeholder.jpg";
  if (image.startsWith("http")) return image;
  return `https://desirediv-storage.blr1.digitaloceanspaces.com/${image}`;
};

const calculateDiscountPercentage = (regularPrice, salePrice) => {
  if (!regularPrice || !salePrice || regularPrice <= salePrice) return 0;
  return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
};

export const ProductCard = ({ product, viewMode = "grid" }) => {
  const { isAuthenticated }  = useAuth();
  const { addToCart }        = useCart();
  const router               = useRouter();
  const [isHovered,           setIsHovered]           = useState(false);
  const [isAddingToCart,      setIsAddingToCart]      = useState(false);
  const [wishlistItems,       setWishlistItems]       = useState({});
  const [isAddingToWishlist,  setIsAddingToWishlist]  = useState({});
  const [currentImageIndex,   setCurrentImageIndex]   = useState(0);
  const [priceVisibilitySettings, setPriceVisibilitySettings] = useState(null);

  /* ── 1. Fetch wishlist status (unchanged) ── */
  useEffect(() => {
    const fetchWishlistStatus = async () => {
      if (!isAuthenticated || typeof window === "undefined") return;
      try {
        const response = await fetchApi("/users/wishlist", { credentials: "include" });
        const items =
          response.data?.wishlistItems?.reduce((acc, item) => {
            acc[item.productId] = true;
            return acc;
          }, {}) || {};
        setWishlistItems(items);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };
    fetchWishlistStatus();
  }, [isAuthenticated]);

  /* ── 2. Fetch price visibility settings (unchanged) ── */
  useEffect(() => {
    const fetchPriceVisibilitySettings = async () => {
      try {
        const response = await fetchApi("/public/price-visibility-settings");
        if (response.success) setPriceVisibilitySettings(response.data);
      } catch (error) {
        console.error("Error fetching price visibility settings:", error);
        setPriceVisibilitySettings({ hidePricesForGuests: false });
      }
    };
    fetchPriceVisibilitySettings();
  }, []);

  /* ── 3. Wishlist toggle (unchanged) ── */
  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push(`/auth?redirect=/products/${product.slug}`);
      return;
    }
    setIsAddingToWishlist((prev) => ({ ...prev, [product.id]: true }));
    try {
      if (wishlistItems[product.id]) {
        const wishlistResponse = await fetchApi("/users/wishlist", { credentials: "include" });
        const wishlistItem = wishlistResponse.data?.wishlistItems?.find(
          (item) => item.productId === product.id
        );
        if (wishlistItem) {
          await fetchApi(`/users/wishlist/${wishlistItem.id}`, { method: "DELETE", credentials: "include" });
          setWishlistItems((prev) => { const n = { ...prev }; delete n[product.id]; return n; });
        }
      } else {
        await fetchApi("/users/wishlist", { method: "POST", credentials: "include", body: JSON.stringify({ productId: product.id }) });
        setWishlistItems((prev) => ({ ...prev, [product.id]: true }));
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("Failed to update wishlist");
    } finally {
      setIsAddingToWishlist((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  /* ── 4. Image handling ──
     Priority: product.images → product.image → variant images (fallback)
  ── */
  const getAllProductImages = useMemo(() => {
    const images = [];
    const imageUrls = new Set();

    const addUrl = (raw) => {
      const url = raw?.url || raw;
      if (typeof url === "string" && url) {
        const full = getImageUrl(url);
        if (!imageUrls.has(full)) { imageUrls.add(full); images.push(full); }
      }
    };

    // 1. Product-level gallery
    if (Array.isArray(product.images)) product.images.forEach(addUrl);

    // 2. Single product.image
    if (product.image) addUrl(product.image);

    // 3. Variant images only if product has no own images
    if (images.length === 0 && Array.isArray(product.variants)) {
      product.variants.forEach((variant) => {
        if (Array.isArray(variant.images)) variant.images.forEach(addUrl);
      });
    }

    if (images.length === 0) images.push("/placeholder.jpg");
    return images;
  }, [product]);

  useEffect(() => {
    if (!isHovered || getAllProductImages.length <= 1) { setCurrentImageIndex(0); return; }
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % getAllProductImages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isHovered, getAllProductImages.length]);

  /* ── 5. Price logic (unchanged) ── */
  const parsePrice = (value) => {
    if (value === null || value === undefined) return null;
    if (value === 0) return 0;
    const parsed = typeof value === "string" ? parseFloat(value) : value;
    return isNaN(parsed) ? null : parsed;
  };

  const basePriceField    = parsePrice(product.basePrice);
  const regularPriceField = parsePrice(product.regularPrice);
  const priceField        = parsePrice(product.price);
  const salePriceField    = parsePrice(product.salePrice);

  const hasFlashSale            = product.flashSale?.isActive === true;
  const flashSalePrice          = hasFlashSale ? parsePrice(product.flashSale.flashSalePrice) : null;
  const flashSaleDiscountPercent = hasFlashSale ? product.flashSale.discountPercentage : 0;

  let hasSale = false;
  if (product.hasSale !== undefined && product.hasSale !== null) {
    hasSale = Boolean(product.hasSale);
  } else {
    if (salePriceField !== null && salePriceField > 0) {
      if (regularPriceField && salePriceField < regularPriceField) hasSale = true;
      else if (priceField && salePriceField < priceField) hasSale = true;
      else if (basePriceField && regularPriceField && salePriceField < regularPriceField) hasSale = true;
    }
  }

  let originalPrice = null;
  let currentPrice  = 0;

  if (basePriceField !== null && regularPriceField !== null) {
    if (hasSale && basePriceField < regularPriceField) { currentPrice = basePriceField; originalPrice = regularPriceField; }
    else { currentPrice = basePriceField; }
  } else if (salePriceField !== null && (priceField !== null || basePriceField !== null)) {
    if (hasSale && salePriceField) {
      currentPrice = salePriceField;
      if (priceField && priceField > salePriceField) originalPrice = priceField;
      else if (basePriceField && basePriceField > salePriceField) originalPrice = basePriceField;
      else if (regularPriceField && regularPriceField > salePriceField) originalPrice = regularPriceField;
    } else {
      currentPrice = priceField || basePriceField || regularPriceField || 0;
    }
  } else {
    if (hasSale && salePriceField) {
      currentPrice = salePriceField;
      originalPrice = regularPriceField || priceField || basePriceField || null;
    } else {
      currentPrice = basePriceField || regularPriceField || priceField || salePriceField || 0;
    }
  }

  if (currentPrice === null || currentPrice === undefined || isNaN(currentPrice)) currentPrice = 0;

  let displayPrice     = currentPrice;
  let showFlashSaleBadge = false;
  if (hasFlashSale && flashSalePrice !== null) {
    if (!originalPrice) originalPrice = currentPrice;
    displayPrice       = flashSalePrice;
    showFlashSaleBadge = true;
  }

  const discountPercent = showFlashSaleBadge
    ? flashSaleDiscountPercent
    : hasSale && originalPrice && currentPrice
      ? calculateDiscountPercentage(originalPrice, currentPrice)
      : 0;

  const showPrice = !priceVisibilitySettings?.hidePricesForGuests || isAuthenticated;

  /* ── 6. Add to cart (unchanged) ── */
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!showPrice) { toast.error("Please login to purchase items"); return; }
    setIsAddingToCart(true);
    try {
      const variantId = product.variants?.[0]?.id;
      if (!variantId) {
        toast.error("Select options on product page");
        router.push(`/products/${product.slug}`);
        return;
      }
      await addToCart(variantId, 1);
      toast.success("Added to bag");
    } catch (error) {
      console.error("Add to cart error:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  /* ── Shared sub-components ─────────────────────────────── */
  const WishlistBtn = () => (
    <button
      onClick={handleAddToWishlist}
      disabled={isAddingToWishlist[product.id]}
      className="p-2 rounded-full bg-white shadow-sm text-gray-400 hover:text-red-500
                 opacity-0 group-hover:opacity-100 transition-all duration-200 z-20"
    >
      {isAddingToWishlist[product.id] ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Heart
          className={`h-4 w-4 ${wishlistItems[product.id] ? "fill-red-500 text-red-500" : ""}`}
        />
      )}
    </button>
  );

  const PriceBlock = ({ size = "sm" }) => (
    <div className="min-w-0 flex-1">
      {showPrice && displayPrice > 0 ? (
        <>
          <div className={`font-bold leading-none ${size === "lg" ? "text-xl" : "text-base"} text-orange-600`}>
            {formatCurrency(displayPrice)}
          </div>
          {(hasSale || showFlashSaleBadge) && originalPrice && (
            <div className="text-xs text-gray-400 line-through mt-0.5">
              {formatCurrency(originalPrice)}
            </div>
          )}
        </>
      ) : !showPrice ? (
        <Link href="/auth?redirect=products" className="text-xs text-orange-600 hover:underline font-semibold">
          Login to view price
        </Link>
      ) : null}
    </div>
  );

  const CartBtn = ({ full = false }) => (
    <Button
      size="sm"
      onClick={handleAddToCart}
      disabled={!showPrice || isAddingToCart}
      className={`h-8 text-xs rounded-md font-semibold bg-orange-500 hover:bg-orange-600
                  text-white border-0 flex-shrink-0 ${full ? "w-full justify-center" : "px-3"}`}
    >
      {isAddingToCart ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <ShoppingBag className="h-4 w-4" />
          <span className="ml-1.5">{full ? "Add to Cart" : "Add"}</span>
        </>
      )}
    </Button>
  );

  /* ── LIST VIEW ───────────────────────────────────────────── */
  if (viewMode === "list") {
    return (
      <div
        className="group relative bg-white rounded-[10px] overflow-hidden border border-gray-100
                   flex flex-row transition-all duration-300"
        style={{
          boxShadow: isHovered
            ? "0 8px 32px rgba(249,115,22,0.12), 0 2px 8px rgba(0,0,0,0.06)"
            : "0 2px 8px rgba(0,0,0,0.06)",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image */}
        <Link
          href={`/products/${product.slug}`}
          className="relative w-40 sm:w-52 md:w-60 flex-shrink-0 overflow-hidden bg-orange-50"
        >
          <Image
            src={getAllProductImages[currentImageIndex] || "/placeholder.jpg"}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-500 ${isHovered ? "scale-105" : "scale-100"}`}
            sizes="240px"
          />
          {(showFlashSaleBadge || hasSale) && discountPercent > 0 && (
            <div className="absolute top-3 left-3 z-20 px-2.5 py-1 text-white text-xs font-bold rounded-full bg-orange-500">
              {discountPercent}% OFF
            </div>
          )}
        </Link>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4 md:p-5 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <Link href={`/products/${product.slug}`}>
              <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-snug
                             line-clamp-2 hover:text-orange-600 transition-colors">
                {product.name}
              </h3>
            </Link>
            <WishlistBtn />
          </div>

          {product.avgRating > 0 && (
            <div className="flex items-center gap-1 text-xs mb-2">
              <span className="text-yellow-500">★</span>
              <span className="font-semibold text-gray-800">{product.avgRating}</span>
              {product.reviewCount > 0 && (
                <span className="text-gray-400">({product.reviewCount})</span>
              )}
            </div>
          )}

          {stripHtml(product.description) && (
            <p className="text-xs text-gray-500 line-clamp-2 mb-3 hidden sm:block">
              {stripHtml(product.description)}
            </p>
          )}

          <div className="mt-auto flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
            <PriceBlock size="lg" />
            <CartBtn />
          </div>
        </div>
      </div>
    );
  }

  /* ── GRID VIEW (default) ─────────────────────────────────── */
  return (
    <div
      className="group relative bg-white rounded-[10px] overflow-hidden transition-all duration-300 border border-gray-100 h-full flex flex-col"
      style={{
        boxShadow: isHovered
          ? "0 12px 40px rgba(249,115,22,0.14), 0 4px 12px rgba(0,0,0,0.06)"
          : "0 2px 8px rgba(0,0,0,0.06)",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Product image ── */}
      <Link
        href={`/products/${product.slug}`}
        className="block relative aspect-square overflow-hidden bg-orange-50/60 flex-shrink-0"
      >
        <div className="absolute top-3 right-3 z-20">
          <WishlistBtn />
        </div>

        {(showFlashSaleBadge || hasSale) && discountPercent > 0 && (
          <div className="absolute top-3 left-3 z-20 px-2.5 py-1 text-white text-xs font-bold rounded-full bg-orange-500">
            {discountPercent}% OFF
          </div>
        )}

        <Image
          src={getAllProductImages[currentImageIndex] || "/placeholder.jpg"}
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-500 ${isHovered ? "scale-105" : "scale-100"}`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {getAllProductImages.length > 1 && isHovered && (
          <div className="absolute bottom-2.5 left-0 right-0 flex justify-center gap-1 z-20">
            {getAllProductImages.map((_, idx) => (
              <div
                key={idx}
                className={`rounded-full transition-all duration-300 ${
                  idx === currentImageIndex ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </Link>

      {/* ── Product info ── */}
      <div className="p-4 flex flex-col flex-grow">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2
                         hover:text-orange-600 transition-colors duration-200 mb-2">
            {product.name}
          </h3>
        </Link>

        {product.avgRating > 0 && (
          <div className="flex items-center gap-1 text-xs mb-3">
            <span className="text-yellow-500 text-sm">★</span>
            <span className="font-semibold text-gray-800">{product.avgRating}</span>
            {product.reviewCount > 0 && (
              <span className="text-gray-400">({product.reviewCount})</span>
            )}
          </div>
        )}

        <div className="mt-auto pt-3 flex items-center justify-between gap-2 border-t border-gray-100">
          <PriceBlock />
          <CartBtn />
        </div>
      </div>
    </div>
  );
};
