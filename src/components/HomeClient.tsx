"use client";

import React, { useState, useEffect, useRef, Suspense, lazy } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchTags, fetchRecipes } from "@/lib/tasty-api";
import { useSession } from "next-auth/react";
import { RecipeCard } from "@/components/RecipeCard";

// Lazy load RecipeCard for performance optimization
// const RecipeCard = lazy(() => import("@/components/RecipeCard"));

const RecipeSection = React.memo(function RecipeSection({
  title,
  recipes,
}: {
  title: string;
  recipes: any[];
}) {
  if (!recipes || recipes.length === 0) return null;

  return (
    <div className="mb-10">
      <h2 className="text-3xl font-bold mb-6 text-secondary">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {recipes.map((recipe) => {
          return (
            <Suspense
              fallback={<div>Loading...</div>}
              key={recipe.id || recipe.name}
            >
              <RecipeCard
                id={recipe.id}
                title={recipe.name}
                thumbnail={recipe.thumbnail_url}
                cookTime={recipe.cook_time_minutes}
                servings={recipe.num_servings}
                isLiked={recipe.liked}
              />
            </Suspense>
          );
        })}
      </div>
    </div>
  );
});

export default function HomeClient({
  popular,
  trending,
  otherSections,
  categories,
}: {
  popular: any[];
  trending: any[];
  otherSections: any[];
  categories?: string[];
  userLikes?: any[];
}) {
  // const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [otherSectionsState, setOtherSectionsState] = useState(otherSections);

  const dropdownRef = useRef(null);
  const router = useRouter();

  // Handle search suggestions
  const fetchSuggestions = async (query: string | undefined) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    setLoadingSuggestions(true);
    try {
      const results = await fetchRecipes("", query, 0, 5);
      setSuggestions(results);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleSearchChange = (e: { target: { value: any } }) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchSuggestions(query);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="bg-white">
      {/* Search Section */}
      <section className="p-6 text-center relative">
        <div className="flex justify-center relative">
          <div className="relative w-full max-w-2xl">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by recipe or ingredients"
              className="w-full p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary"
              onKeyPress={(e) => e.key === "Enter" && handleSearchSubmit()}
            />
            {suggestions.length > 0 && (
              <ul
                ref={dropdownRef}
                className="absolute top-full left-0 w-full bg-white border rounded-lg shadow-lg z-50 mt-1"
              >
                {loadingSuggestions ? (
                  <li className="p-3 text-center text-gray-500">Loading...</li>
                ) : (
                  suggestions.map((recipe) => (
                    <li
                      key={recipe.id || recipe.name}
                      className="p-3 border-b hover:bg-gray-100 transition"
                    >
                      <Link
                        href={`/recipes/${recipe.id}`}
                        className="flex items-center space-x-4"
                        onClick={() => setSuggestions([])}
                      >
                        <img
                          src={
                            recipe.thumbnail_url ||
                            "https://via.placeholder.com/50x50?text=No+Image"
                          }
                          alt={recipe.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <span className="text-sm text-gray-700">
                          {recipe.name}
                        </span>
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
          <button
            onClick={handleSearchSubmit}
            className="bg-primary text-white px-6 rounded-r-lg hover:bg-opacity-90 transition"
          >
            Search
          </button>
        </div>
      </section>

      {/* Category Filter */}
      <div className="flex justify-center flex-wrap gap-3 mt-6">
        {!categories ? (
          <p className="text-gray-500">Loading categories...</p>
        ) : (
          categories.map((category) => (
            <Link
              key={category.name}
              href={`/categories/${category.name}`}
              className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-200 text-gray-700 hover:bg-primary hover:text-white transition"
            >
              {category.displayName.toUpperCase()}
            </Link>
          ))
        )}
      </div>

      {/* Sponsored Section */}
      <section className="p-6 bg-orange-100 border-l-4 border-orange-500 rounded-lg mx-4 my-6">
        <h2 className="text-2xl text-orange-600 font-bold mb-2">
          Save £1000+ on Your Groceries This Year!
        </h2>
        <p className="mb-4">
          Compare prices and discover the best supermarket deals at{" "}
          <a
            href="https://mysupermarketcompare.co.uk/"
            className="text-primary font-semibold underline hover:text-secondary transition"
            target="_blank"
            rel="dofollow"
          >
            MySupermarket Compare
          </a>
        </p>
      </section>

      {/* Recipe Sections */}
      <section className="p-8 bg-white">
        <Suspense fallback={<div>Loading...</div>}>
          <RecipeSection title="Popular Recipes This Week" recipes={popular} />
          <RecipeSection title="Trending Recipes" recipes={trending} />
          {otherSectionsState.map((section, index) =>
            section.items.filter(
              (item: { thumbnail_url: any }) => item.thumbnail_url
            ).length > 0 ? (
              <RecipeSection
                key={index}
                title={section.name || "Other Recipes"}
                recipes={section.items.filter(
                  (item: { thumbnail_url: any }) => item.thumbnail_url
                )}
              />
            ) : null
          )}
        </Suspense>
      </section>
    </div>
  );
}
