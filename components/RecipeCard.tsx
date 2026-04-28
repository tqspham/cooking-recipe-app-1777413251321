"use client";

import { useState } from "react";
import { Trash2, Clock } from "lucide-react";
import { RecipeDetailModal } from "@/components/RecipeDetailModal";

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

interface RecipeCardProps {
  recipe: Recipe;
  onRecipeAdded: () => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function RecipeCard({
  recipe,
  onDelete,
}: RecipeCardProps): React.ReactElement {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.stopPropagation();
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await onDelete(recipe.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div
        onClick={() => setIsDetailOpen(true)}
        className="group cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
      >
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>

        <div className="flex flex-col gap-3 p-4">
          <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {recipe.title}
          </h2>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{recipe.cookingTime} min</span>
            </div>
          </div>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            aria-label={`Delete recipe ${recipe.title}`}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <RecipeDetailModal
        recipe={recipe}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </>
  );
}
