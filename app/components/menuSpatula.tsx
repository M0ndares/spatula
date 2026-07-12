"use client"
import { useEffect, useState } from "react"
import { fonts } from "../actions/fonts";
import { getRecipeById } from "../actions/recipesDb";

interface Recipe {
  id: string;
  name: string;
}

export default function MenuSpatula() {
  const topRecipes = ['2bafe6b2-fedf-47dd-9562-fdf278fbea84', 'b8558334-39e5-4837-809a-894c6dd03643', 'd3e734a7-3eb5-47d0-88c7-4ed363a50e7b']
  
  const [recipes, setRecipes] = useState<Recipe[] | null>(null)

  useEffect(() => {
    async function fetchTopRecipes() {
      try {
        const promises = topRecipes.map((id) => getRecipeById(id))
        const recetasObtenidas = await Promise.all(promises)
        if (recetasObtenidas) setRecipes(recetasObtenidas.flat().filter(Boolean) as Recipe[])
      } catch (error) {
        console.error("Error cargando recetas top:", error)
      } 
    }

    fetchTopRecipes()
  }, 
[]) 


  return (
  <section>
    <div className="max-w-xl text-center space-y-8 mx-auto p-4">
      <h1 className="text-5xl sm:text-6xl font-light tracking-tight text-red-900 font-serif">
        Let's <span className={`font-serif italic duration-500 transform ${fonts()}`}>cook</span> it.
      </h1>
      <span className="text-xs uppercase tracking-[0.3em] text-gray-400 font-semibold block">
        -— trending: summer '26 —-
      </span>

      <div className="space-y-4 mt-6">
        {recipes && recipes.map((recipe) => {
          return (
            <div
              key={recipe.id} 
              className="p-4 bg-red-900 rounded-xl border border-red-950/40 text-left cursor-pointer
                        shadow-lg hover:shadow-red-950/50 hover:border-red-800/60 hover:bg-[#2a1212]
                        transition-all duration-200 transform hover:-translate-y-0.5 group"
            >
              <div className="flex justify-between items-center">
                <p className="font-bold text-red-100 text-base group-hover:text-white transition-colors">
                  {recipe.name}
                </p>
                <span className="text-white font-bold transition-colors text-sm">
                  →
                </span>
              </div>
              <p className="text-xs text-red-200/40 mt-1">Tap to see full instructions</p>
            </div>
          )
        })}
      </div>

    </div>
  </section>
  )
}