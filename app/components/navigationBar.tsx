"use client";
import Link from "next/link";
import { useState } from "react";

export default function NavigationBar() {
  const [currentTab, setCurrentTab] = useState<string>()

  return (
    <nav className="w-full bg-[#2a1212] top-0 z-50 px-4 py-3 shadow-sm sticky">
      <div className="w-full flex justify-between items-center">
        <Link href={'/'}
          className="flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
          onClick={() => setCurrentTab('menu')}
        >
          <img 
            src={'spatula.png'} 
            className="h-8 w-auto pr-3 object-contain" 
            alt="Spatula Logo" 
          />
        </Link>
     
        <ul className="flex items-center gap-4 text-sm font-semibold">
          
          <Link href={'/recipes'}
            className={`flex items-center gap-1 cursor-pointer transition-colors group 
            ${currentTab === 'recipes' ? 'text-red-800 font-bold' : 'text-gray-50 hover:text-gray-400'}`}
            onClick={() => setCurrentTab('recipes')}
          >
            <span className="material-symbols-outlined text-[22px]">egg_alt</span>
            <span className="hidden sm:inline">Recipes</span>
          </Link>

          <Link href={'/bookmarks'}
            className={`flex items-center gap-1 cursor-pointer transition-colors group 
            ${currentTab === 'bookmarks' ? 'text-red-800 font-bold' : 'text-gray-50 hover:text-gray-400'}`}
            onClick={() => setCurrentTab('bookmarks')}
          >
            <span className="material-symbols-outlined text-[22px]">bookmark</span>
            <span className="hidden sm:inline">Bookmarks</span>
          </Link>

          <Link href={'/profile'}
            className={`flex items-center gap-1 cursor-pointer transition-colors group ${
            currentTab === 'profile' ? 'text-red-800 font-bold' : 'text-gray-50 hover:text-gray-400'}`}
            onClick={() => setCurrentTab('profile')}
          >
            <span className="material-symbols-outlined text-[22px]">account_circle</span>
            <span className="hidden sm:inline">Profile</span>
          </Link>
          
        </ul>
      </div>
    </nav>
  );
}