import { useEffect, useState } from "react";
export function fonts() {
    const fuentes = [
        "font-serif italic text-gray-400 ",         
        "font-mono tracking-widest text-gray-400 ", 
        "font-mono italic text-[#2a1212]",                  
        "font-mono tracking-widest text-[#2a1212]",  
      ];
      const [indexFuente, setIndexFuente] = useState(0);
    
        useEffect(() => {
            const interval = setInterval(() => {
            setIndexFuente((prevIndex) => (prevIndex + 1) % fuentes.length);
            }, 1500);
    
            return () => clearInterval(interval); 
         }, [fuentes.length]);
    return fuentes[indexFuente]
    
}