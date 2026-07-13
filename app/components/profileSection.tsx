"use client"

import { useEffect, useState } from "react" 
import { fonts } from "../actions/fonts";
import { currentUser } from "../actions/userDb";
import type { User } from "@supabase/supabase-js";
import { registerUser, loginUser, signOut, getUserMetadata } from "../actions/userDb";

interface Profile {
  id: string;
  name: string;
  isActive: boolean;
  bio: string | null;
  category: string;
}
export function isSupabaseUser(value: any): value is User {
    return value !== null && typeof value === "object" && "id" in value && "email" in value;
  }

export default function ProfileSection() {
  const [user, setUser] = useState<User | null>(null);
  const [userMetadata, setUserMetadata] = useState<Profile | null>(null);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); 
  const [currentError, setCurrentError] = useState<string | null>(null);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCurrentError(null);
    
    if (isSigningUp) {
      try {
        const { success, error } = await registerUser(email, password, username);
        if (error) setCurrentError(error);
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        const { error, user: loggedUser } = await loginUser(email, password);
        
        if (error || !loggedUser) {
          setCurrentError(error || "Authentication failed");
          return;
        }
        if(isSupabaseUser(loggedUser)) setUser(loggedUser);
        
        if (!isSupabaseUser(loggedUser)) return;
        const metadata = await getUserMetadata(loggedUser);
        
        if (metadata && Array.isArray(metadata) && metadata.length > 0) {
          setUserMetadata(metadata[0]);
        } else if (metadata && !Array.isArray(metadata)) {
          setUserMetadata(metadata as Profile);
        }
        
        setCurrentError(null);
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {

    async function fetchMetadata(supabaseUser: User) {
    try {
      const metadata = await getUserMetadata(supabaseUser);
      if (metadata && Array.isArray(metadata) && metadata.length > 0) {
        setUserMetadata(metadata[0]);
      }
    } catch (error) {
      console.error("Error cargando metadatos:", error);
    }
  }

  async function checkInitialUser() {
    const loggedUser = await currentUser();
    if (isSupabaseUser(loggedUser)) {
      setUser(loggedUser);
      await fetchMetadata(loggedUser);
    } else {
      setUser(null);
    }
  }
  checkInitialUser();
  
}, []);

  return (
    <div>
      <h1 className={`text-5xl sm:text-6xl text-center font-light tracking-tight font-serif ${fonts()}`}>
        <span className={`font-serif italic duration-500 transform`}>Profile</span>
      </h1>
      <br />
      
      {!user && !isSigningUp && (
        <div>
          <div className="w-full max-w-md mx-auto p-6 bg-red-950/20 rounded-2xl border border-red-950/40 backdrop-blur-sm shadow-xl">
            <h2 className="text-3xl font-light text-center text-red-900 font-serif mb-6">
              Sign in
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1.5 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="letsbakeit@spatula.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-red-950/60 border border-red-950/40 rounded-xl text-red-100 placeholder-red-200/20 focus:outline-none focus:border-red-800/60 focus:bg-[#2a1212]/50 transition-all text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1.5 ml-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 bg-red-950/60 border border-red-950/40 rounded-xl text-red-100 placeholder-red-200/20 focus:outline-none focus:border-red-800/60 focus:bg-[#2a1212]/50 transition-all text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full p-3.5 mt-2 bg-red-900 hover:bg-[#2a1212] border border-red-950/40 text-red-100 font-bold rounded-xl shadow-lg hover:shadow-red-950/50 hover:border-red-800/60 transition-all duration-200 transform active:translate-y-0.5 disabled:opacity-50 disabled:transform-none text-sm cursor-pointer"
              >
                Sign in
              </button>
            </form>
            <div className="text-sm text-gray-500 mt-2">
              <p>You don't have an account?</p>
              <button 
                onClick={() => setIsSigningUp(true)}
                className="hover:text-y underline cursor-pointer hover:text-red-950"
              >
                Create an account
              </button>
            </div>
          </div>
          <br />
          {currentError && (
            <span className="text-xs uppercase tracking-[0.3em] text-red-900 font-semibold block text-center">
              {currentError}
            </span>
          )} 
        </div>
      )}

      {!user && isSigningUp && (
        <div> 
          <div className="w-full max-w-md mx-auto p-6 bg-red-950/20 rounded-2xl border border-red-950/40 backdrop-blur-sm shadow-xl">
            <h2 className="text-3xl font-light text-center text-red-900 font-serif mb-6">
              Create an account
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1.5 ml-1">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Chef Spatula"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 bg-red-950/60 border border-red-950/40 rounded-xl text-red-100 placeholder-red-200/20 focus:outline-none focus:border-red-800/60 focus:bg-[#2a1212]/50 transition-all text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1.5 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="letsbakeit@spatula.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-red-950/60 border border-red-950/40 rounded-xl text-red-100 placeholder-red-200/20 focus:outline-none focus:border-red-800/60 focus:bg-[#2a1212]/50 transition-all text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1.5 ml-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 bg-red-950/60 border border-red-950/40 rounded-xl text-red-100 placeholder-red-200/20 focus:outline-none focus:border-red-800/60 focus:bg-[#2a1212]/50 transition-all text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full p-3.5 mt-2 bg-red-900 hover:bg-[#2a1212] border border-red-950/40 text-red-100 font-bold rounded-xl shadow-lg hover:shadow-red-950/50 hover:border-red-800/60 transition-all duration-200 transform active:translate-y-0.5 disabled:opacity-50 disabled:transform-none text-sm cursor-pointer"
              >
                Sign up
              </button>
              <div className="text-sm text-gray-500 mt-2">
                <p>You already have an account?</p>
                <button 
                  onClick={() => setIsSigningUp(false)}
                  className="hover:text-y underline cursor-pointer hover:text-red-950"
                >
                  Sign in to your account
                </button>
              </div>
            </form>
          </div>
          <br />
          {currentError && (
            <span className="text-xs uppercase tracking-[0.3em] text-red-900 font-semibold block text-center">
              {currentError}
            </span>
          )} 
        </div>
      )}

      {/* VISTA DE PERFIL (Si el usuario existe y está validado) */}
      {isSupabaseUser(user) && (
        <div>
          <div className="flex items-center gap-5 text-left mb-5">
            <div className="relative group shrink-0 w-20 h-20">
              <div className="w-full h-full rounded-full bg-red-950/60 border-2 border-red-900/60 flex items-center justify-center overflow-hidden shadow-lg shadow-red-950/40">
                <svg 
                  className="w-10 h-10 text-red-200/40 group-hover:text-red-200/60 transition-colors" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <button className="absolute bottom-0 right-0 p-1 bg-red-900 border border-red-950 rounded-full text-red-100 hover:bg-[#2a1212] transition-colors shadow cursor-pointer">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col justify-center">
              <h3 className="text-2xl font-light text-[#2a1212] font-serif tracking-wide leading-tight">
                {userMetadata?.name.split(' ')[0]}
              </h3>
              <div className="mt-1">
                <span className="inline-block px-2.5 py-0.5 bg-red-950/80 border border-red-900/30 rounded-full text-[9px] uppercase tracking-widest text-red-300 font-semibold">
                  {userMetadata?.category}
                </span>
              </div>
            </div>
          </div>

          <hr className="border-red-950/40 mb-4" />

          <div className="grid grid-cols-2 gap-4 mb-5 bg-red-950/20 p-3 rounded-xl border border-red-950/20">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-red-900">Bookmarks</p>
              <p className="text-xl font-semibold text-[#2a1212] font-serif">12</p>
            </div>
            <div className="border-l border-red-950/40 pl-4">
              <p className="text-[10px] uppercase tracking-wider text-red-900">Cooking since</p>
              <p className="text-xl font-semibold text-[#2a1212] font-serif">
                {user.created_at ? user.created_at.substring(0, 10) : "N/A"}
              </p>
            </div>
          </div>

          <div className="space-y-3.5 text-left mb-6">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1 ml-1">
                Email Address
              </label>
              <div className="w-full p-2.5 bg-red-950/20 border border-red-950/20 rounded-xl text-red-900 text-sm font-mono">
                {user.email}
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1 ml-1">
                Bio 
              </label>
              <p className="w-full p-2.5 bg-red-950/20 border border-red-950/20 rounded-xl text-red-900 text-xs italic leading-relaxed">
                {userMetadata?.bio}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => {
              signOut();         
              setUser(null);
              setUserMetadata(null);
            }}
            className="w-full p-3.5 mt-2 bg-red-900 hover:bg-[#2a1212] border border-red-950/40 text-red-100 font-bold rounded-xl shadow-lg hover:shadow-red-950/50 hover:border-red-800/60 transition-all duration-200 transform active:translate-y-0.5 disabled:opacity-50 disabled:transform-none text-sm cursor-pointer"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}