"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from '@/components/ui/button';
import * as Avatar from '@radix-ui/react-avatar';
import { useState, useRef, useEffect } from "react";

export default function AuthButtons() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  console.log("Session user:", session?.user);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  if (status === "loading") return <p>Loading...</p>;

  if (session) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          className="rounded-full border-2 border-blue-600 w-10 h-10 flex items-center justify-center focus:outline-none"
          onClick={() => setOpen((v) => !v)}
        >
          <Avatar.Root className="w-8 h-8 rounded-full overflow-hidden">
            <Avatar.Image
              src={session.user?.image ?? ""}
              alt={session.user?.name ?? "User"}
              className="w-full h-full object-cover"
            />
            <Avatar.Fallback className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold">
              {session.user?.name?.[0] ?? "U"}
            </Avatar.Fallback>
          </Avatar.Root>
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50">
            <div className="px-4 py-2 text-sm text-gray-700">{session.user?.name ?? session.user?.email}</div>
            <button
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              onClick={() => { setOpen(false); signOut(); }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    );
  }
  return (
    <Button
      variant="outline"
      className="border-blue-600 text-blue-600 hover:bg-blue-50 cursor-pointer"
      onClick={() => signIn(undefined, { callbackUrl: "/dashboard" })}
    >
      Sign in
    </Button>
  );
}