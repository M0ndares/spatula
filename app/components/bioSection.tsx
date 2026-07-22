"use client";

import { useState, useEffect } from 'react';

interface EditableBioProps {
  initialBio: string;
  onSave: (newBio: string) => Promise<void> | void;
}

export default function EditableBio({ initialBio, onSave }: EditableBioProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [bioText, setBioText] = useState(initialBio);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setBioText(initialBio);
  }, [initialBio]);

  const handleAction = async () => {
    if (isEditing) {
      setIsSaving(true);
      try {
        await onSave(bioText);
        setIsEditing(false);
      } catch (err) {
        console.error("Error saving bio:", err);
      } finally {
        setIsSaving(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  return (
    <div>
      <div className="relative w-full min-h-[50px] p-2.5 bg-red-950/20 border border-red-950/20 rounded-xl flex items-center justify-between gap-3 transition-all">
        {isEditing ? (
          <textarea
            value={bioText}
            onChange={(e) => setBioText(e.target.value)}
            disabled={isSaving}
            className="w-full bg-transparent text-[#2a1212] text-xs italic leading-relaxed focus:outline-none resize-none pr-8 font-sans disabled:opacity-50"
            rows={2}
            autoFocus
          />
        ) : (
          <p className="text-[#2a1212] text-xs italic leading-relaxed pr-8 select-none">
            {bioText || "No bio added yet."}
          </p>
        )}

        <button
          onClick={handleAction}
          disabled={isSaving}
          className="absolute right-2.5 top-2.5 p-1.5 bg-red-900 border border-red-950 rounded-full text-red-100 hover:bg-[#2a1212] transition-colors shadow cursor-pointer flex items-center justify-center shrink-0 disabled:opacity-50"
          title={isEditing ? "Save bio" : "Edit bio"}
        >
          {isSaving ? (
            <svg className="animate-spin h-3.5 w-3.5 text-red-100" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : isEditing ? (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}