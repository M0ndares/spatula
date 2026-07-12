"use client"
import { useEffect, useState } from "react" 
import { fonts } from "../actions/fonts";
import { currentUser } from "../actions/userDb";
import type { User } from "@supabase/supabase-js";
import { register } from "module";
import { registerUser } from "../actions/userDb";

export default function ProfileSection() {
    const [user, setUser] = useState<User | null>(null)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState(""); 

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { success } = await registerUser(email, password, username);
      console.log(success)
    } catch (err) {
      console.log(err)
    }
  };

    useEffect(() => {
        async function fetchUserAndBookmarks() {
        try {
            const user = await currentUser();
            if(user) setUser(user)
             
        } catch (error) {
            console.error("Error cargando marcadores:", error);
        } 
    }
    fetchUserAndBookmarks();
  }, []);

  return (
    <div>
      <h1 className={`text-5xl sm:text-6xl text-center font-light tracking-tight font-serif ${fonts()}`}>
        <span className={`font-serif italic duration-500 transform`}>Profile</span>
      </h1>
      <br />
      
      {user ? (
          <p className="text-center text-gray-400 text-sm mt-5">Con sesión.</p>
          ) : (
            <div className="w-full max-w-md mx-auto p-6 bg-red-950/20 rounded-2xl border border-red-950/40 backdrop-blur-sm shadow-xl">
        <h2 className={`text-3xl font-light text-center text-red-900 font-serif mb-6`}>
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
        </form>
      </div>
      )}
    </div>
  );
}