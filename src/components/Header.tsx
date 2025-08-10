// src/components/Header.tsx
"use client";
import { User } from "next-auth";
import Logout from "./Logout";

interface HeaderProps {
  user?: User;
}

export default function Header({ user }: HeaderProps) {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#fff",
        borderBottom: "1px solid #ddd",
      }}
    >
      <div>
        <h1 style={{ margin: 0, fontSize: "24px" }}>Dashboard</h1>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <span>Welcome, {user?.name}</span>
        <Logout />
      </div>
    </header>
  );
}
