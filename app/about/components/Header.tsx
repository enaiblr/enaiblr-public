"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    { name: "Fitur", href: "#features" },
    { name: "Testimoni", href: "#testimonials" },
    { name: "Harga", href: "#pricing" },
  ];

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : ""}`}>
      <nav className="container mx-auto px-4 sm:px-6 lg:px-16">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/about" className="text-2xl font-bold">
              en<span className="text-blue-600 font-ibm-plex-mono-regular">ai</span>blr
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90">Login</Button>
            </div>
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
        }`}>
          <div className="bg-white px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="px-3 py-2">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;