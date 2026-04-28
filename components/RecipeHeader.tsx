"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { RecipeModal } from "@/components/RecipeModal";
import { useRecipeStore } from "@/store/recipeStore";

export function RecipeHeader(): React.ReactElement {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { searchQuery, setSearchQuery } = useRecipeStore();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="mb-6 text-3xl font-bold text-gray-900">Recipes</h1>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <label htmlFor="search" className="sr-only">
                Search recipes
              </label>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                id="search"
                type="text"
                placeholder="Search recipes by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Recipe</span>
            </button>
          </div>
        </div>
      </header>

      <RecipeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
