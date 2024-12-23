"use client";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Key, useCallback, useState } from "react";
import slugify from "slugify";
import { RecipeCard } from "./RecipeCard"; // Import RecipeCard component

export function RecipeDetailsClient({
  recipe,
  categories,
  relatedRecipes = [],
  isUserSaved = false,
  userId,
}: {
  recipe: any;
  categories: any[];
  relatedRecipes?: any[];
  isUserSaved?: boolean;
  userId?: string;
}) {
  const [isSaved, setIsSaved] = useState(isUserSaved);

  // Generate a slug for the recipe
  const recipeSlug = slugify(recipe.name, { lower: true, strict: true });
  const recipeUrl = `/recipes/${recipeSlug}-${recipe.id}`;

  // Toggle save/unsave functionality
  const toggleSave = useCallback(async () => {
    if (!userId) {
      alert("Please log in to save recipes!");
      return;
    }

    try {
      const url = "/api/save-recipe";
      const method = isSaved ? "DELETE" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          recipeId: recipe.id,
          title: recipe.name,
          thumbnail: recipe.thumbnail_url,
        }),
      });

      if (response.ok) {
        setIsSaved((prev) => !prev);
        console.log(
          isSaved ? "Recipe removed from saved recipes." : "Recipe saved!"
        );
      } else {
        const errorData = await response.json().catch(() => null);
        console.error(
          `Failed to ${isSaved ? "unsave" : "save"} recipe.`,
          errorData || response.statusText
        );
        alert(
          errorData?.error || `Failed to ${isSaved ? "unsave" : "save"} recipe.`
        );
      }
    } catch (error) {
      console.error("Error saving or removing recipe:", error);
      alert("An error occurred while saving or removing the recipe.");
    }
  }, [isSaved, recipe]);

  // JSON-LD structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.name,
    image: recipe.thumbnail_url,
    description: recipe.description || "A delicious recipe to try out.",
    recipeIngredient: recipe.sections?.flatMap(
      (section: { components: any[] }) =>
        section.components.map((item: { raw_text: any }) => item.raw_text)
    ),
    recipeInstructions: recipe.instructions?.map(
      (step: { display_text: any }) => step.display_text
    ),
    cookTime: `PT${recipe.cook_time_minutes || 0}M`,
    prepTime: `PT${recipe.prep_time_minutes || 0}M`,
    recipeYield: `${recipe.num_servings || 1} serving(s)`,
    keywords: categories.map((cat) => cat.name).join(", "),
  };

  const renderDetails = (text: any) => (
    <div
      dangerouslySetInnerHTML={{ __html: text }}
      className="recipe-details"
    ></div>
  );

  return (
    <>
      <Head>
        <title>{recipe.name} - Yummy Hub</title>
        <meta
          name="description"
          content={`Learn how to make ${recipe.name}. Serves ${recipe.num_servings} and takes ${recipe.cook_time_minutes} minutes.`}
        />
        <meta
          name="keywords"
          content={`${recipe.name}, recipes, cooking, ${categories
            .map((cat) => cat.displayName)
            .join(", ")}`}
        />
        <link
          rel="canonical"
          href={`${
            process.env.NEXT_PUBLIC_BASE_URL || "https://yourwebsite.com"
          }${recipeUrl}`}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-1/4 p-6 hidden lg:block bg-gray-100 min-h-screen">
          <h2 className="text-2xl font-bold mb-4 text-secondary">Categories</h2>
          <ul className="space-y-3">
            {categories.map((category) => (
              <li key={category.name}>
                <Link
                  href={`/categories/${category.name}`}
                  className="block text-gray-700 hover:text-primary transition"
                >
                  {category.displayName}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Link
              href="/"
              className="text-primary font-semibold underline hover:text-secondary"
            >
              Back to Home
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold text-secondary">{recipe.name}</h1>
            <button
              onClick={toggleSave}
              className={`rounded-full p-2 shadow transition ${
                isSaved ? "bg-red-600 text-white" : "bg-white text-gray-700"
              } hover:bg-primary group`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill={isSaved ? "currentColor" : "none"}
                stroke={isSaved ? "white" : "currentColor"}
                strokeWidth="1.5"
              >
                <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </button>
          </div>

          {/* Recipe Image */}
          {recipe.thumbnail_url && (
            <div className="relative w-full h-96 mb-6">
              <Image
                src={recipe.thumbnail_url}
                alt={recipe.name}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Sponsored Section */}
          <section className="p-4 bg-orange-100 border-l-4 border-orange-500 rounded-lg mb-6 shadow-md">
            <h2 className="text-xl font-semibold text-orange-600 mb-2">
              Save £1000+ on Your Groceries This Year!
            </h2>
            <p className="text-gray-700">
              Compare prices and discover the best supermarket deals at{" "}
              <a
                href="https://mysupermarketcompare.co.uk"
                target="_blank"
                rel="dofollow"
                className="text-primary font-semibold underline hover:text-secondary transition"
              >
                MySupermarket Compare
              </a>
            </p>
          </section>

          {/* Recipe Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-3 text-primary">Details</h2>
              <ul className="space-y-2 text-gray-700">
                {recipe.cook_time_minutes && (
                  <li className="flex items-center space-x-2">
                    <Image
                      src="/cooktime.svg"
                      alt="Cook Time"
                      width={20}
                      height={20}
                    />
                    <span>Cook Time: {recipe.cook_time_minutes} mins</span>
                  </li>
                )}
                {recipe.num_servings && (
                  <li className="flex items-center space-x-2">
                    <Image
                      src="/serve.svg"
                      alt="Servings"
                      width={20}
                      height={20}
                    />
                    <span>Servings: {recipe.num_servings}</span>
                  </li>
                )}
                {recipe.description && (
                  <li>{renderDetails(recipe.description)}</li>
                )}
              </ul>
            </div>

            {/* Ingredients */}
            {recipe.sections && (
              <div>
                <h2 className="text-2xl font-bold mb-3 text-primary">
                  Ingredients
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {recipe.sections[0]?.components.map(
                    (
                      item: { raw_text: any },
                      index: Key | null | undefined
                    ) => (
                      <li key={index}>
                        {item.raw_text || "No ingredient details available"}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Instructions */}
          {recipe.instructions && (
            <div className="mt-6">
              <h2 className="text-2xl font-bold mb-3 text-primary">
                Instructions
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                {(recipe.instructions as any[]).map(
                  (step: { display_text: string }, index) => (
                    <li key={index}>{step.display_text}</li>
                  )
                )}
              </ol>
            </div>
          )}

          {/* Related Recipes */}
          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-secondary">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedRecipes.length > 0 ? (
                relatedRecipes.map((related) => (
                  <RecipeCard
                    key={related.id}
                    id={related.id}
                    title={related.name}
                    thumbnail={related.thumbnail_url}
                    cookTime={related.cook_time_minutes}
                    servings={related.num_servings}
                    // isLiked={isSaved}
                  />
                ))
              ) : (
                <p className="text-gray-500">No related recipes found.</p>
              )}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
