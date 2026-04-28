"use client";

import { X, Clock } from "lucide-react";

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

interface RecipeDetailModalProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
}

export function RecipeDetailModal({
  recipe,
  isOpen,
  onClose,
}: RecipeDetailModalProps): React.ReactElement {
  if (!isOpen) return <></>;;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white">
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-900">{recipe.title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 h-64 overflow-hidden rounded-lg bg-gray-100">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-600">Prep Time</p>
              <p className="mt-1 flex items-center gap-1 text-xl font-semibold text-gray-900">
                <Clock className="h-5 w-5" />
                {recipe.prepTime} min
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-600">Cooking Time</p>
              <p className="mt-1 flex items-center gap-1 text-xl font-semibold text-gray-900">
                <Clock className="h-5 w-5" />
                {recipe.cookingTime} min
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              Ingredients
            </h3>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient.id} className="text-gray-700">
                  <span className="font-medium">{ingredient.amount}</span>{" "}
                  {ingredient.name}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              Instructions
            </h3>
            <p className="whitespace-pre-wrap text-gray-700">
              {recipe.instructions}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
