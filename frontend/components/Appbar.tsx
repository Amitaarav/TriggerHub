"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Zap,
  LayoutDashboard,
  PlusCircle,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { showSuccess } from "@/lib/toast";

export const Appbar = () => {
  const { user, token, logout, isLoading } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = !!token;

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    showSuccess("Signed out", "You have been safely signed out.");
    router.push("/");
  };

  // Compute initials
  const getInitials = () => {
    if (user?.name) {
      const parts = user.name.trim().split(" ");
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return user.name.slice(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <header className="fixed left-0 top-0 z-50 w-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand Logo */}
          <div
            onClick={() => router.push("/")}
            className="flex items-center gap-2 cursor-pointer group select-none"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") router.push("/");
            }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-inner transition-transform group-hover:scale-105">
              <Zap className="h-6 w-6 fill-white text-white" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white drop-shadow-sm">
              TriggerHub
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <>
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    pathname === "/dashboard"
                      ? "bg-white/20 text-white shadow-sm"
                      : "text-white/90 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/zap/create")}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    pathname === "/zap/create"
                      ? "bg-white/20 text-white shadow-sm"
                      : "text-white/90 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Create Zap</span>
                </button>

                {/* Profile Avatar & Dropdown */}
                <div className="relative ml-2" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    aria-expanded={dropdownOpen}
                    aria-haspopup="menu"
                    className="flex items-center gap-2 rounded-full p-1 text-sm bg-white/10 hover:bg-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white font-bold text-xs ring-2 ring-white/40 shadow-sm">
                      {getInitials()}
                    </div>
                    <span className="text-white font-medium text-sm pr-1 hidden lg:inline max-w-[120px] truncate">
                      {user?.name || "Account"}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-white transition-transform ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div
                      role="menu"
                      aria-orientation="vertical"
                      className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl bg-white p-2 shadow-2xl ring-1 ring-black/5 focus:outline-none animate-in fade-in slide-in-from-top-2 duration-150 z-50"
                    >
                      {/* User Info Header */}
                      <div className="border-b border-slate-100 px-3 py-2.5">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Signed in as
                        </p>
                        <p className="text-sm font-bold text-slate-900 truncate mt-0.5">
                          {user?.name || "User"}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {user?.email || ""}
                        </p>
                      </div>

                      {/* Dropdown Items */}
                      <div className="py-1">
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setDropdownOpen(false);
                            router.push("/dashboard");
                          }}
                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4 text-slate-500" />
                          <span>My Workflows</span>
                        </button>

                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setDropdownOpen(false);
                            router.push("/zap/create");
                          }}
                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                        >
                          <PlusCircle className="h-4 w-4 text-slate-500" />
                          <span>New Automation</span>
                        </button>
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          type="button"
                          role="menuitem"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                        >
                          <LogOut className="h-4 w-4 text-red-500" />
                          <span>Sign out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="px-4 py-2 text-sm font-semibold text-white hover:text-white/90 hover:bg-white/10 rounded-lg transition-colors"
                >
                  Log in
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/signup")}
                  className="px-4 py-2 text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 rounded-lg shadow-sm transition-all hover:scale-105"
                >
                  Sign up free
                </button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              className="inline-flex items-center justify-center rounded-lg p-2 text-white hover:bg-white/10 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-orange-600/95 backdrop-blur-md px-4 pt-3 pb-5 space-y-2">
          {isLoggedIn ? (
            <>
              <div className="px-3 py-2 border-b border-white/10 text-white">
                <p className="font-bold text-sm">{user?.name || "User"}</p>
                <p className="text-xs text-white/80">{user?.email}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push("/dashboard");
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white hover:bg-white/10"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push("/zap/create");
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white hover:bg-white/10"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Create Zap</span>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-200 hover:bg-red-500/20"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push("/login");
                }}
                className="w-full text-center py-2 font-semibold text-white bg-white/10 rounded-lg hover:bg-white/20"
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push("/signup");
                }}
                className="w-full text-center py-2 font-bold text-orange-600 bg-white rounded-lg hover:bg-slate-100"
              >
                Sign up free
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};