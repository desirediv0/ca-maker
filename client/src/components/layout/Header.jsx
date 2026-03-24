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
} from "react-icons/ri";

/* ── Nav link ── */
function NavLink({ href, name, pathname, onClick }) {
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        text-sm font-medium transition-colors duration-200
        ${isActive
          ? "text-[#F97316]"
          : "text-[#374151] hover:text-[#F97316]"
        }
      `}
    >
      {name}
    </Link>
  );
}

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartItemCount } = useCart();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsDrawerOpen(false);
    setIsProfileOpen(false);
    setIsSearchOpen(false);
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
    if (isSearchOpen) searchRef.current?.focus();
  }, [isSearchOpen]);

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isDrawerOpen]);

  const handleSearch = (e, closeDrawer = false) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsSearchOpen(false);
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
    { name: "Courses", href: "/courses" },
    { name: "Categories", href: "/categories" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
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
        className="sticky top-0 z-40 w-full bg-white shadow-sm border-b border-[#E5E7EB] transition-all duration-300"
      >

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 h-16">
            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-1.5 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="CA Maker"
                width={140}
                height={44}
                className="h-10 w-auto"
                priority
              />
              <span className="w-2 h-2 rounded-full bg-[#F97316] hidden sm:block" />
            </Link>

            {/* ── Desktop Nav ── */}
            <nav className="hidden lg:flex items-center justify-center flex-1 gap-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  name={link.name}
                  pathname={pathname}
                />
              ))}
            </nav>

            {/* ── Right Actions ── */}
            <div className="flex items-center gap-1 ml-auto lg:ml-0">

              {/* Search */}
              <div className="hidden md:flex items-center">
                {isSearchOpen ? (
                  <form onSubmit={handleSearch} className="flex items-center gap-1 animate-slide-up">
                    <div className="relative">
                      <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                      <input
                        ref={searchRef}
                        type="text"
                        placeholder="Search courses…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-56 pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm
                          placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300
                          focus:border-orange-400 transition-all"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <RiCloseLine className="h-4 w-4" />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    aria-label="Search"
                    className="p-2.5 rounded-full text-gray-600 hover:text-orange-500 hover:bg-orange-50 transition-colors"
                  >
                    <RiSearchLine className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className="p-2.5 rounded-full text-gray-600 hover:text-orange-500 hover:bg-orange-50 transition-colors"
              >
                <RiHeartLine className="h-5 w-5" />
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                aria-label="Cart"
                className="relative p-2.5 rounded-full text-gray-600 hover:text-orange-500 hover:bg-orange-50 transition-colors"
              >
                <RiShoppingCartLine className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#F97316] text-white text-[10px] font-bold
                    rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>

              {/* Profile / Login */}
              {isAuthenticated ? (
                <div className="relative hidden lg:block" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-1.5 p-1.5 rounded-full hover:bg-orange-50 transition-colors"
                  >
                    <span className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full
                      flex items-center justify-center text-white font-bold text-sm select-none">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                    <RiArrowDownSLine
                      className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isProfileOpen && (
                    <div
                      className="absolute right-0 mt-2 w-52 bg-white rounded border border-gray-100/80 py-2 z-50"
                      style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.12)" }}
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-900 text-sm truncate">{user?.name}</p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{user?.email}</p>
                      </div>
                      {profileLinks.map(({ href, icon: Icon, label }) => (
                        <Link
                          key={href}
                          href={href}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        >
                          <Icon className="h-4 w-4 text-gray-400" />
                          {label}
                        </Link>
                      ))}
                      <div className="border-t border-gray-100 mt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <RiLogoutBoxLine className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/auth"
                    className="hidden lg:flex items-center gap-2 px-4 py-2.5
                      border border-[#E5E7EB] rounded text-sm font-medium text-[#374151]
                      hover:border-[#F97316] hover:text-[#F97316] transition-all"
                  >
                    <RiUserLine className="h-4 w-4" />
                    Login
                  </Link>
                  <Link
                    href="/courses"
                    className="hidden lg:flex items-center gap-2 px-5 py-2.5
                      bg-[#F97316] hover:bg-[#EA580C] text-white rounded text-sm font-semibold
                      transition-all duration-200"
                  >
                    Start Learning
                  </Link>
                </>
              )}

              {/* Hamburger */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                aria-label="Open menu"
                className="lg:hidden p-2.5 rounded text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <RiMenuLine className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ─── MOBILE DRAWER ─── */}
      <div
        className={`
          fixed inset-0 z-50 lg:hidden
          bg-black/50 backdrop-blur-sm
          transition-opacity duration-300
          ${isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={() => setIsDrawerOpen(false)}
      />

      <div
        className={`
          fixed top-0 right-0 bottom-0 z-50 lg:hidden
          w-[300px] bg-white shadow-2xl flex flex-col
          transition-transform duration-300 ease-out
          ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <Link href="/" onClick={() => setIsDrawerOpen(false)}>
            <Image src="/logo.png" alt="CA Maker" width={110} height={44} className="h-9 w-auto" />
          </Link>
          <button
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Close menu"
            className="p-2 rounded text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <RiCloseLine className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile search */}
        <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
          <form onSubmit={(e) => handleSearch(e, true)}>
            <div className="relative">
              <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded text-sm
                  placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
              />
            </div>
          </form>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsDrawerOpen(false)}
                className={`
                  flex items-center px-4 py-3 rounded text-sm font-semibold transition-colors
                  ${isActive
                    ? "bg-orange-50 text-orange-600 border-l-[3px] border-orange-500 pl-[13px]"
                    : "text-gray-700 hover:bg-gray-50 hover:text-orange-600"
                  }
                `}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Auth */}
        <div className="border-t border-gray-100 px-4 py-4 flex-shrink-0">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 px-2 py-2 mb-3">
                <span className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded
                  flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{user?.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>
              {profileLinks.map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsDrawerOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  <Icon className="h-4 w-4 text-gray-400" />
                  {label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded text-sm text-red-600 hover:bg-red-50 transition-colors mt-1"
              >
                <RiLogoutBoxLine className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              onClick={() => setIsDrawerOpen(false)}
              className="flex items-center justify-center gap-2 py-3
                bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded text-sm font-semibold transition-colors"
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
