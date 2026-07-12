"use client"
import { useEffect, useState } from "react" 
import { fonts } from "../actions/fonts";
import { getBookmarksByUserId } from "../actions/bookmarksDb";
import { currentUser } from "../actions/userDb";

interface BookmarksSectionProps {
  onSelectRecipe: (receta: string) => void;
}

export default function BookmarksSection({ onSelectRecipe }: BookmarksSectionProps) {
  const [currentBookmarks, setCurrentBookmarks] = useState<string[]>([])
  
  useEffect(() => {
    async function fetchUserAndBookmarks() {
      try {
        const user = await currentUser();
        if (user) {
          const bookmarksData = await getBookmarksByUserId(user.id);
          const recipeIds = bookmarksData.map((item) => item.recipeId);
          
          setCurrentBookmarks(recipeIds);
        }
      } catch (error) {
        console.error("Error cargando marcadores:", error);
      } 
    }

    fetchUserAndBookmarks();
  }, []);

  return (
    <div>
      <h1 className={`text-5xl sm:text-6xl text-center font-light tracking-tight font-serif ${fonts()}`}>
        <span className={`font-serif italic duration-500 transform`}>Bookmarks</span>
      </h1>
      <br />
      
      {currentBookmarks.length === 0 ? (
        <p className="text-center text-gray-400 text-sm mt-5">No bookmarks available.</p>
      ) : (
        currentBookmarks.map((recipeId) => (
          <div key={recipeId}>
            <div
              onClick={() => onSelectRecipe(recipeId)}
              className="p-4 bg-red-900 rounded-xl border border-red-950/40 text-left cursor-pointer
                        shadow-lg hover:shadow-red-950/50 hover:border-red-800/60 hover:bg-[#2a1212]
                        transition-all duration-200 transform hover:-translate-y-0.5 group"
            >
              <div className="flex justify-between items-center">
                <p className="font-bold text-red-100 text-base group-hover:text-white transition-colors">
                  {recipeId}
                </p>
                <span className="text-red-400/50 group-hover:text-red-400 font-bold transition-colors text-sm">
                  →
                </span>
              </div>
              <p className="text-xs text-red-200/40 mt-1">Tap to see full instructions</p>
            </div>
            <span className="text-xs uppercase tracking-[0.3em] text-gray-400 font-semibold block text-center my-4">
              —-—-—-—-—-—-—-—-—-—-—-—-—-—-—-—-—-—-—-—-—-—
            </span>
          </div>
        ))
      )}
    </div>
  );
}