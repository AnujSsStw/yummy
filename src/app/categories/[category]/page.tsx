import { getUserLikes } from "@/app/page";
import { auth } from "@/lib/auth";
import { fetchRecipes, fetchTags } from "@/lib/tasty-api";
import Link from "next/link";
import { Category } from "./Categories";

const PAGE_SIZE = 20; // Number of recipes per API call
export default async function CategoryPage({
  params,
}: {
  params: Promise<{
    category: string;
  }>;
}) {
  const category = (await params).category;
  const recipes = await fetchRecipes(category, "", 0, PAGE_SIZE);

  const tags = await fetchTags();
  const categories = tags.results
    .filter(
      (tag: { type: string }) =>
        tag.type === "cuisine" || tag.type === "dietary"
    )
    .map((tag: { name: any }) => tag.name);

  const session = await auth();
  let userLikes = [];
  if (session) {
    userLikes = await getUserLikes(session.user.id);
  }

  const updatedRecipes = recipes.map((recipe: { id: any }) => {
    const isLiked = userLikes.some(
      (savedRecipe: { recipe_id: any }) => savedRecipe.recipe_id === recipe.id
    );
    return { ...recipe, liked: isLiked };
  });

  return (
    <>
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-1/4 p-6 bg-gray-100 hidden lg:block">
          <h2 className="text-lg font-bold mb-4">Categories</h2>
          <ul className="space-y-2">
            <li>
              <Link
                href={`/`}
                className="w-full text-left px-4 py-2 rounded-lg text-primary hover:bg-primary hover:text-white transition"
              >
                Home
              </Link>
            </li>
            {categories.map((cat: any) => (
              <li key={cat}>
                <Link
                  href={`/categories/${cat}`}
                  className={`w-full text-left px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition ${
                    cat === category ? "bg-primary text-white" : "text-gray-700"
                  }`}
                >
                  {cat.replace(/_/g, " ").toUpperCase()}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <Category
          category={category}
          recipesS={updatedRecipes}
          categories={categories}
        />
      </div>
    </>
  );
}
