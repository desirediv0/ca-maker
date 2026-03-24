"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { fetchApi, formatCurrency, formatDate } from "@/lib/utils";
import {
  Package,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  CreditCard,
  Smartphone,
  IndianRupee,
} from "lucide-react";

const STATUS_STYLE = {
  PENDING: { bg: "bg-yellow-100", text: "text-yellow-800", dot: "bg-yellow-500" },
  PROCESSING: { bg: "bg-orange-100", text: "text-orange-800", dot: "bg-orange-500" },
  SHIPPED: { bg: "bg-sky-100", text: "text-sky-800", dot: "bg-sky-500" },
  DELIVERED: { bg: "bg-green-100", text: "text-green-800", dot: "bg-green-500" },
  CANCELLED: { bg: "bg-red-100", text: "text-red-800", dot: "bg-red-500" },
  REFUNDED: { bg: "bg-purple-100", text: "text-purple-800", dot: "bg-purple-500" },
};

const PAYMENT_ICON = {
  CARD: CreditCard,
  NETBANKING: IndianRupee,
  WALLET: IndianRupee,
  UPI: Smartphone,
  EMI: CreditCard,
  OTHER: IndianRupee,
};

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") ? parseInt(searchParams.get("page")) : 1;

  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, pages: 0 });
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;
      setLoadingOrders(true);
      setError("");
      try {
        const res = await fetchApi(`/payment/orders?page=${page}&limit=10`, { credentials: "include" });
        setOrders(res.data.orders || []);
        setPagination(res.data.pagination || { total: 0, page: 1, limit: 10, pages: 0 });
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load your orders. Please try again later.");
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [isAuthenticated, page]);

  const changePage = (p) => {
    if (p < 1 || p > pagination.pages) return;
    router.push(`/account/orders?page=${p}`);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">My Orders</h1>
        <div className="w-10 h-1 bg-orange-500 rounded-full" />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 text-sm">
          {error}
        </div>
      )}

      {loadingOrders ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded border border-gray-100 p-5 animate-pulse">
              <div className="flex justify-between mb-4">
                <div className="h-4 bg-gray-200 rounded w-32" />
                <div className="h-6 bg-gray-200 rounded-full w-24" />
              </div>
              <div className="h-3 bg-gray-100 rounded w-48 mb-3" />
              <div className="h-10 bg-gray-100 rounded w-full" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded border border-gray-100 p-16 text-center"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <div className="w-16 h-16 bg-orange-100 rounded flex items-center justify-center mx-auto mb-5">
            <ShoppingBag className="h-8 w-8 text-orange-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
          <p className="text-gray-500 mb-6 text-sm">You haven&apos;t placed any orders yet.</p>
          <Link href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded font-semibold text-sm transition-colors">
            Browse Courses <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const s = STATUS_STYLE[order.status] || STATUS_STYLE.PENDING;
            const PayIcon = PAYMENT_ICON[order.paymentMethod] || IndianRupee;
            return (
              <div
                key={order.id}
                className="bg-white rounded border border-gray-100 overflow-hidden hover:border-orange-200 hover:shadow-md transition-all duration-200"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
              >
                {/* Top bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-orange-100 rounded flex items-center justify-center flex-shrink-0">
                      <Package className="h-4 w-4 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">#{order.orderNumber}</p>
                      <p className="text-xs text-gray-400">{formatDate(order.date)}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                    {order.status}
                  </span>
                </div>

                {/* Body */}
                <div className="px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-500">
                      <span className="font-semibold text-gray-900">{order.items.length}</span>{" "}
                      {order.items.length === 1 ? "item" : "items"}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <PayIcon className="h-4 w-4" />
                      {order.paymentMethod}
                    </div>
                    {order.discount > 0 && (
                      <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">
                        Saved {formatCurrency(order.discount)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-bold text-gray-900 text-base">{formatCurrency(order.total)}</span>
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded text-xs font-semibold transition-colors"
                    >
                      View <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button onClick={() => changePage(pagination.page - 1)} disabled={pagination.page === 1}
                className="p-2.5 bg-white border border-gray-200 rounded text-gray-500 hover:border-orange-300 disabled:opacity-40 transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-gray-600 px-2">
                Page <span className="font-semibold text-gray-900">{pagination.page}</span> of{" "}
                <span className="font-semibold text-gray-900">{pagination.pages}</span>
              </span>
              <button onClick={() => changePage(pagination.page + 1)} disabled={pagination.page === pagination.pages}
                className="p-2.5 bg-white border border-gray-200 rounded text-gray-500 hover:border-orange-300 disabled:opacity-40 transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
