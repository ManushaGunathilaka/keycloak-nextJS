// src/components/Sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  roles: string[];
}

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboards",
    requiredRoles: ["admin", "user"],
  },
  {
    name: "Customers",
    href: "/dashboards/customers",
    requiredRoles: ["admin"],
  },
  {
    name: "Advertisement",
    href: "/dashboards/advertisement",
    requiredRoles: ["admin", "user"],
  },
];

export default function Sidebar({ roles }: SidebarProps) {
  const pathname = usePathname();

  const hasPermission = (requiredRoles: string[]) => {
    return requiredRoles.some((role) => roles.includes(role));
  };

  const filteredNavItems = navigationItems.filter((item) =>
    hasPermission(item.requiredRoles)
  );

  return (
    <nav
      style={{
        width: "250px",
        backgroundColor: "#f5f5f5",
        padding: "20px",
        borderRight: "1px solid #ddd",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Navigation</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredNavItems.map((item) => (
          <li key={item.href} style={{ marginBottom: "10px" }}>
            <Link
              href={item.href}
              style={{
                display: "block",
                padding: "10px",
                textDecoration: "none",
                color: pathname === item.href ? "#0070f3" : "#333",
                backgroundColor:
                  pathname === item.href ? "#e6f3ff" : "transparent",
                borderRadius: "4px",
              }}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

      <div
        style={{
          marginTop: "30px",
          padding: "10px",
          backgroundColor: "#e9e9e9",
          borderRadius: "4px",
        }}
      >
        <p style={{ margin: 0, fontSize: "14px" }}>Your roles:</p>
        <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>
          {roles.length > 0 ? roles.join(", ") : "No roles"}
        </p>
      </div>
    </nav>
  );
}
