"use client";

import { useState } from "react";

interface Recipe {
  id: string;
  name: string;
  steps: string;
  ingredients: string;
}

interface RecipeCardProps {
  recipe: Recipe;
  isBookmarked: boolean;
  onSelect: (recipe: Recipe) => void;
  onBookmarkToggle: (recipe: Recipe) => void;
}

export default function RecipeCard({ 
  recipe, 
  isBookmarked, 
  onSelect, 
  onBookmarkToggle 
  }: RecipeCardProps) {

  return (
    <div
      onClick={() => onSelect(recipe)}
      className="p-4 m-2 px-5 bg-red-950/20 rounded-xl border border-red-950/40 text-left cursor-pointer
                 shadow-lg hover:shadow-red-950/50 hover:border-red-800/60 hover:bg-[#2a1212]
                 transition-all duration-200 transform hover:-translate-y-0.5 group"
    >
      <div className="flex justify-between items-center">
        <p className="font-bold text-red-950 text-base group-hover:text-white transition-colors">
          {recipe.name}
        </p>
        
        <span 
          className={`material-symbols-outlined cursor-pointer transition-colors ${
            isBookmarked 
              ? "text-red-950 group-hover:text-white hover:text-red-700" 
              : "text-gray-400 group-hover:text-white hover:text-red-700"
          }`}
          onClick={(e) => {
            e.stopPropagation(); 
            onBookmarkToggle(recipe);

          }}
        >
          {isBookmarked ? "bookmark_added" : "bookmark"}
        </span>
      </div>
      <p className="text-xs text-red-950 mt-1 group-hover:text-white">
        Tap to see full instructions
      </p>
    </div>
  );
}