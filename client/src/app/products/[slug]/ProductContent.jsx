"use client";

/* ── Sanitize HTML from API: remove empty paragraphs, strip bare &nbsp; ── */
function sanitizeHtml(raw) {
  if (!raw) return "";
  return raw
    .replace(/<p[^>]*>(\s|&nbsp;|\u00a0)*<\/p>/gi, "")
    .replace(/^(\s|&nbsp;|\u00a0)+|(\s|&nbsp;|\u00a0)+$/gi, "")
    .trim();
}

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchApi, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  RiStarFill as Star,
  RiSubtractLine as Minus,
  RiAddLine as Plus,
  RiAlertLine as AlertCircle,
  RiShoppingCartLine as ShoppingCart,
  RiHeartLine,
  RiHeartFill,
  RiArrowRightSLine as ChevronRight,
  RiCheckboxCircleLine as CheckCircle,
  RiShieldCheckLine as Shield,
  RiAwardLine as Award,
  RiHome4Line,
  RiFlashlightLine,
  RiDownloadLine,
  RiBookOpenLine,
  RiTimeLine,
  RiUserLine,
  RiVideoLine,
  RiSmartphoneLine,
} from "react-icons/ri";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import ReviewSection from "./ReviewSection";
import { useAddVariantToCart } from "@/lib/cart-utils";
import { ProductCard } from "@/components/products/ProductCard";

export default function ProductContent({ slug }) {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [effectivePriceInfo, setEffectivePriceInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [availableCombinations, setAvailableCombinations] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [priceVisibilitySettings, setPriceVisibilitySettings] = useState(null);

  const { addVariantToCart } = useAddVariantToCart();

  const getEffectivePrice = (variant, qty) => {
    if (!variant) return null;
    const baseSalePrice = variant.salePrice
      ? typeof variant.salePrice === "string" ? parseFloat(variant.salePrice) : variant.salePrice
      : null;
    const basePrice = variant.price
      ? typeof variant.price === "string" ? parseFloat(variant.price) : variant.price
      : 0;
    const originalPrice = baseSalePrice || basePrice;
    if (variant.pricingSlabs && variant.pricingSlabs.length > 0) {
      const sortedSlabs = [...variant.pricingSlabs].sort((a, b) => b.minQty - a.minQty);
      for (const slab of sortedSlabs) {
        if (qty >= slab.minQty && (slab.maxQty === null || qty <= slab.maxQty)) {
          return { price: slab.price, originalPrice, source: "SLAB", slab };
        }
      }
    }
    return { price: originalPrice, originalPrice, source: "DEFAULT", slab: null };
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setInitialLoading(true);
      try {
        const response = await fetchApi(`/public/products/${slug}`);
        const productData = response.data.product;
        setProduct(productData);
        setRelatedProducts(response.data.relatedProducts || []);
        const sortedVariants = productData.variants?.length > 0
          ? [...productData.variants].sort((a, b) => parseFloat(a.salePrice || a.price || 0) - parseFloat(b.salePrice || b.price || 0))
          : [];
        if (productData.images?.length > 0) {
          setMainImage(productData.images[0]);
        } else if (sortedVariants.length > 0) {
          const firstVariantImg = sortedVariants.find((v) => v.images?.length > 0)?.images?.[0];
          if (firstVariantImg) setMainImage(firstVariantImg);
        }
        if (sortedVariants.length > 0) {
          const combinations = sortedVariants
            .filter((v) => v.isActive !== false)
            .map((variant) => ({
              attributeValueIds: variant.attributes ? variant.attributes.map((a) => a.attributeValueId) : [],
              variant,
            }));
          setAvailableCombinations(combinations);
          if (productData.attributeOptions?.length > 0) {
            const defaultSelections = {};
            productData.attributeOptions.forEach((attr) => {
              if (attr.values?.length > 0) defaultSelections[attr.id] = attr.values[0].id;
            });
            setSelectedAttributes(defaultSelections);
            const matchingVariant = combinations.find((combo) => {
              const comboIds = combo.attributeValueIds.sort().join(",");
              const selectedIds = Object.values(defaultSelections).sort().join(",");
              return comboIds === selectedIds;
            });
            if (matchingVariant) {
              setSelectedVariant(matchingVariant.variant);
              const moq = matchingVariant.variant.moq || 1;
              setQuantity(moq);
              setEffectivePriceInfo(getEffectivePrice(matchingVariant.variant, moq));
            } else {
              setSelectedVariant(sortedVariants[0]);
              const moq = sortedVariants[0].moq || 1;
              setQuantity(moq);
              setEffectivePriceInfo(getEffectivePrice(sortedVariants[0], moq));
            }
          } else {
            setSelectedVariant(sortedVariants[0]);
            const moq = sortedVariants[0].moq || 1;
            setQuantity(moq);
            setEffectivePriceInfo(getEffectivePrice(sortedVariants[0], moq));
          }
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };
    if (slug) fetchProductDetails();
  }, [slug]);

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

  const handleAttributeChange = (attributeId, attributeValueId) => {
    const newSelections = { ...selectedAttributes, [attributeId]: attributeValueId };
    const selectedValueIds = Object.values(newSelections).sort();
    let matchingVariant = availableCombinations.find((combo) => {
      const comboIds = [...combo.attributeValueIds].sort();
      return comboIds.length === selectedValueIds.length && comboIds.every((id, idx) => id === selectedValueIds[idx]);
    });
    if (!matchingVariant) {
      const candidates = availableCombinations.filter((combo) => combo.attributeValueIds.includes(attributeValueId));
      matchingVariant = candidates.find((c) => (c.variant.stock ?? c.variant.quantity ?? 0) > 0) || candidates[0];
      if (matchingVariant) {
        const adjusted = { ...newSelections };
        matchingVariant.variant.attributes?.forEach((attr) => { adjusted[attr.attributeId] = attr.attributeValueId; });
        setSelectedAttributes(adjusted);
      }
    } else {
      setSelectedAttributes(newSelections);
    }
    if (matchingVariant) {
      setSelectedVariant(matchingVariant.variant);
      setMainImage(null);
      const moq = matchingVariant.variant.moq || 1;
      const newQty = quantity < moq ? moq : quantity;
      if (quantity < moq) setQuantity(newQty);
      setEffectivePriceInfo(getEffectivePrice(matchingVariant.variant, newQty));
    } else {
      setSelectedVariant(null);
      setEffectivePriceInfo(null);
    }
  };

  const getAvailableValuesForAttribute = (attributeId) => {
    if (!product?.attributeOptions) return [];
    const attribute = product.attributeOptions.find((attr) => attr.id === attributeId);
    if (!attribute?.values) return [];
    const existingValueIds = new Set();
    availableCombinations.forEach((combo) => {
      combo.variant.attributes?.forEach((attr) => {
        if (attr.attributeId === attributeId) existingValueIds.add(attr.attributeValueId);
      });
    });
    return attribute.values.filter((val) => existingValueIds.has(val.id));
  };

  const isValueUnavailable = (attributeId, valueId) => {
    const hypothetical = { ...selectedAttributes, [attributeId]: valueId };
    const selectedIds = Object.values(hypothetical);
    const matching = availableCombinations.filter((combo) => {
      const ids = combo.attributeValueIds;
      return selectedIds.every((id) => ids.includes(id));
    });
    return matching.length === 0;
  };

  const isValueOutOfStock = (attributeId, valueId) => {
    if (isValueUnavailable(attributeId, valueId)) return true;
    const hypothetical = { ...selectedAttributes, [attributeId]: valueId };
    const selectedIds = Object.values(hypothetical);
    const matching = availableCombinations.filter((combo) => selectedIds.every((id) => combo.attributeValueIds.includes(id)));
    return matching.every((combo) => (combo.variant.stock ?? combo.variant.quantity ?? 0) < 1);
  };

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!isAuthenticated || !product) return;
      try {
        const response = await fetchApi("/users/wishlist", { credentials: "include" });
        const wishlistItems = response.data.wishlistItems || [];
        setIsInWishlist(wishlistItems.some((item) => item.productId === product.id));
      } catch (error) { console.error("Failed to check wishlist status:", error); }
    };
    checkWishlistStatus();
  }, [isAuthenticated, product]);

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    const effectiveMOQ = selectedVariant?.moq || 1;
    if (newQuantity < effectiveMOQ) return;
    const availableStock = selectedVariant?.stock || selectedVariant?.quantity || 0;
    if (availableStock > 0 && newQuantity > availableStock) return;
    setQuantity(newQuantity);
    if (selectedVariant) setEffectivePriceInfo(getEffectivePrice(selectedVariant, newQuantity));
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      if (product?.variants?.length > 0) {
        setIsAddingToCart(true);
        setCartSuccess(false);
        try {
          const result = await addVariantToCart(product.variants[0], quantity, product.name);
          if (result.success) { setCartSuccess(true); setTimeout(() => setCartSuccess(false), 3000); }
        } catch (err) { console.error("Error adding to cart:", err); }
        finally { setIsAddingToCart(false); }
      }
      return;
    }
    setIsAddingToCart(true);
    setCartSuccess(false);
    try {
      const result = await addVariantToCart(selectedVariant, quantity, product.name);
      if (result.success) { setCartSuccess(true); setTimeout(() => setCartSuccess(false), 3000); }
    } catch (err) { console.error("Error adding to cart:", err); }
    finally { setIsAddingToCart(false); }
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) { router.push(`/auth?redirect=/courses/${slug}`); return; }
    setIsAddingToWishlist(true);
    try {
      if (isInWishlist) {
        const wishlistResponse = await fetchApi("/users/wishlist", { credentials: "include" });
        const wishlistItem = wishlistResponse.data.wishlistItems.find((item) => item.productId === product.id);
        if (wishlistItem) {
          await fetchApi(`/users/wishlist/${wishlistItem.id}`, { method: "DELETE", credentials: "include" });
          setIsInWishlist(false);
        }
      } else {
        await fetchApi("/users/wishlist", { method: "POST", credentials: "include", body: JSON.stringify({ productId: product.id }) });
        setIsInWishlist(true);
      }
    } catch (error) { console.error("Error updating wishlist:", error); }
    finally { setIsAddingToWishlist(false); }
  };

  const getImageUrl = (image) => {
    if (!image) return "/images/product-placeholder.jpg";
    if (image.startsWith("http")) return image;
    return `https://desirediv-storage.blr1.cdn.digitaloceanspaces.com/${image}`;
  };

  const renderImages = () => {
    let imagesToShow = [];
    if (selectedVariant?.images?.length > 0) imagesToShow = selectedVariant.images;
    else if (product?.images?.length > 0) imagesToShow = product.images;
    else if (product?.variants?.length > 0) {
      const variantWithImages = product.variants.find((v) => v.images?.length > 0);
      if (variantWithImages) imagesToShow = variantWithImages.images;
    }

    const noImage = (
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden flex items-center justify-center"
        style={{ background: "#FAFAFA", border: "1px solid #F0F0F0" }}>
        <div className="text-gray-300 text-center p-8">
          <div className="w-16 h-16 mx-auto mb-3 opacity-30">
            <Image src="/images/product-placeholder.jpg" alt="" width={64} height={64} className="object-contain" />
          </div>
          <p className="text-xs text-gray-400">No image available</p>
        </div>
      </div>
    );

    if (imagesToShow.length === 0) return noImage;

    const fallbackMain = imagesToShow.find((img) => img.isPrimary) || imagesToShow[0];
    const activeMain = mainImage && imagesToShow.some((img) => img.url === mainImage.url) ? mainImage : fallbackMain;

    if (imagesToShow.length === 1) {
      return (
        <div className="sticky top-8">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden"
            style={{ background: "#FAFAFA", border: "1px solid #F0F0F0" }}>
            <Image src={getImageUrl(activeMain.url)} alt={product?.name || "Product"} fill className="object-contain p-4" priority />
          </div>
        </div>
      );
    }

    return (
      <div className="sticky top-8 space-y-3">
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden"
          style={{ background: "#FAFAFA", border: "1px solid #F0F0F0" }}>
          <Image src={getImageUrl(activeMain?.url)} alt={product?.name || "Product"} fill className="object-contain p-4" priority />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {imagesToShow.map((image, index) => (
            <button
              key={index}
              onClick={() => setMainImage(image)}
              className="relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden transition-all duration-200"
              style={{
                background: "#FAFAFA",
                border: activeMain?.url === image.url ? "2px solid #2563EB" : "2px solid #EBEBEB",
                boxShadow: activeMain?.url === image.url ? "0 2px 8px rgba(37,99,235,0.15)" : "none",
              }}
            >
              <Image src={getImageUrl(image.url)} alt={`View ${index + 1}`} fill className="object-contain p-1.5" />
            </button>
          ))}
        </div>
      </div>
    );
  };

  const calculateDiscount = (regularPrice, salePrice) => {
    if (!regularPrice || !salePrice || regularPrice <= salePrice) return 0;
    return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
  };

  const getPriceDisplay = () => {
    if (initialLoading) return <div className="h-10 w-40 bg-gray-50 animate-pulse rounded-lg" />;

    if (priceVisibilitySettings === null) {
      return (
        <div className="space-y-1">
          <span className="text-2xl font-bold text-gray-400">Login to view price</span>
          <p className="text-sm text-gray-500">Please log in to see pricing</p>
        </div>
      );
    }

    if (selectedVariant) {
      const priceInfo = effectivePriceInfo || getEffectivePrice(selectedVariant, quantity);
      if (!priceInfo) return <span className="text-2xl font-bold text-gray-400">Price not available</span>;
      const effectivePrice = priceInfo.price;
      const originalPrice = priceInfo.originalPrice;
      const isSlabPrice = priceInfo.source === "SLAB";
      const discount = originalPrice > effectivePrice ? calculateDiscount(originalPrice, effectivePrice) : 0;

      if (priceVisibilitySettings?.hidePricesForGuests && !isAuthenticated) {
        return (
          <div className="space-y-1">
            <span className="text-2xl font-bold text-gray-400">Login to view price</span>
            <p className="text-sm text-gray-500">Please log in to see pricing</p>
          </div>
        );
      }

      return (
        <div className="space-y-2">
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-3xl md:text-4xl font-extrabold text-blue-600 tracking-tight">
              {formatCurrency(effectivePrice)}
            </span>
            {originalPrice > effectivePrice && (
              <>
                <span className="text-lg text-gray-400 line-through">{formatCurrency(originalPrice)}</span>
                {discount > 0 && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg text-emerald-700"
                    style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)" }}>
                    {discount}% OFF
                  </span>
                )}
              </>
            )}
          </div>
          {isSlabPrice && (
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Bulk pricing applied for {quantity} units
            </p>
          )}
          <p className="text-xs text-gray-400">Inclusive of all taxes</p>
        </div>
      );
    }

    if (product) {
      const basePrice = product.basePrice || 0;
      const regularPrice = product.regularPrice || 0;
      if (priceVisibilitySettings?.hidePricesForGuests && !isAuthenticated) {
        return (
          <div className="space-y-1">
            <span className="text-2xl font-bold text-gray-400">Login to view price</span>
            <p className="text-sm text-gray-500">Please log in to see pricing</p>
          </div>
        );
      }
      if (product.hasSale && basePrice > 0 && regularPrice > basePrice) {
        const discount = calculateDiscount(regularPrice, basePrice);
        return (
          <div className="space-y-2">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl md:text-4xl font-extrabold text-blue-600 tracking-tight">{formatCurrency(basePrice)}</span>
              <span className="text-lg text-gray-400 line-through">{formatCurrency(regularPrice)}</span>
              {discount > 0 && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg text-emerald-700"
                  style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)" }}>
                  {discount}% OFF
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400">Inclusive of all taxes</p>
          </div>
        );
      }
      if (basePrice > 0) {
        return (
          <div className="space-y-1">
            <span className="text-3xl md:text-4xl font-extrabold text-blue-600 tracking-tight">{formatCurrency(basePrice)}</span>
            <p className="text-xs text-gray-400 block">Inclusive of all taxes</p>
          </div>
        );
      }
    }
    return <span className="text-2xl font-bold text-gray-400">Price not available</span>;
  };

  /* Loading */
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center h-64 gap-5">
          <div className="w-12 h-12 border-[3px] border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading product details…</p>
        </div>
      </div>
    );
  }

  /* Error */
  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="rounded-2xl p-8 flex flex-col items-center text-center"
          style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.12)" }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.12)" }}>
            <AlertCircle className="text-red-500 h-8 w-8" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 mb-2">Error Loading Product</h2>
          <p className="text-red-500 mb-6 text-sm">{error}</p>
          <Link href="/courses"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all duration-300 hover:scale-[1.03]"
            style={{ background: "linear-gradient(135deg, #1E40AF, #2563EB, #3B82F6)", boxShadow: "0 4px 16px rgba(37,99,235,0.25)" }}>
            Browse Courses <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  /* Not found */
  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="rounded-2xl p-8 flex flex-col items-center text-center"
          style={{ background: "rgba(37,99,235,0.03)", border: "1px solid rgba(37,99,235,0.1)" }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.1)" }}>
            <AlertCircle className="text-blue-400 h-8 w-8" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-400 mb-6 text-sm">The product you are looking for does not exist or has been removed.</p>
          <Link href="/courses"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all duration-300 hover:scale-[1.03]"
            style={{ background: "linear-gradient(135deg, #1E40AF, #2563EB, #3B82F6)", boxShadow: "0 4px 16px rgba(37,99,235,0.25)" }}>
            Browse Courses <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const effectiveHasVariants = product.hasVariants === true || (Array.isArray(product.variants) && product.variants.length > 1);

  const getVariantLabel = (variant) => {
    if (Array.isArray(variant.attributes) && variant.attributes.length > 0) {
      return variant.attributes.map((a) => a.value || a.attributeValue?.value).filter(Boolean).join(" · ");
    }
    return variant.sku.replace(/^-+/, "").replace(/-/g, " ");
  };

  const isOutOfStock = selectedVariant
    ? (selectedVariant.stock ?? selectedVariant.quantity ?? 0) < 1
    : !product?.variants?.length || (product.variants[0]?.quantity ?? 0) < 1;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">

        {/* Breadcrumbs */}
        <nav className="flex items-center flex-wrap gap-1.5 text-xs text-gray-400 mb-8">
          <Link href="/" className="hover:text-blue-600 transition-colors flex items-center gap-1">
            <RiHome4Line className="w-3 h-3" /> Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/courses" className="hover:text-blue-600 transition-colors">Courses</Link>
          {(product?.category || product?.categories?.[0]?.category) && (
            <>
              <ChevronRight className="h-3 w-3" />
              <Link
                href={`/category/${product.category?.slug || product.categories[0]?.category?.slug}`}
                className="hover:text-blue-600 transition-colors capitalize"
              >
                {product.category?.name || product.categories[0]?.category?.name}
              </Link>
            </>
          )}
          <ChevronRight className="h-3 w-3" />
          <span className="text-blue-600 font-medium truncate max-w-[200px] sm:max-w-none">{product?.name}</span>
        </nav>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">

          {/* LEFT — Images */}
          <div className="w-full">
            {loading ? (
              <div className="aspect-square w-full bg-gray-50 rounded-2xl animate-pulse" />
            ) : error ? (
              <div className="aspect-square w-full rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.1)" }}>
                <div className="text-center p-6">
                  <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              </div>
            ) : renderImages()}
          </div>

          {/* RIGHT — Details */}
          <div className="flex flex-col gap-5">

            {product.brand?.name && product.brand?.slug && (
              <Link href={`/brand/${product.brand.slug}`}
                className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors">
                {product.brand.name}
              </Link>
            )}

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight">
              {product.name}
            </h1>

            {product.avgRating > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i}
                      className={`h-4 w-4 md:h-5 md:w-5 ${i < Math.round(product.avgRating) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
                      fill={i < Math.round(product.avgRating) ? "currentColor" : "none"} />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {product.avgRating}{product.reviewCount > 0 && ` (${product.reviewCount} reviews)`}
                </span>
              </div>
            )}

            {/* Flash Sale */}
            {product.flashSale?.isActive && (
              <div className="p-4 rounded-2xl text-white"
                style={{ background: "linear-gradient(135deg, #1E40AF, #2563EB, #3B82F6)", boxShadow: "0 4px 16px rgba(37,99,235,0.25)" }}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <RiFlashlightLine className="w-6 h-6" />
                    <div>
                      <p className="font-bold">Flash Sale</p>
                      <p className="text-sm opacity-80">{product.flashSale.name}</p>
                    </div>
                  </div>
                  <div className="bg-white/20 px-4 py-2 rounded-xl">
                    <span className="font-extrabold text-xl">{product.flashSale.discountPercentage}% OFF</span>
                  </div>
                </div>
              </div>
            )}

            {/* Price block */}
            <div className="p-5 rounded-2xl" style={{ background: "#FFFFFF", border: "1px solid #F0F0F0" }}>
              {product.flashSale?.isActive ? (
                <div className="space-y-2">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-3xl md:text-4xl font-extrabold text-blue-600 tracking-tight">{formatCurrency(product.flashSale.flashSalePrice)}</span>
                    <span className="text-lg text-gray-400 line-through">{formatCurrency(product.basePrice)}</span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg text-blue-700"
                      style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.1)" }}>
                      <RiFlashlightLine className="w-3 h-3 inline mr-0.5" />{product.flashSale.discountPercentage}% OFF
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">Inclusive of all taxes · Flash Sale Price</p>
                </div>
              ) : getPriceDisplay()}
            </div>

            {/* Short description */}
            {product.shortDescription && (
              <div className="p-4 rounded-xl" style={{ border: "1px solid #F0F0F0" }}>
                <p className="text-gray-500 text-sm leading-relaxed">{product.shortDescription}</p>
              </div>
            )}

            {/* Course details */}
            {(product.facultyName || product.duration || product.batchStartDate || product.courseType || product.digitalEnabled) && (
              <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #F0F0F0" }}>
                <div className="px-4 py-2.5" style={{ background: "linear-gradient(170deg, #F8FAFF, #EFF6FF)", borderBottom: "1px solid rgba(59,130,246,0.06)" }}>
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em]">Course Details</p>
                </div>
                <div className="p-4 flex flex-wrap gap-4 text-sm">
                  {product.facultyName && (
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.1)" }}>
                        <RiUserLine className="w-3.5 h-3.5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wide">Faculty</p>
                        <p className="font-semibold text-gray-900 text-sm">{product.facultyName}</p>
                      </div>
                    </div>
                  )}
                  {product.courseType && (
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.1)" }}>
                        <RiVideoLine className="w-3.5 h-3.5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wide">Type</p>
                        <p className="font-semibold text-gray-900 text-sm capitalize">{product.courseType}</p>
                      </div>
                    </div>
                  )}
                  {product.duration && (
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.1)" }}>
                        <RiTimeLine className="w-3.5 h-3.5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wide">Duration</p>
                        <p className="font-semibold text-gray-900 text-sm">{product.duration}</p>
                      </div>
                    </div>
                  )}
                  {product.batchStartDate && (
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.1)" }}>
                        <RiBookOpenLine className="w-3.5 h-3.5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wide">Batch Start</p>
                        <p className="font-semibold text-gray-900 text-sm">
                          {new Date(product.batchStartDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                  )}
                  {product.digitalEnabled && (
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.12)" }}>
                        <RiFlashlightLine className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                      <p className="font-semibold text-emerald-700 text-sm">Instant Digital Access</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Attribute selection */}
            {effectiveHasVariants && product.attributeOptions?.length > 0 && (
              <div className="space-y-4">
                {product.attributeOptions.map((attribute) => {
                  const availableValues = getAvailableValuesForAttribute(attribute.id);
                  const selectedValueId = selectedAttributes[attribute.id];
                  const selectedLabel = availableValues.find((v) => v.id === selectedValueId)?.value;
                  return (
                    <div key={attribute.id}>
                      <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2.5 flex items-center gap-2">
                        {attribute.name}
                        {selectedLabel && <span className="text-blue-600 font-semibold normal-case tracking-normal">— {selectedLabel}</span>}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {availableValues.length > 0 ? (
                          availableValues.map((value) => {
                            const isSelected = selectedValueId === value.id;
                            const unavailable = isValueUnavailable(attribute.id, value.id);
                            const oos = !unavailable && isValueOutOfStock(attribute.id, value.id);
                            return (
                              <button key={value.id}
                                title={unavailable ? "Not available — click to switch" : oos ? "Out of stock" : undefined}
                                onClick={() => handleAttributeChange(attribute.id, value.id)}
                                className="relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 select-none"
                                style={{
                                  background: isSelected ? "linear-gradient(135deg, #1E40AF, #2563EB)" : "#FFFFFF",
                                  color: isSelected ? "#FFFFFF" : unavailable ? "#D1D5DB" : oos ? "#9CA3AF" : "#374151",
                                  border: isSelected ? "none" : "1px solid #EBEBEB",
                                  boxShadow: isSelected ? "0 4px 12px rgba(37,99,235,0.2)" : "none",
                                  textDecoration: oos && !isSelected ? "line-through" : "none",
                                }}>
                                {value.value}
                                {oos && !isSelected && <span className="ml-1 text-[10px] font-normal no-underline text-gray-400">(sold out)</span>}
                              </button>
                            );
                          })
                        ) : <p className="text-sm text-gray-400">No {attribute.name.toLowerCase()} options available</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Fallback variant selector */}
            {effectiveHasVariants && (!product.attributeOptions || product.attributeOptions.length === 0) &&
              Array.isArray(product.variants) && product.variants.length > 1 && (
                <div className="space-y-3">
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Select Option</h3>
                  <div className="flex flex-col gap-2">
                    {product.variants.map((variant) => {
                      const isSelected = selectedVariant?.id === variant.id;
                      const vPrice = parseFloat(variant.salePrice || variant.price || 0);
                      const vOriginal = parseFloat(variant.price || 0);
                      const vStock = variant.stock ?? variant.quantity ?? 0;
                      const vOOS = vStock < 1;
                      const label = getVariantLabel(variant);
                      const discount = vOriginal > vPrice ? Math.round(((vOriginal - vPrice) / vOriginal) * 100) : 0;
                      return (
                        <button key={variant.id} disabled={vOOS}
                          onClick={() => { setSelectedVariant(variant); setMainImage(null); const moq = variant.moq || 1; setQuantity(moq); setEffectivePriceInfo(getEffectivePrice(variant, moq)); }}
                          className="text-left w-full p-4 rounded-xl transition-all duration-200"
                          style={{
                            background: isSelected ? "linear-gradient(170deg, #F8FAFF, #EFF6FF)" : "#FFFFFF",
                            border: isSelected ? "2px solid #2563EB" : "1px solid #EBEBEB",
                            boxShadow: isSelected ? "0 2px 8px rgba(37,99,235,0.08)" : "none",
                            opacity: vOOS ? 0.4 : 1, cursor: vOOS ? "not-allowed" : "pointer",
                          }}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2.5 min-w-0">
                              <span className="mt-1 w-3 h-3 rounded-full flex-shrink-0 border-2 transition-colors"
                                style={{ borderColor: isSelected ? "#2563EB" : "#D1D5DB", background: isSelected ? "#2563EB" : "transparent" }} />
                              <div className="min-w-0">
                                <p className={`text-sm font-semibold leading-snug ${isSelected ? "text-blue-700" : "text-gray-800"}`}>{label}</p>
                                {vOOS && <p className="text-xs text-red-500 mt-0.5">Out of stock</p>}
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-sm font-bold text-blue-600">{formatCurrency(vPrice)}</p>
                              {vOriginal > vPrice && (
                                <div className="flex items-center gap-1.5 justify-end">
                                  <p className="text-xs text-gray-400 line-through">{formatCurrency(vOriginal)}</p>
                                  {discount > 0 && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded font-bold text-emerald-700"
                                      style={{ background: "rgba(16,185,129,0.08)" }}>{discount}% OFF</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            {/* Cart success */}
            {cartSuccess && (
              <div className="p-3 text-emerald-700 text-sm rounded-xl flex items-center gap-2"
                style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)" }}>
                <CheckCircle className="h-4 w-4 flex-shrink-0" /> Item successfully added to your cart!
              </div>
            )}

            {/* MOQ notice */}
            {effectiveHasVariants && selectedVariant?.moq && selectedVariant.moq > 1 && (
              <div className="p-3 rounded-xl flex items-start gap-2"
                style={{ background: "rgba(37,99,235,0.04)", border: "1px solid rgba(37,99,235,0.1)" }}>
                <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-blue-800">Minimum Order: {selectedVariant.moq} units</p>
                  <p className="text-xs text-blue-600 mt-0.5">You need to order at least {selectedVariant.moq} units</p>
                </div>
              </div>
            )}

            {/* Qty + Stock */}
            {effectiveHasVariants && (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Qty</p>
                  <div className="flex items-center rounded-xl overflow-hidden" style={{ border: "1px solid #EBEBEB" }}>
                    <button className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      onClick={() => handleQuantityChange(-1)} disabled={quantity <= (selectedVariant?.moq || 1) || isAddingToCart}>
                      <Minus className="h-3 w-3 text-gray-600" />
                    </button>
                    <span className="w-10 text-center font-bold text-gray-900 text-sm py-2" style={{ borderLeft: "1px solid #EBEBEB", borderRight: "1px solid #EBEBEB" }}>{quantity}</span>
                    <button className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      onClick={() => handleQuantityChange(1)}
                      disabled={(selectedVariant && (selectedVariant.stock > 0 || selectedVariant.quantity > 0) && quantity >= (selectedVariant.stock || selectedVariant.quantity)) || isAddingToCart}>
                      <Plus className="h-3 w-3 text-gray-600" />
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* CTA Buttons */}
            <div className="space-y-3 pt-1">
              <Button variant="outline"
                className="w-full h-11 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                style={{ border: "1px solid #EBEBEB", color: "#4B5563" }}
                onClick={handleAddToWishlist} disabled={isAddingToWishlist}>
                {isInWishlist ? <RiHeartFill className="h-5 w-5 text-red-500" /> : <RiHeartLine className="h-5 w-5" />}
                {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
              </Button>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                className="flex-1 h-11 text-sm font-bold rounded-xl gap-2 flex items-center justify-center
                           text-white transition-all duration-300 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: isOutOfStock ? "#D1D5DB" : "linear-gradient(135deg, #1E40AF, #2563EB, #3B82F6)",
                  boxShadow: isOutOfStock ? "none" : "0 4px 16px rgba(37,99,235,0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
                }}
                onClick={handleAddToCart} disabled={isAddingToCart || isOutOfStock}>
                {isAddingToCart ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Adding…</>
                ) : isOutOfStock ? "Out of Stock" : (
                  <><ShoppingCart className="h-4 w-4" /> Add to Cart</>
                )}
              </button>
            </div>

            {/* Trust indicators */}
            <div className="space-y-2 pt-2">
              {[
                { icon: CheckCircle, label: "Lifetime access" },
                { icon: Award, label: "Certificate of completion" },
                { icon: RiSmartphoneLine, label: "Mobile friendly" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2.5 text-sm text-gray-600">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.08)" }}>
                    <item.icon className="h-3.5 w-3.5 text-blue-500" />
                  </div>
                  <span>{item.label}</span>
                </div>
              ))}
              <div className="flex items-center gap-2.5 pt-2 mt-2" style={{ borderTop: "1px solid #F0F0F0" }}>
                <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.1)" }}>
                  <Shield className="h-3.5 w-3.5 text-emerald-500" />
                </div>
                <span className="text-sm font-semibold text-emerald-700">30-Day Money Back Guarantee</span>
              </div>
            </div>

            {/* Metadata */}
            <div className="pt-4 space-y-3 text-sm" style={{ borderTop: "1px solid #F0F0F0" }}>
              {selectedVariant?.sku && (
                <div className="flex gap-3">
                  <span className="font-semibold w-24 text-gray-400 flex-shrink-0">SKU</span>
                  <span className="text-gray-600 font-mono text-xs">{selectedVariant.sku}</span>
                </div>
              )}
              {product.category && (
                <div className="flex gap-3">
                  <span className="font-semibold w-24 text-gray-400 flex-shrink-0">Category</span>
                  <Link href={`/category/${product.category?.slug}`} className="text-blue-600 hover:underline">{product.category?.name}</Link>
                </div>
              )}
              {product.digitalEnabled && (
                <div className="flex items-center gap-2 pt-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg"
                    style={{ background: "rgba(16,185,129,0.06)", color: "#059669", border: "1px solid rgba(16,185,129,0.12)" }}>
                    <RiFlashlightLine className="w-3 h-3" /> Instant Access — Digital Product
                  </span>
                </div>
              )}
            </div>

            {/* Sample Book */}
            {product.sampleBookUrl && (
              <div className="mt-4 p-4 rounded-2xl flex items-center justify-between gap-3"
                style={{ background: "linear-gradient(170deg, #F8FAFF, #EFF6FF)", border: "1px solid rgba(59,130,246,0.06)" }}>
                <div>
                  <p className="font-bold text-gray-800 text-sm">Sample Book Available</p>
                  <p className="text-xs text-gray-400 mt-0.5">Preview a sample before purchasing</p>
                </div>
                <a href={`https://desirediv-storage.blr1.digitaloceanspaces.com/${product.sampleBookUrl}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:scale-[1.03]"
                  style={{ background: "linear-gradient(135deg, #1E40AF, #2563EB)", boxShadow: "0 2px 8px rgba(37,99,235,0.2)" }}>
                  <RiDownloadLine className="w-4 h-4" /> Download
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Sticky mobile CTA */}
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white px-4 py-3 flex gap-3"
          style={{ borderTop: "1px solid #F0F0F0", boxShadow: "0 -4px 20px rgba(0,0,0,0.06)" }}>
          <button
            className="flex-1 h-12 text-sm font-bold rounded-xl gap-2 flex items-center justify-center
                       text-white disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: isOutOfStock ? "#D1D5DB" : "linear-gradient(135deg, #1E40AF, #2563EB, #3B82F6)",
              boxShadow: isOutOfStock ? "none" : "0 4px 16px rgba(37,99,235,0.3)",
            }}
            onClick={handleAddToCart} disabled={isAddingToCart || isOutOfStock}>
            {isAddingToCart ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Adding…</>
            ) : isOutOfStock ? "Out of Stock" : (
              <><ShoppingCart className="h-4 w-4" /> Add to Cart</>
            )}
          </button>
          <button
            className="h-12 w-12 rounded-xl flex-shrink-0 flex items-center justify-center transition-colors"
            style={{
              border: isInWishlist ? "2px solid #EF4444" : "1px solid #EBEBEB",
              background: isInWishlist ? "rgba(239,68,68,0.04)" : "#FFFFFF",
              color: isInWishlist ? "#EF4444" : "#9CA3AF",
            }}
            onClick={handleAddToWishlist} disabled={isAddingToWishlist}>
            {isInWishlist ? <RiHeartFill className="h-5 w-5" /> : <RiHeartLine className="h-5 w-5" />}
          </button>
        </div>

        {/* Product tabs */}
        <div className="mb-16 pb-20 lg:pb-0">
          <div style={{ borderBottom: "1px solid #F0F0F0" }}>
            <div className="flex overflow-x-auto gap-1">
              {[
                { key: "description", label: "Description" },
                { key: "reviews", label: `Reviews (${product.reviewCount || 0})` },
                ...(product.sampleNotes ? [{ key: "sample_notes", label: "Sample Notes" }] : []),
                ...(() => {
                  try {
                    const ai = product.additionalInfo ? (typeof product.additionalInfo === "string" ? JSON.parse(product.additionalInfo) : product.additionalInfo) : [];
                    return Array.isArray(ai) && ai.length > 0 ? [{ key: "additional_info", label: "More Info" }] : [];
                  } catch { return []; }
                })(),
              ].map(({ key, label }) => (
                <button key={key}
                  className="px-5 py-3 text-sm font-semibold uppercase tracking-wide whitespace-nowrap transition-colors"
                  style={{
                    borderBottom: activeTab === key ? "2px solid #2563EB" : "2px solid transparent",
                    color: activeTab === key ? "#2563EB" : "#9CA3AF",
                  }}
                  onClick={() => setActiveTab(key)}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="py-8">
            {activeTab === "description" && (
              <div className="prose max-w-none">
                <div className="text-gray-600 leading-relaxed mb-6 [&_p:empty]:hidden [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-semibold [&_strong]:font-semibold [&_a]:text-blue-600 [&_a]:underline"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }} />
                {product.directions && (
                  <div className="mt-8 p-6 rounded-2xl" style={{ background: "linear-gradient(170deg, #F8FAFF, #EFF6FF)", border: "1px solid rgba(59,130,246,0.06)" }}>
                    <h3 className="text-lg font-bold mb-3 text-blue-700">Directions for Use</h3>
                    <p className="text-gray-600 leading-relaxed">{product.directions}</p>
                  </div>
                )}
              </div>
            )}
            {activeTab === "reviews" && <ReviewSection product={product} />}
            {activeTab === "sample_notes" && (
              <div className="prose max-w-none">
                <div className="p-5 rounded-2xl" style={{ background: "linear-gradient(170deg, #F8FAFF, #EFF6FF)", border: "1px solid rgba(59,130,246,0.06)" }}>
                  <h3 className="text-lg font-bold mb-3 text-blue-700">Sample Notes</h3>
                  <div className="text-gray-600 leading-relaxed [&_p:empty]:hidden [&_p]:mb-2"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.sampleNotes) || "No sample notes available." }} />
                  {product.sampleNotes?.startsWith("http") && (
                    <a href={product.sampleNotes} target="_blank" rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-semibold text-sm mt-3 inline-block">
                      Download / View Notes →
                    </a>
                  )}
                </div>
              </div>
            )}
            {activeTab === "additional_info" && (() => {
              let items = [];
              try { const raw = product.additionalInfo; items = raw ? (typeof raw === "string" ? JSON.parse(raw) : raw) : []; if (!Array.isArray(items)) items = []; } catch { items = []; }
              return (
                <div className="overflow-hidden rounded-2xl" style={{ border: "1px solid #F0F0F0" }}>
                  <table className="w-full text-sm">
                    <tbody>
                      {items.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #F5F5F5", background: idx % 2 === 0 ? "#FAFBFF" : "#FFFFFF" }}>
                          <td className="px-5 py-3.5 font-semibold text-gray-800 w-1/3" style={{ borderRight: "1px solid #F0F0F0" }}>{item.title}</td>
                          <td className="px-5 py-3.5 text-gray-500">{item.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts?.length > 0 && (
          <div className="pb-10">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-6 bg-gradient-to-r from-transparent to-blue-400/30" />
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-blue-500/50">You May Also Like</span>
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Related Courses</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}