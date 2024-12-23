import { auth } from "@/lib/auth";
import { fetchTags } from "@/lib/tasty-api";
import Link from "next/link"; // Added Link for navigation
import { Key } from "react";
import { MyRecipes } from "./Myrecipes";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"; // Replace with your domain

export default async function MyRecipesPage() {
  const session = await auth();
  const tags = await fetchTags();
  const categories = tags.results
    .filter(
      (tag: { type: string }) =>
        tag.type === "cuisine" || tag.type === "dietary"
    )
    .map((tag: { name: any; display_name: any }) => ({
      name: tag.name,
      displayName: tag.display_name,
    }));
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const user_saved_recipes = (
    await fetch(
      BASE_URL +
        `/api/get-saved-recipes?userId=${encodeURIComponent(session?.user.id!)}`
    )
  ).json();

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-1/4 p-6 hidden lg:block bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-bold mb-4 text-secondary">Categories</h2>
        <ul className="space-y-3">
          {categories.map(
            (category: { name: Key | null | undefined; displayName: any }) => (
              <li key={category.name}>
                <Link
                  href={`/categories/${category.name}`}
                  className="block text-gray-700 hover:text-primary transition"
                >
                  {category.displayName}
                </Link>
              </li>
            )
          )}
        </ul>
        {/* Back to Home Link */}
        <div className="mt-8">
          <Link
            href="/"
            className="text-primary font-semibold underline hover:text-secondary transition"
          >
            Back to Home
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <MyRecipes userId={session.user.id} UserRecipes={user_saved_recipes} />
    </div>
  );
}
