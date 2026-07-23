"use client";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="text-sm text-red-800 hover:text-red-900 font-semibold underline mt-6 block cursor-pointer pl-5 capitalize"
    >
      ← Go back
    </button>
  );
}