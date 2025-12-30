"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Moon, Sun, Menu, X, Bell, User, Book } from "lucide-react";
import { useTheme } from "next-themes";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-background border-b border-border py-4 px-4 md:px-8 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <Link href="/" className="text-2xl font-bold text-primary">
            مانجا
          </Link>

          <div className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
            <NavLink href="/" label="الرئيسية" active={pathname === "/"} />
            <NavLink
              href="/manga"
              label="المانجا"
              active={pathname.startsWith("/manga")}
            />
            <NavLink
              href="/novels"
              label="الروايات"
              active={pathname.startsWith("/novels")}
            />
            <NavLink
              href="/authors"
              label="المؤلفين"
              active={pathname.startsWith("/authors")}
            />
          </div>
        </div>

        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <button
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <Link
            href="/search"
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <Search size={20} />
          </Link>

          <Link
            href="/notifications"
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <Bell size={20} />
          </Link>

          <Link
            href="/library"
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <Book size={20} />
          </Link>

          <Link
            href="/profile"
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <User size={20} />
          </Link>

          <button
            className="md:hidden p-2 rounded-full hover:bg-secondary transition-colors"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 py-4 px-2 bg-background border-t border-border">
          <div className="flex flex-col space-y-3">
            <MobileNavLink
              href="/"
              label="الرئيسية"
              active={pathname === "/"}
              onClick={toggleMenu}
            />
            <MobileNavLink
              href="/manga"
              label="المانجا"
              active={pathname.startsWith("/manga")}
              onClick={toggleMenu}
            />
            <MobileNavLink
              href="/novels"
              label="الروايات"
              active={pathname.startsWith("/novels")}
              onClick={toggleMenu}
            />
            <MobileNavLink
              href="/authors"
              label="المؤلفين"
              active={pathname.startsWith("/authors")}
              onClick={toggleMenu}
            />
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`font-medium transition-colors ${
        active ? "text-primary" : "text-foreground hover:text-primary"
      }`}
    >
      {label}
    </Link>
  );
}

function MobileNavLink({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      className={`py-2 px-4 rounded-md block font-medium transition-colors ${
        active
          ? "bg-secondary text-primary"
          : "text-foreground hover:bg-secondary hover:text-primary"
      }`}
      onClick={onClick}
    >
      {label}
    </Link>
  );
}
