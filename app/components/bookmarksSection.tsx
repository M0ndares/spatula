"use client"
import { useEffect, useState } from "react" 
import { fonts } from "../actions/fonts";

interface BookmarksSectionProps {
  bookmarks: string[];
  onSelectRecipe: (receta: string) => void;
}

export default function BookmarksSection({bookmarks, onSelectRecipe}: BookmarksSectionProps ) {

    return (
        <div>
          <h1 className={`text-5xl sm:text-6xl text-center font-light tracking-tight font-serif ${fonts()}`}>
            <span className={`font-serif italic duration-500 transform`}>Bookmarks</span>
          </h1>
          <br></br>
        {bookmarks && (
          bookmarks.map((index) => {
              if (bookmarks.length < 1) return;
              return (
                <div
                key={index}>
                  <div
                    onClick={() => onSelectRecipe(index)}
                    className="p-4 bg-red-900 rounded-xl border border-red-950/40 text-left cursor-pointer
                              shadow-lg hover:shadow-red-950/50 hover:border-red-800/60 hover:bg-[#2a1212]
                              transition-all duration-200 transform hover:-translate-y-0.5 group"
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-red-100 text-base group-hover:text-white transition-colors">
                        {index} // receta[index]
                      </p>
                      <span className="text-red-400/50 group-hover:text-red-400 font-bold transition-colors text-sm">
                        →
                      </span>
                    </div>
                    <p className="text-xs text-red-200/40 mt-1">Tap to see full instructions</p>
                    
                  </div>
                  <span className="text-xs uppercase tracking-[0.3em] text-gray-400 font-semibold block align-center">—-—-—-—-—-—-—-—-—-—-—-—-—-—-—-—-—-—-—-—-—-—</span>
                </div>
                )}
              )
            )}
          </div>
          )
        }