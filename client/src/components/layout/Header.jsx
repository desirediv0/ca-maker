"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import {
  RiSearchLine,
  RiCloseLine,
  RiMenuLine,
  RiUserLine,
  RiShoppingCartLine,
  RiHeartLine,
  RiLogoutBoxLine,
  RiArrowDownSLine,
  RiShoppingBagLine,
  RiArrowRightSLine,
} from "react-icons/ri";

/* ── Nav link ── */
function NavLink({ href, name, pathname, onClick }) {
  const isActive =
    pathname === href || (href !== "/" && pathname.startsWith(href));
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        relative text-base font-semibold tracking-wide transition-colors duration-200 py-1
        ${isActive
          ? "text-blue-600"
          : "text-gray-600 hover:text-blue-600"
        }
      `}
    >
      {name}
      {/* Active indicator */}
      <span
        className={`absolute -bottom-[4px] left-0 right-0 h-[2px] rounded-full transition-all duration-300
          ${isActive ? "bg-blue-600 opacity-100" : "bg-blue-600 opacity-0"}`}
      />
    </Link>
  );
}

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartItemCount } = useCart();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    setIsDrawerOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 5);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  const handleSearch = (e, closeDrawer = false) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/courses?search=${encodeURIComponent(searchQuery.trim())}`
      );
      setSearchQuery("");
      if (closeDrawer) setIsDrawerOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsDrawerOpen(false);
    router.push("/");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Lectures & Books", href: "/courses" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
    { name: "Support", href: "/contact" },
  ];

  const profileLinks = [
    { href: "/account", icon: RiUserLine, label: "My Profile" },
    { href: "/account/orders", icon: RiShoppingBagLine, label: "My Orders" },
    { href: "/wishlist", icon: RiHeartLine, label: "Wishlist" },
  ];

  const cartCount = getCartItemCount();

  return (
    <>
      {/* ─── MAIN HEADER ─── */}
      <header
        className={`sticky top-0 z-40 w-full transition-shadow duration-300 ${scrolled ? "shadow-lg" : "shadow-sm"
          }`}
      >
        {/* ── Top Row ── */}
        <div
          style={{
            background:
              "linear-gradient(135deg, #1E40AF 0%, #2563EB 50%, #3B82F6 100%)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-6 h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">

                <span className="text-white text-lg font-extrabold tracking-tight">
                  CA Maker
                </span>
              </Link>

              {/* Search Bar */}
              <div className="hidden md:flex items-center flex-1 max-w-xl mx-auto">
                <form onSubmit={handleSearch} className="w-full">
                  <div className="relative">
                    <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      ref={searchRef}
                      type="text"
                      placeholder="Search courses, lectures, books…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-24 py-2.5 bg-white/95 backdrop-blur-sm rounded-xl text-sm
                                 text-gray-800 placeholder:text-gray-400
                                 focus:outline-none focus:ring-2 focus:ring-white/40 focus:bg-white
                                 transition-all duration-200"
                      style={{
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                      }}
                    />
                    <button
                      type="submit"
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 px-5 rounded-lg
                                 text-white text-xs font-bold transition-all duration-200
                                 hover:opacity-90 flex items-center gap-1.5"
                      style={{
                        background:
                          "linear-gradient(135deg, #1E40AF, #2563EB)",
                      }}
                    >
                      Search
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-1 ml-auto">
                {/* Wishlist */}
                <Link
                  href="/wishlist"
                  aria-label="Wishlist"
                  className="p-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10
                             transition-all duration-200"
                >
                  <RiHeartLine className="h-5 w-5" />
                </Link>

                {/* Cart */}
                <Link
                  href="/cart"
                  aria-label="Cart"
                  className="relative p-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10
                             transition-all duration-200"
                >
                  <RiShoppingCartLine className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span
                      className="absolute -top-0.5 -right-0.5 text-white text-[10px] font-bold
                                 rounded-full min-w-[18px] h-[18px] flex items-center justify-center
                                 px-1 leading-none"
                      style={{
                        background: "linear-gradient(135deg, #EF4444, #DC2626)",
                        boxShadow: "0 2px 6px rgba(239, 68, 68, 0.4)",
                      }}
                    >
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>

                {/* Divider */}
                <div className="hidden sm:block w-px h-6 bg-white/15 mx-1.5" />

                {/* Profile / Login */}
                {isAuthenticated ? (
                  <div className="relative hidden sm:block" ref={dropdownRef}>
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl
                                 hover:bg-white/10 transition-all duration-200"
                    >
                      <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center
                                   font-bold text-xs text-blue-700 select-none"
                        style={{
                          background: "rgba(255, 255, 255, 0.9)",
                          border: "1px solid rgba(255, 255, 255, 0.3)",
                        }}
                      >
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                      <RiArrowDownSLine
                        className={`h-4 w-4 text-white/70 transition-transform duration-200
                          ${isProfileOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* Dropdown */}
                    {isProfileOpen && (
                      <div
                        className="absolute right-0 mt-3 w-56 bg-white rounded-xl py-1.5 z-50
                                   border border-gray-100"
                        style={{
                          boxShadow:
                            "0 12px 40px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.04)",
                        }}
                      >
                        <div className="px-4 py-3 border-b border-gray-50">
                          <p className="font-bold text-gray-900 text-sm truncate">
                            {user?.name}
                          </p>
                          <p className="text-xs text-gray-400 truncate mt-0.5">
                            {user?.email}
                          </p>
                        </div>
                        <div className="py-1">
                          {profileLinks.map(({ href, icon: Icon, label }) => (
                            <Link
                              key={href}
                              href={href}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600
                                         hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            >
                              <Icon className="h-4 w-4 text-gray-400" />
                              {label}
                            </Link>
                          ))}
                        </div>
                        <div className="border-t border-gray-50 pt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm
                                       text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <RiLogoutBoxLine className="h-4 w-4" />
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/auth"
                    className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm
                               font-semibold text-blue-700 transition-all duration-200
                               hover:bg-white/95"
                    style={{
                      background: "rgba(255, 255, 255, 0.9)",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                    }}
                  >
                    <RiUserLine className="h-4 w-4" />
                    Login
                  </Link>
                )}

                {/* Mobile hamburger */}
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  aria-label="Open menu"
                  className="md:hidden p-2.5 rounded-xl text-white/80 hover:text-white
                             hover:bg-white/10 transition-all duration-200 ml-1"
                >
                  <RiMenuLine className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Nav Row ── */}
        <div className="hidden md:block bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-center gap-8 h-16">
              {navLinks.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  name={link.name}
                  pathname={pathname}
                />
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* ─── MOBILE DRAWER OVERLAY ─── */}
      <div
        className={`
          fixed inset-0 z-50 md:hidden bg-black/40 backdrop-blur-sm
          transition-opacity duration-300
          ${isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* ─── MOBILE DRAWER ─── */}
      <div
        className={`
          fixed top-0 right-0 bottom-0 z-50 md:hidden
          w-[300px] bg-white flex flex-col
          transition-transform duration-300 ease-out
          ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}
        `}
        style={{
          boxShadow: isDrawerOpen
            ? "-8px 0 32px rgba(0, 0, 0, 0.1)"
            : "none",
        }}
      >
        {/* Drawer header */}
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{
            background:
              "linear-gradient(135deg, #1E40AF, #2563EB)",
          }}
        >
          <Link
            href="/"
            onClick={() => setIsDrawerOpen(false)}
            className="flex items-center gap-2"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <span className="text-white text-xs font-extrabold">CA</span>
            </div>
            <span className="text-white text-base font-extrabold tracking-tight">
              CA Maker
            </span>
          </Link>
          <button
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Close menu"
            className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10
                       transition-colors"
          >
            <RiCloseLine className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile search */}
        <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
          <form onSubmit={(e) => handleSearch(e, true)}>
            <div className="relative">
              <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm
                           text-gray-800 placeholder:text-gray-400
                           focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white
                           transition-all duration-200"
                style={{ border: "1px solid #F0F0F0" }}
              />
            </div>
          </form>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsDrawerOpen(false)}
                className={`
                  flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold
                  transition-all duration-200
                  ${isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                {link.name}
                <RiArrowRightSLine
                  className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-gray-300"
                    }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Auth */}
        <div className="border-t border-gray-100 px-4 py-4 flex-shrink-0">
          {isAuthenticated ? (
            <>
              <div
                className="flex items-center gap-3 px-3 py-3 rounded-xl mb-3"
                style={{
                  background: "linear-gradient(170deg, #F8FAFF, #EFF6FF)",
                  border: "1px solid rgba(59, 130, 246, 0.06)",
                }}
              >
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center
                             font-bold text-sm text-white flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #1E40AF, #2563EB)",
                  }}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="space-y-0.5">
                {profileLinks.map(({ href, icon: Icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm
                               text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                  >
                    <Icon className="h-4 w-4 text-gray-400" />
                    {label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm
                             text-red-500 hover:bg-red-50 transition-colors"
                >
                  <RiLogoutBoxLine className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link
              href="/auth"
              onClick={() => setIsDrawerOpen(false)}
              className="flex items-center justify-center gap-2 py-3
                         text-white rounded-xl text-sm font-bold transition-all duration-300
                         hover:opacity-90"
              style={{
                background:
                  "linear-gradient(135deg, #1E40AF, #2563EB, #3B82F6)",
                boxShadow:
                  "0 4px 12px rgba(37, 99, 235, 0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
              }}
            >
              <RiUserLine className="h-4 w-4" />
              Login / Register
            </Link>
          )}
        </div>
      </div>
    </>
  );
}