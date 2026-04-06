"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchApi } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { CourseCard } from "../courses/CourseCard";

// Skeleton loader
const ProductSkeleton = () => (
  <div className="bg-white rounded overflow-hidden animate-pulse border border-gray-100">
    <div className="h-48 w-full bg-gradient-to-br from-gray-100 to-gray-200"></div>
    <div className="p-4">
      <div className="h-3 w-16 bg-gray-200 rounded-full mx-auto mb-2"></div>
      <div className="h-4 w-full bg-gray-100 rounded mb-2"></div>
      <div className="h-4 w-3/4 mx-auto bg-gray-100 rounded mb-3"></div>
      <div className="h-6 w-20 bg-gray-200 rounded-full mx-auto"></div>
    </div>
  </div>
);

export const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [api, setApi] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let response = await fetchApi("/courses/by-tag?tag=new&limit=12");

        if (!response?.data?.courses?.length) {
          response = await fetchApi("/courses?sort=createdAt&order=desc&limit=12");
          setProducts(response?.data?.courses || []);
        } else {
          setProducts(response.data.courses);
        }
      } catch (err) {
        console.error("Error fetching new arrivals:", err);
        setError(err.message || "Failed to fetch new arrivals");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!api || products.length === 0) return;
    const interval = window.setInterval(() => api.scrollNext(), 2000);
    return () => window.clearInterval(interval);
  }, [api, products.length]);

  if (error) {
    return null;
  }

  if (loading) {
    return (
      <section className="py-10 md:py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-3">
              <Sparkles className="w-4 h-4" />
              Just Arrived
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">New Arrivals</h2>
            <p className="text-gray-600 max-w-xl mx-auto text-sm">Fresh products just added to our collection</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(6)].map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-10 md:py-14 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-3">
            <Sparkles className="w-4 h-4" />
            Just Arrived
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">New Arrivals</h2>
          <p className="text-gray-600 max-w-xl mx-auto text-sm">Fresh products just added to our collection</p>
        </div>

        {/* Products Carousel */}
        <div className="relative">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {products.map((product, index) => (
                <CarouselItem
                  key={product.id || product.slug || index}
                  className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4 py-4"
                >
                  <CourseCard course={product} badge="new" />
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="absolute -left-2 md:left-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-white hover:bg-white hover:text-primary border-gray-200 text-gray-700 shadow-lg z-10" />
            <CarouselNext className="absolute -right-2 md:right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-white hover:bg-white hover:text-primary border-gray-200 text-gray-700 shadow-lg z-10" />
          </Carousel>
        </div>

        {/* View All Button */}
        <div className="text-center mt-6">
          <Link href="/courses?tag=new">
            <Button
              variant="outline"
              size="lg"
              className="border-blue-300 text-blue-600 hover:bg-blue-50 px-8 h-12
               rounded-2xl font-semibold"
            >
              View All New Arrivals
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
