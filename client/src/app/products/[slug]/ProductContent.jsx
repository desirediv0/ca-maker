"use client";

/* ── Sanitize HTML from API: remove empty paragraphs, strip bare &nbsp; ── */
function sanitizeHtml(raw) {
  if (!raw) return "";
  return raw
    .replace(/<p[^>]*>(\s|&nbsp;|\u00a0)*<\/p>/gi, "")   // empty <p> tags
    .replace(/^(\s|&nbsp;|\u00a0)+|(\s|&nbsp;|\u00a0)+$/gi, "") // leading/trailing
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
  RiTruckLine as Truck,
  RiRefreshLine as RefreshCw,
  RiAwardLine as Award,
} from "react-icons/ri";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import ReviewSection from "./ReviewSection";
import { useAddVariantToCart } from "@/lib/cart-utils";
import { ProductCard } from "@/components/products/ProductCard";

export default function ProductContent({ slug }) {
  const [product,               setProduct]               = useState(null);
  const [relatedProducts,       setRelatedProducts]       = useState([]);
  const [loading,               setLoading]               = useState(true);
  const [error,                 setError]                 = useState(null);
  const [mainImage,             setMainImage]             = useState(null);
  const [selectedAttributes,    setSelectedAttributes]    = useState({});
  const [selectedVariant,       setSelectedVariant]       = useState(null);
  const [quantity,              setQuantity]              = useState(1);
  const [effectivePriceInfo,    setEffectivePriceInfo]    = useState(null);
  const [activeTab,             setActiveTab]             = useState("description");
  const { isAuthenticated }   = useAuth();
  const router                = useRouter();
  const [isAddingToWishlist,    setIsAddingToWishlist]    = useState(false);
  const [isInWishlist,          setIsInWishlist]          = useState(false);
  const [isAddingToCart,        setIsAddingToCart]        = useState(false);
  const [cartSuccess,           setCartSuccess]           = useState(false);
  const [availableCombinations, setAvailableCombinations] = useState([]);
  const [initialLoading,        setInitialLoading]        = useState(true);
  const [priceVisibilitySettings, setPriceVisibilitySettings] = useState(null);

  const { addVariantToCart } = useAddVariantToCart();

  /* ─── Effective price logic (unchanged) ─────────────────── */
  const getEffectivePrice = (variant, qty) => {
    if (!variant) return null;
    const baseSalePrice = variant.salePrice
      ? typeof variant.salePrice === "string"
        ? parseFloat(variant.salePrice)
        : variant.salePrice
      : null;
    const basePrice   = variant.price
      ? typeof variant.price === "string"
        ? parseFloat(variant.price)
        : variant.price
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

  /* ─── Fetch product (unchanged) ─────────────────────────── */
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setInitialLoading(true);
      try {
        const response    = await fetchApi(`/public/products/${slug}`);
        const productData = response.data.product;
        setProduct(productData);
        setRelatedProducts(response.data.relatedProducts || []);

        // Sort variants by price so the default/card image is the cheapest variant
        const sortedVariants = productData.variants?.length > 0
          ? [...productData.variants].sort(
              (a, b) => parseFloat(a.salePrice || a.price || 0) - parseFloat(b.salePrice || b.price || 0)
            )
          : [];

        // Set initial main image: product-level first, then cheapest variant image
        if (productData.images?.length > 0) {
          setMainImage(productData.images[0]);
        } else if (sortedVariants.length > 0) {
          const firstVariantImg = sortedVariants.find((v) => v.images?.length > 0)?.images?.[0];
          if (firstVariantImg) setMainImage(firstVariantImg);
        }

        if (sortedVariants.length > 0) {
          // Include ALL active variants so every attribute option is selectable;
          // out-of-stock ones are shown disabled/greyed in the UI.
          const combinations = sortedVariants
            .filter((v) => v.isActive !== false)
            .map((variant) => ({
              attributeValueIds: variant.attributes
                ? variant.attributes.map((a) => a.attributeValueId)
                : [],
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
              const comboIds    = combo.attributeValueIds.sort().join(",");
              const selectedIds = Object.values(defaultSelections).sort().join(",");
              return comboIds === selectedIds;
            });

            if (matchingVariant) {
              setSelectedVariant(matchingVariant.variant);
              const moq       = matchingVariant.variant.moq || 1;
              setQuantity(moq);
              setEffectivePriceInfo(getEffectivePrice(matchingVariant.variant, moq));
            } else {
              // Default to cheapest variant
              setSelectedVariant(sortedVariants[0]);
              const moq = sortedVariants[0].moq || 1;
              setQuantity(moq);
              setEffectivePriceInfo(getEffectivePrice(sortedVariants[0], moq));
            }
          } else {
            // No named attributes: default to cheapest variant
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

  /* ─── Price visibility settings (unchanged) ─────────────── */
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

  /* ─── Attribute change ───────────────────────────────────── */
  const handleAttributeChange = (attributeId, attributeValueId) => {
    const newSelections = { ...selectedAttributes, [attributeId]: attributeValueId };

    // Try exact match first
    const selectedValueIds = Object.values(newSelections).sort();
    let matchingVariant = availableCombinations.find((combo) => {
      const comboIds = [...combo.attributeValueIds].sort();
      return (
        comboIds.length === selectedValueIds.length &&
        comboIds.every((id, idx) => id === selectedValueIds[idx])
      );
    });

    // No exact match — find the best compatible combo that contains the
    // newly chosen value and as many other current selections as possible.
    if (!matchingVariant) {
      const candidates = availableCombinations.filter((combo) =>
        combo.attributeValueIds.includes(attributeValueId)
      );
      // Pick the in-stock one first, then any
      matchingVariant =
        candidates.find((c) => (c.variant.stock ?? c.variant.quantity ?? 0) > 0) ||
        candidates[0];

      if (matchingVariant) {
        // Auto-adjust other selections to match this combo
        const adjusted = { ...newSelections };
        matchingVariant.variant.attributes?.forEach((attr) => {
          adjusted[attr.attributeId] = attr.attributeValueId;
        });
        setSelectedAttributes(adjusted);
      }
    } else {
      setSelectedAttributes(newSelections);
    }

    if (matchingVariant) {
      setSelectedVariant(matchingVariant.variant);
      setMainImage(null); // reset so renderImages picks variant's first image
      const moq    = matchingVariant.variant.moq || 1;
      const newQty = quantity < moq ? moq : quantity;
      if (quantity < moq) setQuantity(newQty);
      setEffectivePriceInfo(getEffectivePrice(matchingVariant.variant, newQty));
    } else {
      setSelectedVariant(null);
      setEffectivePriceInfo(null);
    }
  };

  /* Returns ALL values for this attribute that exist in ANY active combination.
     No cross-attribute filtering — show every option that was ever defined. */
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

  /* Returns true when selecting this value would result in NO valid in-stock combo
     given the rest of the current selections. Used for greying out impossible options. */
  const isValueUnavailable = (attributeId, valueId) => {
    // Build hypothetical selection with this value chosen
    const hypothetical = { ...selectedAttributes, [attributeId]: valueId };
    const selectedIds  = Object.values(hypothetical);
    // Find combos that contain ALL currently selected values
    const matching = availableCombinations.filter((combo) => {
      const ids = combo.attributeValueIds;
      return selectedIds.every((id) => ids.includes(id));
    });
    // Unavailable = no such combo exists at all
    return matching.length === 0;
  };

  /* Returns true when ALL matching combos for this selection are out of stock */
  const isValueOutOfStock = (attributeId, valueId) => {
    if (isValueUnavailable(attributeId, valueId)) return true;
    const hypothetical = { ...selectedAttributes, [attributeId]: valueId };
    const selectedIds  = Object.values(hypothetical);
    const matching = availableCombinations.filter((combo) =>
      selectedIds.every((id) => combo.attributeValueIds.includes(id))
    );
    return matching.every(
      (combo) => (combo.variant.stock ?? combo.variant.quantity ?? 0) < 1
    );
  };

  /* ─── Wishlist check (unchanged) ─────────────────────────── */
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!isAuthenticated || !product) return;
      try {
        const response     = await fetchApi("/users/wishlist", { credentials: "include" });
        const wishlistItems = response.data.wishlistItems || [];
        setIsInWishlist(wishlistItems.some((item) => item.productId === product.id));
      } catch (error) {
        console.error("Failed to check wishlist status:", error);
      }
    };
    checkWishlistStatus();
  }, [isAuthenticated, product]);

  /* ─── Quantity change (unchanged) ───────────────────────── */
  const handleQuantityChange = (change) => {
    const newQuantity    = quantity + change;
    const effectiveMOQ   = selectedVariant?.moq || 1;
    if (newQuantity < effectiveMOQ) return;
    const availableStock = selectedVariant?.stock || selectedVariant?.quantity || 0;
    if (availableStock > 0 && newQuantity > availableStock) return;
    setQuantity(newQuantity);
    if (selectedVariant) setEffectivePriceInfo(getEffectivePrice(selectedVariant, newQuantity));
  };

  /* ─── Add to cart (unchanged) ────────────────────────────── */
  const handleAddToCart = async () => {
    if (!selectedVariant) {
      if (product?.variants?.length > 0) {
        setIsAddingToCart(true);
        setCartSuccess(false);
        try {
          const result = await addVariantToCart(product.variants[0], quantity, product.name);
          if (result.success) {
            setCartSuccess(true);
            setTimeout(() => setCartSuccess(false), 3000);
          }
        } catch (err) {
          console.error("Error adding to cart:", err);
        } finally {
          setIsAddingToCart(false);
        }
      }
      return;
    }
    setIsAddingToCart(true);
    setCartSuccess(false);
    try {
      const result = await addVariantToCart(selectedVariant, quantity, product.name);
      if (result.success) {
        setCartSuccess(true);
        setTimeout(() => setCartSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
    } finally {
      setIsAddingToCart(false);
    }
  };

  /* ─── Buy now (unchanged) ────────────────────────────────── */
  const handleBuyNow = async () => {
    const variantToUse =
      selectedVariant ||
      (product?.variants?.length > 0 ? product.variants[0] : null);
    if (!variantToUse) return;
    setIsAddingToCart(true);
    try {
      const result = await addVariantToCart(variantToUse, quantity, product.name);
      if (result.success) router.push("/checkout");
    } catch (err) {
      console.error("Error adding to cart:", err);
    } finally {
      setIsAddingToCart(false);
    }
  };

  /* ─── Wishlist toggle (unchanged) ───────────────────────── */
  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      router.push(`/auth?redirect=/products/${slug}`);
      return;
    }
    setIsAddingToWishlist(true);
    try {
      if (isInWishlist) {
        const wishlistResponse = await fetchApi("/users/wishlist", { credentials: "include" });
        const wishlistItem = wishlistResponse.data.wishlistItems.find(
          (item) => item.productId === product.id
        );
        if (wishlistItem) {
          await fetchApi(`/users/wishlist/${wishlistItem.id}`, { method: "DELETE", credentials: "include" });
          setIsInWishlist(false);
        }
      } else {
        await fetchApi("/users/wishlist", {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ productId: product.id }),
        });
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  /* ─── Image URL helper (unchanged) ──────────────────────── */
  const getImageUrl = (image) => {
    if (!image) return "/images/product-placeholder.jpg";
    if (image.startsWith("http")) return image;
    return `https://desirediv-storage.blr1.cdn.digitaloceanspaces.com/${image}`;
  };

  /* ─── Image renderer ────────────────────────────────────────
     Shows the SELECTED VARIANT's images when available.
     Falls back to product-level images, then first variant's images.
  ──────────────────────────────────────────────────────────── */
  const renderImages = () => {
    // Priority: selected variant images → product images → any variant images
    let imagesToShow = [];
    if (selectedVariant?.images?.length > 0) {
      imagesToShow = selectedVariant.images;
    } else if (product?.images?.length > 0) {
      imagesToShow = product.images;
    } else if (product?.variants?.length > 0) {
      const variantWithImages = product.variants.find((v) => v.images?.length > 0);
      if (variantWithImages) imagesToShow = variantWithImages.images;
    }

    const noImage = (
      <div className="relative aspect-square w-full bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center">
        <div className="text-gray-300 text-center p-8">
          <div className="w-16 h-16 mx-auto mb-3 opacity-30">
            <Image src="/images/product-placeholder.jpg" alt="" width={64} height={64} className="object-contain" />
          </div>
          <p className="text-xs text-gray-400">No image available</p>
        </div>
      </div>
    );

    if (imagesToShow.length === 0) return noImage;

    // Determine active main image
    const fallbackMain = imagesToShow.find((img) => img.isPrimary) || imagesToShow[0];
    const activeMain   =
      mainImage && imagesToShow.some((img) => img.url === mainImage.url)
        ? mainImage
        : fallbackMain;

    if (imagesToShow.length === 1) {
      return (
        <div className="sticky top-8">
          <div className="relative aspect-square w-full bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <Image
              src={getImageUrl(activeMain.url)}
              alt={product?.name || "Product"}
              fill
              className="object-contain p-4"
              priority
            />
          </div>
        </div>
      );
    }

    return (
      <div className="sticky top-8 space-y-3">
        {/* Main image */}
        <div className="relative aspect-square w-full bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          <Image
            src={getImageUrl(activeMain?.url)}
            alt={product?.name || "Product"}
            fill
            className="object-contain p-4"
            priority
          />
        </div>
        {/* Thumbnails */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {imagesToShow.map((image, index) => (
            <button
              key={index}
              onClick={() => setMainImage(image)}
              className={`relative flex-shrink-0 w-16 h-16 bg-gray-50 rounded-xl overflow-hidden
                          border-2 transition-all ${
                            activeMain?.url === image.url
                              ? "border-orange-500 shadow-sm shadow-orange-200"
                              : "border-gray-200 hover:border-orange-300"
                          }`}
            >
              <Image
                src={getImageUrl(image.url)}
                alt={`View ${index + 1}`}
                fill
                className="object-contain p-1.5"
              />
            </button>
          ))}
        </div>
      </div>
    );
  };

  /* ─── Discount helper (unchanged) ───────────────────────── */
  const calculateDiscount = (regularPrice, salePrice) => {
    if (!regularPrice || !salePrice || regularPrice <= salePrice) return 0;
    return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
  };

  /* ─── Price display (unchanged logic, improved styling) ─── */
  const getPriceDisplay = () => {
    if (initialLoading) {
      return <div className="h-10 w-40 bg-gray-100 animate-pulse rounded-xl" />;
    }

    if (priceVisibilitySettings === null) {
      return (
        <div className="space-y-1">
          <span className="text-2xl font-bold text-gray-400">Login to view price</span>
          <p className="text-sm text-gray-500">Please log in to see pricing</p>
        </div>
      );
    }

    if (selectedVariant) {
      const priceInfo     = effectivePriceInfo || getEffectivePrice(selectedVariant, quantity);
      if (!priceInfo) {
        return <span className="text-2xl font-bold text-gray-400">Price not available</span>;
      }

      const effectivePrice = priceInfo.price;
      const originalPrice  = priceInfo.originalPrice;
      const isSlabPrice    = priceInfo.source === "SLAB";
      const discount =
        originalPrice > effectivePrice ? calculateDiscount(originalPrice, effectivePrice) : 0;

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
            <span className="text-3xl md:text-4xl font-black text-orange-600">
              {formatCurrency(effectivePrice)}
            </span>
            {originalPrice > effectivePrice && (
              <>
                <span className="text-xl text-gray-400 line-through">
                  {formatCurrency(originalPrice)}
                </span>
                {discount > 0 && (
                  <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {discount}% OFF
                  </span>
                )}
              </>
            )}
          </div>
          {isSlabPrice && (
            <p className="text-xs text-emerald-600 font-semibold">
              ✓ Bulk pricing applied for {quantity} units
            </p>
          )}
          <p className="text-xs text-gray-400">Inclusive of all taxes</p>
        </div>
      );
    }

    if (product) {
      const basePrice    = product.basePrice    || 0;
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
              <span className="text-3xl md:text-4xl font-black text-orange-600">
                {formatCurrency(basePrice)}
              </span>
              <span className="text-xl text-gray-400 line-through">
                {formatCurrency(regularPrice)}
              </span>
              {discount > 0 && (
                <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
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
            <span className="text-3xl md:text-4xl font-black text-orange-600">
              {formatCurrency(basePrice)}
            </span>
            <p className="text-xs text-gray-400 block">Inclusive of all taxes</p>
          </div>
        );
      }
    }

    return <span className="text-2xl font-bold text-gray-400">Price not available</span>;
  };

  /* ─── Loading state ──────────────────────────────────────── */
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center h-64 gap-5">
          <div className="w-12 h-12 border-[3px] border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-gray-500">Loading product details…</p>
        </div>
      </div>
    );
  }

  /* ─── Error state ────────────────────────────────────────── */
  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="bg-red-50 p-8 rounded-2xl border border-red-100 flex flex-col items-center text-center">
          <AlertCircle className="text-red-500 h-12 w-12 mb-4" />
          <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Product</h2>
          <p className="text-red-600 mb-6 text-sm">{error}</p>
          <Link href="/products">
            <Button className="gap-2">
              <ChevronRight className="h-4 w-4" /> Browse Other Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  /* ─── Not found state ────────────────────────────────────── */
  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="bg-orange-50 p-8 rounded-2xl border border-orange-100 flex flex-col items-center text-center">
          <AlertCircle className="text-orange-500 h-12 w-12 mb-4" />
          <h2 className="text-xl font-bold text-orange-700 mb-2">Product Not Found</h2>
          <p className="text-orange-600 mb-6 text-sm">
            The product you are looking for does not exist or has been removed.
          </p>
          <Link href="/products">
            <Button className="gap-2">
              <ChevronRight className="h-4 w-4" /> Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  /* ─── Effective variant flag ────────────────────────────────
     Use DB hasVariants OR derive it from actual variant count.
     This handles cases where admin forgot to toggle hasVariants.
  ──────────────────────────────────────────────────────────── */
  const effectiveHasVariants =
    product.hasVariants === true ||
    (Array.isArray(product.variants) && product.variants.length > 1);

  /* ─── Helper: human-readable label for a variant ────────── */
  const getVariantLabel = (variant) => {
    if (Array.isArray(variant.attributes) && variant.attributes.length > 0) {
      return variant.attributes
        .map((a) => a.value || a.attributeValue?.value)
        .filter(Boolean)
        .join(" · ");
    }
    // Fallback: clean up SKU (strip leading dash, replace hyphens with spaces)
    return variant.sku.replace(/^-+/, "").replace(/-/g, " ");
  };

  /* ─── Action button disabled state ──────────────────────── */
  const isOutOfStock =
    selectedVariant
      ? (selectedVariant.stock ?? selectedVariant.quantity ?? 0) < 1
      : !product?.variants?.length || (product.variants[0]?.quantity ?? 0) < 1;

  /* ════════════════════════════════════════════════════════════
     MAIN RENDER
  ════════════════════════════════════════════════════════════ */
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">

        {/* ── Breadcrumbs ── */}
        <nav className="flex items-center flex-wrap gap-1 text-xs text-gray-400 mb-8">
          <Link href="/"        className="hover:text-orange-600 transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/products" className="hover:text-orange-600 transition-colors">Products</Link>
          {(product?.category || product?.categories?.[0]?.category) && (
            <>
              <ChevronRight className="h-3 w-3" />
              <Link
                href={`/category/${product.category?.slug || product.categories[0]?.category?.slug}`}
                className="hover:text-orange-600 transition-colors capitalize"
              >
                {product.category?.name || product.categories[0]?.category?.name}
              </Link>
            </>
          )}
          <ChevronRight className="h-3 w-3" />
          <span className="text-orange-600 font-medium truncate max-w-[200px] sm:max-w-none">
            {product?.name}
          </span>
        </nav>

        {/* ── Two-column product layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">

          {/* LEFT — Images */}
          <div className="w-full">
            {loading ? (
              <div className="aspect-square w-full bg-orange-50 rounded-2xl animate-pulse" />
            ) : error ? (
              <div className="aspect-square w-full bg-red-50 rounded-2xl flex items-center justify-center">
                <div className="text-center p-6">
                  <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              </div>
            ) : renderImages()}
          </div>

          {/* RIGHT — Product details */}
          <div className="flex flex-col gap-5">

            {/* Brand link — only if brand object has a name and slug */}
            {product.brand?.name && product.brand?.slug && (
              <Link
                href={`/brand/${product.brand.slug}`}
                className="text-orange-500 text-sm font-semibold hover:text-orange-600 transition-colors"
              >
                {product.brand.name}
              </Link>
            )}

            {/* Product name */}
            <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating — only render when real data exists */}
            {product.avgRating > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 md:h-5 md:w-5"
                      fill={i < Math.round(product.avgRating) ? "currentColor" : "none"}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {product.avgRating}
                  {product.reviewCount > 0 && ` (${product.reviewCount} reviews)`}
                </span>
              </div>
            )}

            {/* Flash Sale banner */}
            {product.flashSale?.isActive && (
              <div className="p-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl shadow-lg shadow-orange-200">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⚡</span>
                    <div>
                      <p className="font-bold">Flash Sale</p>
                      <p className="text-sm opacity-90">{product.flashSale.name}</p>
                    </div>
                  </div>
                  <div className="bg-white/25 px-4 py-2 rounded-full">
                    <span className="font-black text-xl">{product.flashSale.discountPercentage}% OFF</span>
                  </div>
                </div>
              </div>
            )}

            {/* Price block */}
            <div className="p-5 bg-orange-50/60 rounded-2xl border border-orange-100">
              {product.flashSale?.isActive ? (
                <div className="space-y-2">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-3xl md:text-4xl font-black text-orange-600">
                      {formatCurrency(product.flashSale.flashSalePrice)}
                    </span>
                    <span className="text-xl text-gray-400 line-through">
                      {formatCurrency(product.basePrice)}
                    </span>
                    <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      ⚡ {product.flashSale.discountPercentage}% OFF
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Inclusive of all taxes · Flash Sale Price</p>
                </div>
              ) : (
                getPriceDisplay()
              )}
            </div>

            {/* Short description */}
            {product.shortDescription && (
              <div className="p-4 border border-gray-100 rounded-xl bg-white">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {product.shortDescription}
                </p>
              </div>
            )}

            {/* ── Course-specific info panel ──
                Only show faculty/type/duration/batch/digital fields.
                Attempts, modes, bookOptions are handled by variant selectors.
            ── */}
            {(product.facultyName || product.duration || product.batchStartDate ||
              product.courseType || product.digitalEnabled) && (
              <div className="rounded-xl border border-orange-100 bg-orange-50/40 overflow-hidden">
                <div className="px-4 py-2.5 bg-orange-100/50 border-b border-orange-100">
                  <p className="text-[11px] font-bold text-orange-700 uppercase tracking-widest">Course Details</p>
                </div>
                <div className="p-4 flex flex-wrap gap-4 text-sm">
                  {product.facultyName && (
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">✓</span>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wide">Faculty</p>
                        <p className="font-semibold text-gray-900 text-sm">{product.facultyName}</p>
                      </div>
                    </div>
                  )}
                  {product.courseType && (
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wide">Type</p>
                      <p className="font-semibold text-gray-900 text-sm capitalize">{product.courseType}</p>
                    </div>
                  )}
                  {product.duration && (
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wide">Duration</p>
                      <p className="font-semibold text-gray-900 text-sm">{product.duration}</p>
                    </div>
                  )}
                  {product.batchStartDate && (
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wide">Batch Start</p>
                      <p className="font-semibold text-gray-900 text-sm">
                        {new Date(product.batchStartDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  )}
                  {product.digitalEnabled && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-green-600 text-sm">⚡</span>
                      <p className="font-semibold text-green-700 text-sm">Instant Digital Access</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Attribute selection — only when product truly has variants */}
            {effectiveHasVariants && product.attributeOptions?.length > 0 && (
              <div className="space-y-4">
                {product.attributeOptions.map((attribute) => {
                  const availableValues = getAvailableValuesForAttribute(attribute.id);
                  const selectedValueId = selectedAttributes[attribute.id];
                  const selectedLabel   = availableValues.find((v) => v.id === selectedValueId)?.value;
                  return (
                    <div key={attribute.id}>
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2.5 flex items-center gap-2">
                        {attribute.name}
                        {selectedLabel && (
                          <span className="text-orange-600 font-semibold normal-case tracking-normal">
                            — {selectedLabel}
                          </span>
                        )}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {availableValues.length > 0 ? (
                          availableValues.map((value) => {
                            const isSelected  = selectedValueId === value.id;
                            const unavailable = isValueUnavailable(attribute.id, value.id);
                            const oos         = !unavailable && isValueOutOfStock(attribute.id, value.id);
                            return (
                              <button
                                key={value.id}
                                title={unavailable ? "Not available with current selection — click to switch" : oos ? "Out of stock" : undefined}
                                onClick={() => handleAttributeChange(attribute.id, value.id)}
                                className={`
                                  relative px-5 py-2.5 rounded-lg border text-sm font-semibold
                                  transition-all duration-150 select-none
                                  ${isSelected
                                    ? "border-orange-500 bg-orange-500 text-white shadow shadow-orange-200"
                                    : unavailable
                                      ? "border-gray-300 bg-white text-gray-400 hover:border-orange-400 hover:text-orange-500"
                                      : oos
                                        ? "border-gray-300 bg-white text-gray-500 line-through hover:border-orange-300"
                                        : "border-gray-300 bg-white text-gray-800 hover:border-orange-500 hover:text-orange-600"
                                  }
                                `}
                              >
                                {value.value}
                                {oos && !isSelected && (
                                  <span className="ml-1 text-[10px] font-normal no-underline text-gray-400">
                                    (sold out)
                                  </span>
                                )}
                              </button>
                            );
                          })
                        ) : (
                          <p className="text-sm text-gray-400">
                            No {attribute.name.toLowerCase()} options available
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── Fallback variant selector ──────────────────────────────
                Shows when product has multiple variants but no named
                attributes were assigned (e.g. batch/attempt variants).
            ──────────────────────────────────────────────────────────── */}
            {effectiveHasVariants &&
              (!product.attributeOptions || product.attributeOptions.length === 0) &&
              Array.isArray(product.variants) &&
              product.variants.length > 1 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Select Option
                  </h3>
                  <div className="flex flex-col gap-2">
                    {product.variants.map((variant) => {
                      const isSelected = selectedVariant?.id === variant.id;
                      const vPrice     = parseFloat(variant.salePrice || variant.price || 0);
                      const vOriginal  = parseFloat(variant.price || 0);
                      const vStock     = variant.stock ?? variant.quantity ?? 0;
                      const vOOS       = vStock < 1;
                      const label      = getVariantLabel(variant);
                      const discount   = vOriginal > vPrice
                        ? Math.round(((vOriginal - vPrice) / vOriginal) * 100)
                        : 0;

                      return (
                        <button
                          key={variant.id}
                          disabled={vOOS}
                          onClick={() => {
                            setSelectedVariant(variant);
                            setMainImage(null);
                            const moq = variant.moq || 1;
                            setQuantity(moq);
                            setEffectivePriceInfo(getEffectivePrice(variant, moq));
                          }}
                          className={`text-left w-full p-4 rounded-xl border-2 transition-all
                            ${isSelected
                              ? "border-orange-500 bg-orange-50/60 shadow-sm shadow-orange-100"
                              : "border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50/30"
                            }
                            ${vOOS ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            {/* Left: dot + label */}
                            <div className="flex items-start gap-2.5 min-w-0">
                              <span
                                className={`mt-1 w-3 h-3 rounded-full flex-shrink-0 border-2 transition-colors
                                  ${isSelected
                                    ? "border-orange-500 bg-orange-500"
                                    : "border-gray-300"
                                  }`}
                              />
                              <div className="min-w-0">
                                <p className={`text-sm font-semibold leading-snug
                                  ${isSelected ? "text-orange-700" : "text-gray-800"}`}>
                                  {label}
                                </p>
                                {vOOS && (
                                  <p className="text-xs text-red-500 mt-0.5">Out of stock</p>
                                )}
                              </div>
                            </div>

                            {/* Right: price */}
                            <div className="text-right flex-shrink-0">
                              <p className="text-sm font-bold text-orange-600">
                                {formatCurrency(vPrice)}
                              </p>
                              {vOriginal > vPrice && (
                                <div className="flex items-center gap-1.5 justify-end">
                                  <p className="text-xs text-gray-400 line-through">
                                    {formatCurrency(vOriginal)}
                                  </p>
                                  {discount > 0 && (
                                    <span className="text-[10px] bg-orange-100 text-orange-600
                                                     px-1.5 py-0.5 rounded font-bold">
                                      {discount}% OFF
                                    </span>
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

            {/* Cart success message */}
            {cartSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-700 text-sm rounded-xl flex items-center gap-2 border border-emerald-200">
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
                Item successfully added to your cart!
              </div>
            )}

            {/* MOQ notice — variant products only */}
            {effectiveHasVariants && selectedVariant?.moq && selectedVariant.moq > 1 && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-orange-800">
                    Minimum Order: {selectedVariant.moq} units
                  </p>
                  <p className="text-xs text-orange-600 mt-0.5">
                    You need to order at least {selectedVariant.moq} units
                  </p>
                </div>
              </div>
            )}

            {/* Qty + Stock — single row */}
            {effectiveHasVariants && (
              <div className="flex items-center justify-between gap-3">
                {/* Qty stepper */}
                <div className="flex items-center gap-3">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Qty</p>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                    <button
                      className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= (selectedVariant?.moq || 1) || isAddingToCart}
                    >
                      <Minus className="h-3 w-3 text-gray-600" />
                    </button>
                    <span className="w-10 text-center font-bold text-gray-900 text-sm border-x border-gray-200 py-2">
                      {quantity}
                    </span>
                    <button
                      className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      onClick={() => handleQuantityChange(1)}
                      disabled={
                        (selectedVariant &&
                          (selectedVariant.stock > 0 || selectedVariant.quantity > 0) &&
                          quantity >= (selectedVariant.stock || selectedVariant.quantity)) ||
                        isAddingToCart
                      }
                    >
                      <Plus className="h-3 w-3 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Stock status — updates with selected variant */}
                {selectedVariant && (
                  <div className="flex items-center gap-1.5 text-sm">
                    {(selectedVariant.stock ?? selectedVariant.quantity ?? 0) > 0 ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                        <span className="text-emerald-700 font-medium">
                          In Stock ({selectedVariant.stock ?? selectedVariant.quantity})
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                        <span className="text-red-600 font-medium">Out of stock</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── CTA: Add to Cart + Wishlist ── */}
            <div className="flex gap-3 pt-1">
              <Button
                className="flex-1 h-12 text-sm font-bold rounded-xl gap-2
                           bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white border-0
                           shadow-md shadow-orange-500/25 hover:shadow-orange-500/40 transition-all"
                size="lg"
                onClick={handleAddToCart}
                disabled={isAddingToCart || isOutOfStock}
              >
                {isAddingToCart ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding…
                  </>
                ) : isOutOfStock ? (
                  "Out of Stock"
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={`h-12 w-12 rounded-xl flex-shrink-0 border-2 transition-colors ${
                  isInWishlist
                    ? "border-red-400 bg-red-50 text-red-500"
                    : "border-gray-200 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-500"
                }`}
                onClick={handleAddToWishlist}
                disabled={isAddingToWishlist}
              >
                {isInWishlist ? <RiHeartFill className="h-5 w-5" /> : <RiHeartLine className="h-5 w-5" />}
              </Button>
            </div>

            {/* ── Trust indicators ── */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: Shield,   label: "Secure Payment" },
                { icon: Award,    label: "Authentic Content" },
                { icon: RefreshCw,label: "Support Available" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 rounded-xl">
                  <item.icon className="h-4 w-4 text-orange-500" />
                  <span className="text-[10px] text-gray-600 font-medium text-center leading-tight">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* ── Product metadata ── */}
            <div className="pt-4 border-t border-gray-100 space-y-3 text-sm">
              {selectedVariant?.sku && (
                <div className="flex gap-3">
                  <span className="font-semibold w-24 text-gray-500 flex-shrink-0">SKU</span>
                  <span className="text-gray-700 font-mono">{selectedVariant.sku}</span>
                </div>
              )}
              {product.category && (
                <div className="flex gap-3">
                  <span className="font-semibold w-24 text-gray-500 flex-shrink-0">Category</span>
                  <Link
                    href={`/category/${product.category?.slug}`}
                    className="text-orange-600 hover:underline"
                  >
                    {product.category?.name}
                  </Link>
                </div>
              )}

              {/* Digital product badge */}
              {product.digitalEnabled && (
                <div className="flex items-center gap-2 pt-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                    ⚡ Instant Access — Digital Product
                  </span>
                </div>
              )}
            </div>

            {/* ── Sample Book Download ── */}
            {product.sampleBookUrl && (
              <div className="mt-4 p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Sample Book Available</p>
                  <p className="text-xs text-gray-500 mt-0.5">Preview a sample before purchasing</p>
                </div>
                <a
                  href={`https://desirediv-storage.blr1.digitaloceanspaces.com/${product.sampleBookUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  ↓ Download Sample
                </a>
              </div>
            )}
          </div>
        </div>

        {/* ── Sticky mobile CTA ── */}
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-gray-100 px-4 py-3 flex gap-3 shadow-xl">
          <Button
            className="flex-1 h-12 text-sm font-bold rounded-xl gap-2
                       bg-orange-500 hover:bg-orange-600 text-white border-0
                       shadow-md shadow-orange-500/25"
            onClick={handleAddToCart}
            disabled={isAddingToCart || isOutOfStock}
          >
            {isAddingToCart ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Adding…
              </>
            ) : isOutOfStock ? (
              "Out of Stock"
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={`h-12 w-12 rounded-xl flex-shrink-0 border-2 transition-colors ${
              isInWishlist
                ? "border-red-400 bg-red-50 text-red-500"
                : "border-gray-200 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-500"
            }`}
            onClick={handleAddToWishlist}
            disabled={isAddingToWishlist}
          >
            {isInWishlist ? <RiHeartFill className="h-5 w-5" /> : <RiHeartLine className="h-5 w-5" />}
          </Button>
        </div>

        {/* ── Product tabs ── */}
        <div className="mb-16 pb-20 lg:pb-0">
          <div className="border-b border-gray-100">
            <div className="flex overflow-x-auto gap-1">
              {[
                { key: "description", label: "Description" },
                { key: "reviews",     label: `Reviews (${product.reviewCount || 0})` },
                ...(product.sampleNotes
                  ? [{ key: "sample_notes", label: "Sample Notes" }]
                  : []),
                ...(() => {
                  try {
                    const ai = product.additionalInfo
                      ? (typeof product.additionalInfo === "string"
                          ? JSON.parse(product.additionalInfo)
                          : product.additionalInfo)
                      : [];
                    return Array.isArray(ai) && ai.length > 0
                      ? [{ key: "additional_info", label: "More Info" }]
                      : [];
                  } catch { return []; }
                })(),
              ].map(({ key, label }) => (
                <button
                  key={key}
                  className={`px-5 py-3 text-sm font-semibold uppercase tracking-wide whitespace-nowrap transition-colors ${
                    activeTab === key
                      ? "border-b-2 border-orange-500 text-orange-600"
                      : "text-gray-400 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="py-8">
            {activeTab === "description" && (
              <div className="prose max-w-none">
                <div
                  className="text-gray-700 leading-relaxed mb-6 [&_p:empty]:hidden [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-semibold [&_strong]:font-semibold [&_a]:text-orange-600 [&_a]:underline"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }}
                />
                {product.directions && (
                  <div className="mt-8 p-6 bg-orange-50 rounded-2xl border border-orange-100">
                    <h3 className="text-lg font-bold mb-3 text-orange-700">Directions for Use</h3>
                    <p className="text-gray-700 leading-relaxed">{product.directions}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && <ReviewSection product={product} />}

            {activeTab === "sample_notes" && (
              <div className="prose max-w-none">
                <div className="p-5 bg-orange-50 rounded-2xl border border-orange-100">
                  <h3 className="text-lg font-bold mb-3 text-orange-700">Sample Notes</h3>
                  <div
                    className="text-gray-700 leading-relaxed [&_p:empty]:hidden [&_p]:mb-2"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.sampleNotes) || "No sample notes available." }}
                  />
                  {product.sampleNotes?.startsWith("http") && (
                    <a
                      href={product.sampleNotes}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:underline font-semibold text-sm mt-3 inline-block"
                    >
                      Download / View Notes →
                    </a>
                  )}
                </div>
              </div>
            )}

            {activeTab === "additional_info" && (() => {
              let items = [];
              try {
                const raw = product.additionalInfo;
                items = raw
                  ? (typeof raw === "string" ? JSON.parse(raw) : raw)
                  : [];
                if (!Array.isArray(items)) items = [];
              } catch { items = []; }
              return (
                <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                  <table className="w-full text-sm">
                    <tbody>
                      {items.map((item, idx) => (
                        <tr key={idx} className={`border-b last:border-0 border-gray-100 ${idx % 2 === 0 ? "bg-orange-50/40" : "bg-white"}`}>
                          <td className="px-5 py-3.5 font-semibold text-gray-800 w-1/3 border-r border-gray-100">
                            {item.title}
                          </td>
                          <td className="px-5 py-3.5 text-gray-600">{item.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })()}
          </div>
        </div>

        {/* ── Related Products ── */}
        {relatedProducts?.length > 0 && (
          <div className="pb-10">
            <div className="flex items-center gap-4 mb-8">
              <div>
                <h2 className="font-display text-2xl font-bold text-gray-900">
                  Related Products
                </h2>
                <div className="divider-orange mt-2" />
              </div>
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
