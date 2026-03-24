import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation, Navigate, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Resource, Action } from "@/types/admin";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Tags,
  LogOut,
  Menu,
  X,
  Tag,
  Ticket,
  Mail,
  MessageSquare,
  HelpCircle,
  CreditCard,
  RotateCcw,
  ChevronDown,
  Circle,
  Settings,
  Layers,
  Eye,
  Truck,
  Quote,
  BookOpen,
  Headphones,
  Bell,
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SafeRender } from "@/components/SafeRender";
import InventoryAlertNotification from "@/components/ui/InventoryAlertNotification";
import { useLanguage } from "@/context/LanguageContext";

interface NavItemProps {
  href: string;
  icon: ReactNode;
  title: string;
  onClick?: () => void;
  hasPermission: boolean;
}

const NavItem = ({
  href,
  icon,
  title,
  onClick,
  hasPermission = true,
}: NavItemProps) => {
  const location = useLocation();
  const isActive =
    location.pathname === href || location.pathname.startsWith(`${href}/`);

  if (!hasPermission) return null;

  return (
    <Link
      to={href}
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-3 rounded px-3 py-2.5 text-sm transition-all duration-200",
        isActive
          ? "bg-[#F97316] text-white font-semibold"
          : "text-[#94A3B8] hover:bg-[#1E293B] hover:text-white font-medium"
      )}
    >
      <span className={cn(
        "flex shrink-0 items-center justify-center text-[1.125rem]",
        isActive ? "text-white" : "text-[#64748B]"
      )}>
        {icon}
      </span>
      <span className="text-sm font-medium">{title}</span>
    </Link>
  );
};

interface CollapsibleNavItemProps {
  title: string;
  icon: ReactNode;
  children: Array<{
    href: string;
    title: string;
    icon?: ReactNode;
    hasPermission: boolean;
  }>;
  isOpen: boolean;
  onToggle: () => void;
  onClick?: () => void;
}

const CollapsibleNavItem = ({
  title,
  icon,
  children,
  isOpen,
  onToggle,
  onClick,
}: CollapsibleNavItemProps) => {
  const location = useLocation();
  const hasActiveChild = children.some(
    (child) =>
      child.hasPermission &&
      (location.pathname === child.href ||
        location.pathname.startsWith(`${child.href}/`))
  );

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    onToggle();
  };

  return (
    <div className="flex flex-col">
      <button
        onClick={handleToggle}
        className={cn(
          "relative flex items-center justify-between gap-3 rounded px-3 py-2.5 text-sm transition-all duration-200 w-full text-left",
          hasActiveChild
            ? "bg-[#F97316] text-white font-semibold"
            : "text-[#94A3B8] hover:bg-[#1E293B] hover:text-white font-medium"
        )}
      >
        <div className="flex items-center gap-3 flex-1">
          <span className={cn(
            "flex shrink-0 items-center justify-center text-[1.125rem]",
            hasActiveChild ? "text-white" : "text-[#64748B]"
          )}>
            {icon}
          </span>
          <span className="text-sm font-medium">{title}</span>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-300 ease-in-out flex-shrink-0",
            isOpen ? "rotate-180" : "rotate-0",
            hasActiveChild ? "text-white" : "text-[#94A3B8]"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="flex flex-col gap-0.5 pl-4 mt-1">
          {children.map((child) => {
            if (!child.hasPermission) return null;
            const isActive =
              location.pathname === child.href ||
              location.pathname.startsWith(`${child.href}/`);

            return (
              <Link
                key={child.href}
                to={child.href}
                onClick={onClick}
                className={cn(
                  "relative flex items-center gap-3 rounded px-3 py-2 text-sm transition-all duration-200 pl-5",
                  isActive
                    ? "text-[#F97316] font-medium bg-[#F97316]/10"
                    : "text-[#94A3B8] hover:bg-[#1E293B] hover:text-white font-normal"
                )}
              >
                {isActive && (
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-[#F97316]" />
                )}
                <span className={cn(
                  "flex shrink-0 items-center justify-center text-[0.875rem]",
                  isActive ? "text-[#F97316]" : "text-[#64748B]"
                )}>
                  {child.icon || (
                    <Circle className="h-2 w-2 fill-current" />
                  )}
                </span>
                <span className="text-sm">{child.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const hasPermissionFor = (
  admin: { role?: string; permissions?: string[] } | null,
  resource: Resource,
  action?: Action
): boolean => {
  if (admin?.role === "SUPER_ADMIN") return true;

  if (!admin?.permissions || !Array.isArray(admin.permissions)) return false;

  const resourcePrefix = `${resource}:`;

  if (action) {
    const permissionString = `${resource}:${action}`;
    return admin.permissions.some((perm: string) => perm === permissionString);
  } else {
    return admin.permissions.some((perm: string) =>
      perm.startsWith(resourcePrefix)
    );
  }
};

export default function DashboardLayout() {
  const { admin, isAuthenticated, logout, isLoading } = useAuth();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    products: false,
    orders: false,
    users: false,
    support: false,
    settings: false,
  });

  const location = useLocation();

  // Auto-open section if current path matches (accordion - only one open at a time)
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/courses") || path.startsWith("/brands") || path.startsWith("/categories") || path.startsWith("/attributes")) {
      setOpenSections({
        products: true,
        orders: false,
        users: false,
        support: false,
        settings: false,
      });
    } else if (path.startsWith("/orders") || path.startsWith("/return-requests") || path.startsWith("/coupons")) {
      setOpenSections({
        products: false,
        orders: true,
        users: false,
        support: false,
        settings: false,
      });
    } else if (path.startsWith("/users") || path.startsWith("/partner") || path.startsWith("/referrals")) {
      setOpenSections({
        products: false,
        orders: false,
        users: true,
        support: false,
        settings: false,
      });
    } else if (path.startsWith("/contact-management") || path.startsWith("/reviews-management") || path.startsWith("/faq-management")) {
      setOpenSections({
        products: false,
        orders: false,
        users: false,
        support: true,
        settings: false,
      });
    } else if (path.startsWith("/settings") || path.startsWith("/moq-settings") || path.startsWith("/pricing-slabs") || path.startsWith("/payment-settings") || path.startsWith("/payment-gateway-settings") || path.startsWith("/price-visibility-settings") || path.startsWith("/shiprocket-settings") || path.startsWith("/shipping-settings")) {
      setOpenSections({
        products: false,
        orders: false,
        users: false,
        support: false,
        settings: true,
      });
    } else {
      // Close all sections if on dashboard
      setOpenSections({
        products: false,
        orders: false,
        users: false,
        support: false,
        settings: false,
      });
    }
  }, [location.pathname]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => {
      const isCurrentlyOpen = prev[section];
      // If opening a section, close all others (accordion behavior)
      if (!isCurrentlyOpen) {
        return {
          products: false,
          orders: false,
          users: false,
          support: false,
          settings: false,
          [section]: true,
        };
      }
      // If closing, just close this section
      return {
        ...prev,
        [section]: false,
      };
    });
  };

  // Prevent body scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#F97316] border-t-transparent"></div>
          <p className="mt-4 text-lg text-[#64748B]">{t("admin.loading")}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-[240px] flex-col bg-[#0F172A] border-r border-[#1E293B] z-30 flex-shrink-0">
        <div className="flex h-16 items-center px-4 border-b border-[#1E293B]">
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 font-semibold text-white text-base"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded bg-[#F97316]">
              <span className="text-white font-bold text-sm">CA</span>
            </span>
            <span>CA Maker</span>
          </Link>
        </div>
        <nav className="flex-1 py-6 px-3 overflow-y-auto scrollbar-hide">
          <SafeRender>
            <div className="flex flex-col gap-1">
              {/* MAIN Section */}
              <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                MAIN
              </p>
              {/* Dashboard - Single Item */}
              <NavItem
                href="/dashboard"
                icon={<LayoutDashboard className="h-[1.125rem] w-[1.125rem]" />}
                title={t("nav.dashboard")}
                hasPermission={hasPermissionFor(
                  admin,
                  Resource.DASHBOARD,
                  Action.READ
                )}
              />

              {/* Courses - Collapsible */}
              <CollapsibleNavItem
                title={t("nav.courses")}
                icon={<BookOpen className="h-[1.125rem] w-[1.125rem]" />}
                isOpen={openSections.products}
                onToggle={() => toggleSection("products")}
                children={[
                  {
                    href: "/courses",
                    title: t("nav.all_courses"),
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.PRODUCTS,
                      Action.READ
                    ),
                  },
                  {
                    href: "/courses/add",
                    title: t("nav.add_course"),
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.PRODUCTS,
                      Action.CREATE
                    ),
                  },
                  {
                    href: "/brands",
                    title: t("nav.brands"),
                    icon: <Tags className="h-3 w-3" />,
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.BRANDS,
                      Action.READ
                    ),
                  },
                  {
                    href: "/categories",
                    title: t("nav.categories"),
                    icon: <Tags className="h-3 w-3" />,
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.CATEGORIES,
                      Action.READ
                    ),
                  },
                  {
                    href: "/attributes",
                    title: t("nav.attributes"),
                    icon: <Tag className="h-3 w-3" />,
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.PRODUCTS,
                      Action.READ
                    ),
                  },
                ]}
              />

              {/* Orders - Collapsible */}
              <CollapsibleNavItem
                title={t("nav.orders")}
                icon={<ShoppingCart className="h-[1.125rem] w-[1.125rem]" />}
                isOpen={openSections.orders}
                onToggle={() => toggleSection("orders")}
                children={[
                  {
                    href: "/orders",
                    title: t("nav.all_orders"),
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.ORDERS,
                      Action.READ
                    ),
                  },
                  {
                    href: "/return-requests",
                    title: t("nav.return_requests"),
                    icon: <RotateCcw className="h-3 w-3" />,
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.ORDERS,
                      Action.READ
                    ),
                  },
                  {
                    href: "/coupons",
                    title: t("nav.coupons"),
                    icon: <Ticket className="h-3 w-3" />,
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.COUPONS,
                      Action.READ
                    ),
                  },
                ]}
              />

              {/* MANAGEMENT Section */}
              <p className="px-3 mt-4 mb-2 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                MANAGEMENT
              </p>
              {/* Users - Collapsible */}
              <CollapsibleNavItem
                title={t("nav.users")}
                icon={<Users className="h-[1.125rem] w-[1.125rem]" />}
                isOpen={openSections.users}
                onToggle={() => toggleSection("users")}
                children={[
                  {
                    href: "/users",
                    title: t("nav.users"),
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.USERS,
                      Action.READ
                    ),
                  },
                  // {
                  //   href: "/partner",
                  //   title: t("nav.partners"),
                  //   icon: <Users className="h-3 w-3" />,
                  //   hasPermission:
                  //     admin?.role === "SUPER_ADMIN" ||
                  //     hasPermissionFor(admin, Resource.USERS, Action.READ),
                  // },
                  // {
                  //   href: "/referrals",
                  //   title: t("nav.referrals"),
                  //   icon: <Users className="h-3 w-3" />,
                  //   hasPermission: hasPermissionFor(
                  //     admin,
                  //     Resource.USERS,
                  //     Action.READ
                  //   ),
                  // },
                ]}
              />

              {/* Support - Collapsible */}
              <CollapsibleNavItem
                title={t("nav.support")}
                icon={<Headphones className="h-[1.125rem] w-[1.125rem]" />}
                isOpen={openSections.support}
                onToggle={() => toggleSection("support")}
                children={[
                  {
                    href: "/contact-management",
                    title: t("nav.contact"),
                    icon: <Mail className="h-3 w-3" />,
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.CONTACT,
                      Action.READ
                    ),
                  },
                  {
                    href: "/reviews-management",
                    title: t("nav.reviews"),
                    icon: <MessageSquare className="h-3 w-3" />,
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.REVIEWS,
                      Action.READ
                    ),
                  },
                  {
                    href: "/faq-management",
                    title: t("nav.faq"),
                    icon: <HelpCircle className="h-3 w-3" />,
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.FAQS,
                      Action.READ
                    ),
                  },
                  {
                    href: "/testimonials",
                    title: t("nav.testimonials"),
                    icon: <Quote className="h-3 w-3" />,
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.TESTIMONIALS,
                      Action.READ
                    ),
                  },
                ]}
              />

              {/* Settings - Collapsible */}
              <CollapsibleNavItem
                title={t("nav.settings")}
                icon={<Settings className="h-[1.125rem] w-[1.125rem]" />}
                isOpen={openSections.settings}
                onToggle={() => toggleSection("settings")}
                children={[

                  {
                    href: "/price-visibility-settings",
                    title: t("nav.price_visibility"),
                    icon: <Eye className="h-3 w-3" />,
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.SETTINGS,
                      Action.UPDATE
                    ),
                  },
                  {
                    href: "/moq-settings",
                    title: t("nav.moq"),
                    icon: <Settings className="h-3 w-3" />,
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.PRODUCTS,
                      Action.UPDATE
                    ),
                  },
                  {
                    href: "/pricing-slabs",
                    title: t("nav.pricing_slabs"),
                    icon: <Layers className="h-3 w-3" />,
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.PRODUCTS,
                      Action.UPDATE
                    ),
                  },
                  {
                    href: "/payment-settings",
                    title: t("nav.payment"),
                    icon: <CreditCard className="h-3 w-3" />,
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.SETTINGS,
                      Action.UPDATE
                    ),
                  },
                  {
                    href: "/payment-gateway-settings",
                    title: t("nav.gateway_keys"),
                    icon: <CreditCard className="h-3 w-3" />,
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.SETTINGS,
                      Action.UPDATE
                    ),
                  },
                  {
                    href: "/shiprocket-settings",
                    title: t("nav.shiprocket"),
                    icon: <Truck className="h-3 w-3" />,
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.SETTINGS,
                      Action.UPDATE
                    ),
                  },
                  {
                    href: "/shipping-settings",
                    title: t("nav.shipping"),
                    icon: <Truck className="h-3 w-3" />,
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.SETTINGS,
                      Action.UPDATE
                    ),
                  },
                  {
                    href: "/settings",
                    title: t("nav.language"),
                    icon: <Settings className="h-3 w-3" />,
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.SETTINGS,
                      Action.UPDATE
                    ),
                  },
                ]}
              />
            </div>
          </SafeRender>
        </nav>
        <div className="p-4 border-t border-[#1E293B] bg-[#0F172A]">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F97316] text-white font-medium text-sm">
              {admin?.firstName?.charAt(0) || admin?.email?.charAt(0) || "U"}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-medium text-white truncate">
                {admin?.firstName
                  ? `${admin.firstName} ${admin.lastName}`
                  : admin?.email}
              </span>
              <span className="text-xs text-[#94A3B8] capitalize">
                {admin?.role === "SUPER_ADMIN"
                  ? t("admin.role.super_admin")
                  : admin?.role === "ADMIN"
                    ? t("admin.role.admin")
                    : t("admin.role.user")}
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start bg-[#334155] hover:bg-red-600/20 hover:text-red-400 border-[#1E293B] text-[#94A3B8] text-sm h-9 transition-all duration-200"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t("admin.logout")}</span>
          </Button>
        </div>
      </aside>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[240px] transform bg-[#0F172A] border-r border-[#1E293B] transition-transform duration-300 ease-in-out lg:hidden flex flex-col h-full shadow-xl",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-[#1E293B]">
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 font-semibold text-white text-base"
            onClick={toggleMobileMenu}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded bg-[#F97316]">
              <span className="text-white font-bold text-sm">CA</span>
            </span>
            <span>CA Maker</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-[#1E293B] text-[#94A3B8]"
            onClick={toggleMobileMenu}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="flex-1 py-6 px-3 pb-20 overflow-y-auto scrollbar-hide">
          <SafeRender>
            <div className="flex flex-col gap-1">
              <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-[#64748B]">MAIN</p>
              {/* Dashboard - Single Item */}
              <NavItem
                href="/dashboard"
                icon={<LayoutDashboard className="h-[1.125rem] w-[1.125rem]" />}
                title={t("nav.dashboard")}
                onClick={toggleMobileMenu}
                hasPermission={hasPermissionFor(
                  admin,
                  Resource.DASHBOARD,
                  Action.READ
                )}
              />

              {/* Courses - Collapsible */}
              <CollapsibleNavItem
                title={t("nav.courses")}
                icon={<BookOpen className="h-[1.125rem] w-[1.125rem]" />}
                isOpen={openSections.products}
                onToggle={() => toggleSection("products")}
                onClick={toggleMobileMenu}
                children={[
                  {
                    href: "/courses",
                    title: t("nav.all_courses"),
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.PRODUCTS,
                      Action.READ
                    ),
                  },
                  {
                    href: "/courses/add",
                    title: t("nav.add_course"),
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.PRODUCTS,
                      Action.CREATE
                    ),
                  },
                  {
                    href: "/brands",
                    title: t("nav.brands"),
                    icon: <Tags className="h-3 w-3" />,
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.BRANDS,
                      Action.READ
                    ),
                  },
                  {
                    href: "/categories",
                    title: t("nav.categories"),
                    icon: <Tags className="h-3 w-3" />,
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.CATEGORIES,
                      Action.READ
                    ),
                  },
                  {
                    href: "/attributes",
                    title: t("nav.attributes"),
                    icon: <Tag className="h-3 w-3" />,
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.PRODUCTS,
                      Action.READ
                    ),
                  },
                ]}
              />

              {/* Orders - Collapsible */}
              <CollapsibleNavItem
                title={t("nav.orders")}
                icon={<ShoppingCart className="h-[1.125rem] w-[1.125rem]" />}
                isOpen={openSections.orders}
                onToggle={() => toggleSection("orders")}
                onClick={toggleMobileMenu}
                children={[
                  {
                    href: "/orders",
                    title: t("nav.all_orders"),
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.ORDERS,
                      Action.READ
                    ),
                  },
                  {
                    href: "/return-requests",
                    title: t("nav.return_requests"),
                    icon: <RotateCcw className="h-3 w-3" />,
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.ORDERS,
                      Action.READ
                    ),
                  },
                  {
                    href: "/coupons",
                    title: t("nav.coupons"),
                    icon: <Ticket className="h-3 w-3" />,
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.COUPONS,
                      Action.READ
                    ),
                  },
                ]}
              />

              <p className="px-3 mt-4 mb-2 text-xs font-semibold uppercase tracking-wider text-[#64748B]">MANAGEMENT</p>
              {/* Users - Collapsible */}
              <CollapsibleNavItem
                title={t("nav.users")}
                icon={<Users className="h-[1.125rem] w-[1.125rem]" />}
                isOpen={openSections.users}
                onToggle={() => toggleSection("users")}
                onClick={toggleMobileMenu}
                children={[
                  {
                    href: "/users",
                    title: t("nav.users"),
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.USERS,
                      Action.READ
                    ),
                  },
                  // {
                  //   href: "/partner",
                  //   title: t("nav.partners"),
                  //   icon: <Users className="h-3 w-3" />,
                  //   hasPermission:
                  //     admin?.role === "SUPER_ADMIN" ||
                  //     hasPermissionFor(admin, Resource.USERS, Action.READ),
                  // },
                  // {
                  //   href: "/referrals",
                  //   title: t("nav.referrals"),
                  //   icon: <Users className="h-3 w-3" />,
                  //   hasPermission: hasPermissionFor(
                  //     admin,
                  //     Resource.USERS,
                  //     Action.READ
                  //   ),
                  // },
                ]}
              />

              {/* Support - Collapsible */}
              <CollapsibleNavItem
                title={t("nav.support")}
                icon={<Headphones className="h-[1.125rem] w-[1.125rem]" />}
                isOpen={openSections.support}
                onToggle={() => toggleSection("support")}
                onClick={toggleMobileMenu}
                children={[
                  {
                    href: "/contact-management",
                    title: t("nav.contact"),
                    icon: <Mail className="h-3 w-3" />,
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.CONTACT,
                      Action.READ
                    ),
                  },
                  {
                    href: "/reviews-management",
                    title: t("nav.reviews"),
                    icon: <MessageSquare className="h-3 w-3" />,
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.REVIEWS,
                      Action.READ
                    ),
                  },
                  {
                    href: "/faq-management",
                    title: t("nav.faq"),
                    icon: <HelpCircle className="h-3 w-3" />,
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.FAQS,
                      Action.READ
                    ),
                  },
                  {
                    href: "/testimonials",
                    title: t("nav.testimonials"),
                    icon: <Quote className="h-3 w-3" />,
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.TESTIMONIALS,
                      Action.READ
                    ),
                  },
                ]}
              />

              {/* Settings - Collapsible */}
              <CollapsibleNavItem
                title={t("nav.settings")}
                icon={<Settings className="h-[1.125rem] w-[1.125rem]" />}
                isOpen={openSections.settings}
                onToggle={() => toggleSection("settings")}
                onClick={toggleMobileMenu}
                children={[
                  {
                    href: "/price-visibility-settings",
                    title: t("nav.price_visibility"),
                    icon: <Eye className="h-3 w-3" />,
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.SETTINGS,
                      Action.UPDATE
                    ),
                  },

                  {
                    href: "/moq-settings",
                    title: t("nav.moq"),
                    icon: <Settings className="h-3 w-3" />,
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.PRODUCTS,
                      Action.UPDATE
                    ),
                  },
                  {
                    href: "/pricing-slabs",
                    title: t("nav.pricing_slabs"),
                    icon: <Layers className="h-3 w-3" />,
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.PRODUCTS,
                      Action.UPDATE
                    ),
                  },
                  {
                    href: "/payment-settings",
                    title: t("nav.payment"),
                    icon: <CreditCard className="h-3 w-3" />,
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.SETTINGS,
                      Action.UPDATE
                    ),
                  },
                  {
                    href: "/payment-gateway-settings",
                    title: t("nav.gateway_keys"),
                    icon: <CreditCard className="h-3 w-3" />,
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.SETTINGS,
                      Action.UPDATE
                    ),
                  },
                  {
                    href: "/shiprocket-settings",
                    title: t("nav.shiprocket"),
                    icon: <Truck className="h-3 w-3" />,
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.SETTINGS,
                      Action.UPDATE
                    ),
                  },
                  {
                    href: "/shipping-settings",
                    title: t("nav.shipping"),
                    icon: <Truck className="h-3 w-3" />,
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.SETTINGS,
                      Action.UPDATE
                    ),
                  },
                  {
                    href: "/settings",
                    title: t("nav.language"),
                    icon: <Settings className="h-3 w-3" />,
                    hasPermission: hasPermissionFor(
                      admin,
                      Resource.SETTINGS,
                      Action.UPDATE
                    ),
                  },
                ]}
              />
            </div>
          </SafeRender>
        </nav>
        <div className="p-4 border-t border-[#1E293B] bg-[#0F172A]">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F97316] text-white font-medium text-sm">
              {admin?.firstName?.charAt(0) || admin?.email?.charAt(0) || "U"}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-medium text-white truncate">
                {admin?.firstName
                  ? `${admin.firstName} ${admin.lastName}`
                  : admin?.email}
              </span>
              <span className="text-xs text-[#94A3B8] capitalize">
                {admin?.role === "SUPER_ADMIN"
                  ? t("admin.role.super_admin")
                  : admin?.role === "ADMIN"
                    ? t("admin.role.admin")
                    : t("admin.role.user")}
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start bg-[#334155] hover:bg-red-600/20 hover:text-red-400 border-[#1E293B] text-[#94A3B8] text-sm h-9 transition-all duration-200"
            onClick={() => {
              toggleMobileMenu();
              logout();
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t("admin.logout")}</span>
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex w-full flex-col flex-1 min-h-0 lg:ml-[240px]">
        {/* Topbar - White, shadow-sm */}
        <header className="flex h-16 items-center justify-between px-4 lg:px-6 bg-white border-b border-[#E2E8F0] shadow-sm sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-slate-100 text-slate-600"
              onClick={toggleMobileMenu}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-[#0F172A]">
                {location.pathname === "/dashboard" ? t("nav.dashboard") :
                  location.pathname.startsWith("/courses") ? t("nav.courses") :
                    location.pathname.startsWith("/orders") ? t("nav.orders") :
                      location.pathname.startsWith("/users") ? t("nav.users") :
                        location.pathname.startsWith("/contact-management") ? t("nav.contact") :
                          location.pathname.startsWith("/reviews-management") ? t("nav.reviews") :
                            location.pathname.startsWith("/faq-management") ? t("nav.faq") :
                              location.pathname.startsWith("/testimonials") ? t("nav.testimonials") :
                                location.pathname.startsWith("/settings") ? t("nav.settings") :
                                  t("admin.admin_dashboard")}
              </h1>
              <p className="text-xs text-[#64748B] hidden sm:block">
                {location.pathname === "/dashboard" ? "Overview" : "CA Maker Admin"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Date pill */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded bg-slate-100 text-slate-600 text-sm">
              <Calendar className="h-4 w-4" />
              <span>{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
            </div>
            {/* Notification bell */}
            <Button variant="ghost" size="icon" className="relative hover:bg-slate-100 text-slate-600">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#F97316]" />
            </Button>
            {/* Primary CTA - context based */}
            {location.pathname === "/dashboard" && (
              <Button
                asChild
                className="hidden sm:flex bg-[#F97316] hover:bg-[#EA580C] text-white rounded px-4 py-2"
              >
                <Link to="/orders">
                  {t("nav.all_orders")}
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
            {/* Inventory Alerts */}
            <div className="hidden md:block">
              <SafeRender>
                <InventoryAlertNotification />
              </SafeRender>
            </div>
          </div>
        </header>

        {/* Mobile Alert Bar */}
        <div className="lg:hidden">
          <SafeRender>
            <InventoryAlertNotification />
          </SafeRender>
        </div>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
