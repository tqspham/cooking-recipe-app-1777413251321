"use client";

import { useEffect, useState } from "react";
import { RecipeCard } from "@/components/RecipeCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useRecipeStore } from "@/store/recipeStore";

interface Recipe {
  id: string;
  title: string;
  image: string;
  cookingTime: number;
  prepTime: number;
  ingredients: Array<{ id: string; name: string; amount: string }>;
  instructions: string;
  createdAt: string;
}

export function RecipeList(): React.ReactElement {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { searchQuery } = useRecipeStore();

  useEffect(() => {
    const fetchRecipes = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await fetch("/api/recipes");
        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }
        const data = (await response.json()) as Recipe[];
        setRecipes(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load recipes"
        );
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleRecipeAdded = async (): Promise<void> => {
    try {
      const response = await fetch("/api/recipes");
      if (!response.ok) throw new Error("Failed to fetch recipes");
      const data = (await response.json()) as Recipe[];
      setRecipes(data);
    } catch (err) {
      setError("Failed to refresh recipe list");
    }
  };

  const handleDeleteRecipe = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/recipes?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete recipe");
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
    } catch (err) {
      setError("Failed to delete recipe");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredRecipes.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-600">
            {searchQuery
              ? `No recipes found matching "${searchQuery}"`
              : "No recipes yet. Create your first recipe to get started!"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onRecipeAdded={handleRecipeAdded}
            onDelete={handleDeleteRecipe}
          />
        ))}
      </div>
    </main>
  );
}
