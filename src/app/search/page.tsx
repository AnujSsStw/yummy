import { fetchRecipes, fetchTags } from "@/lib/tasty-api"; // Import API methods
import { RecipeCard } from "@/components/RecipeCard";
import Link from "next/link";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { query: string };
}) {
  const query = (await searchParams) || ""; // Get the query from URL parameters
  const recipes = await fetchRecipes("", query.query); // Fetch recipes based on the query
  const tags = await fetchTags(); // Fetch categories for sidebar

  const categories = tags.results
    .filter((tag) => tag.type === "cuisine" || tag.type === "dietary")
    .map((tag) => ({ name: tag.name, displayName: tag.display_name }));

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-1/4 p-6 hidden lg:block bg-gray-100 h-full min-h-screen">
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
        <h1 className="text-4xl font-bold mb-6 text-secondary">
          Search Results for: <span className="text-primary">{query}</span>
        </h1>

        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                id={recipe.id}
                title={recipe.name}
                thumbnail={recipe.thumbnail_url}
                cookTime={recipe.cook_time_minutes}
                servings={recipe.num_servings}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-lg">
            No recipes found. Try searching with different keywords.
          </p>
        )}
      </main>
    </div>
  );
}
