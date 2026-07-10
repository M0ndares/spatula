"use client";
import { useState, useEffect } from "react";

interface NavigationBarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export default function NavigationBar({ currentTab, onNavigate }: NavigationBarProps) {

  return (
    <nav className="w-full bg-[#2a1212]  top-0 z-50 px-4 py-3 shadow-sm">
      <div className="w-full flex justify-between items-center">
        <a 
          onClick={() => onNavigate('menu')}
          className="flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
        >
          <img 
            src={'spatula.png'} 
            className="h-8 w-auto pr-3 object-contain" 
            alt="Spatula Logo" 
          />
        </a>
        <ul className="flex items-center gap-4 text-sm font-semibold">
          <li 
            onClick={() => onNavigate('recipes')} 
            className={`flex items-center gap-1 cursor-pointer transition-colors group ${
            currentTab === 'recipes' ? 'text-red-800 font-bold' : 'text-white-600 hover:text-red-800'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">egg_alt</span>
            <span className="hidden sm:inline">Recipes</span>
          </li>
          <li 
            onClick={() => onNavigate('bookmarks')} 
            className={`flex items-center gap-1 cursor-pointer transition-colors group ${
              currentTab === 'bookmarks' ? 'text-red-800 font-bold' : 'text-white-600 hover:text-red-800'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">star</span>
            <span className="hidden sm:inline">Favourites</span>
          </li>
          <li 
            onClick={() => onNavigate('profile')} 
            className={`flex items-center gap-1 cursor-pointer transition-colors group ${
            currentTab === 'profile' ? 'text-red-800 font-bold' : 'text-white-600 hover:text-red-800'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">account_circle</span>
            <span className="hidden sm:inline">Profile</span>
          </li>
        </ul>
      </div>
    </nav>
  );
}