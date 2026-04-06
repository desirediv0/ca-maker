"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { ClientOnly } from "@/components/client-only";
import { User, Package, MapPin, Heart, RotateCcw, LogOut } from "lucide-react";

const navItems = [
  { path: "/account", label: "Profile", icon: User },
  { path: "/account/orders", label: "Orders", icon: Package },
  { path: "/account/returns", label: "Returns", icon: RotateCcw },
  { path: "/account/addresses", label: "Addresses", icon: MapPin },
  { path: "/wishlist", label: "Wishlist", icon: Heart },
];

export default function AccountLayout({ children }) {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/auth");
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-[3px] border-blue-200 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  const isActive = (p) => pathname === p;
  const specialPages = ["/account/orders/", "/account/change-password", "/account/returns/"];
  const isSpecial = specialPages.some(
    (p) => pathname.startsWith(p) && pathname !== "/account/orders"
  );

  const handleLogout = () => { logout(); router.push("/"); };

  return (
    <ClientOnly>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {isSpecial ? (
            <div className="max-w-4xl mx-auto">{children}</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* ── Sidebar ── */}
              <aside className="lg:col-span-1">
                <div
                  className="bg-white rounded border border-gray-100 overflow-hidden sticky top-6"
                  style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
                >
                  {/* User badge */}
                  <div className="bg-gray-900 px-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-blue-500 rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-base">
                          {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-white text-sm truncate">{user?.name || "User"}</p>
                        <p className="text-gray-400 text-xs truncate">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Nav links */}
                  <nav className="p-3 space-y-1">
                    {navItems.map(({ path, label, icon: Icon }) => (
                      <Link
                        key={path}
                        href={path}
                        className={`flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-all duration-200 ${isActive(path)
                          ? "bg-blue-500 text-white shadow-sm"
                          : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                          }`}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        {label}
                      </Link>
                    ))}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-medium text-red-500 hover:bg-red-50 transition-colors duration-200"
                    >
                      <LogOut className="h-4 w-4 flex-shrink-0" />
                      Logout
                    </button>
                  </nav>
                </div>
              </aside>

              {/* ── Main ── */}
              <main className="lg:col-span-3 min-w-0">{children}</main>
            </div>
          )}
        </div>
      </div>
    </ClientOnly>
  );
}
