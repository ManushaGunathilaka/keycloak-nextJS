// src/components/Header.tsx
"use client";
import { User } from "next-auth";
import Logout from "./Logout";

interface HeaderProps {
  user?: User;
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className="flex justify-end px-5 py-2 bg-white border-b border-gray-300">
      <div className="flex items-center gap-4">
        <span>Welcome, {user?.name}</span>
        <Logout />
      </div>
    </header>
  );
}
