"use client";

import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { fetchTags } from "@/lib/tasty-api";

export function Header() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);

    document.body.style.overflow = !isMenuOpen ? "hidden" : "auto";
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    const loadTags = async () => {
      try {
        const tags = await fetchTags();
        const filteredCategories = tags.results
          .filter(
            (tag: { type: string }) =>
              tag.type === "cuisine" || tag.type === "dietary"
          )
          .map((tag: { name: any; display_name: any }) => ({
            name: tag.name,
            displayName: tag.display_name,
          }));
        setCategories(filteredCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    loadTags();
  }, []);

  return (
    <header className="relative bg-white text-dark py-4 px-6 shadow-md z-50">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link href="/">
            <img
              src="/yummyhub.svg"
              alt="Yummy Hub Logo"
              className="w-64 h-auto lg:w-64 "
            />
          </Link>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="lg:hidden">
          <button
            onClick={toggleMenu}
            className="p-2 text-gray-700 hover:text-primary focus:outline-none"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        {/* CTA Buttons on Desktop */}
        <div className="hidden lg:flex items-center space-x-6 ml-auto">
          {/* My Recipes - Show only if logged in */}
          {status === "authenticated" && (
            <Link
              href="/my-recipes"
              className="flex items-center px-4 py-2 border border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition duration-200"
            >
              My Recipes
            </Link>
          )}
          {/* Login/Logout Button */}
          {status === "authenticated" ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center px-4 py-2 border border-secondary text-secondary font-semibold rounded-lg hover:bg-secondary hover:text-white transition duration-200"
            >
              Log Out
            </button>
          ) : (
            <Link
              href="/login"
              className="flex items-center px-4 py-2 border border-secondary text-secondary font-semibold rounded-lg hover:bg-secondary hover:text-white transition duration-200"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Sliding Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold">Menu</h3>
          <button
            onClick={toggleMenu}
            className="p-2 text-gray-700 hover:text-red-500 focus:outline-none"
            aria-label="Close menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* CTA Buttons for Mobile Menu */}
        <div className="p-4 space-y-4 border-b">
          {status === "authenticated" && (
            <Link
              href="/my-recipes"
              onClick={handleLinkClick}
              className="block text-center px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition"
            >
              My Recipes
            </Link>
          )}
          {status === "authenticated" ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="block w-full text-center px-4 py-2 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary-dark transition"
            >
              Log Out
            </button>
          ) : (
            <Link
              href="/login"
              onClick={handleLinkClick}
              className="block w-full text-center px-4 py-2 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary-dark transition"
            >
              Login
            </Link>
          )}
        </div>

        {/* Categories */}
        <div className="p-4 space-y-4">
          <h3 className="text-lg font-bold mb-2">Categories</h3>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.name}>
                <Link
                  href={`/categories/${category.name}`}
                  onClick={handleLinkClick}
                  className="block text-gray-700 hover:text-primary transition"
                >
                  {category.displayName}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
