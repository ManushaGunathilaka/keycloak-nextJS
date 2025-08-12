"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems } from "@/data/navigationItems";

interface SidebarProps {
  roles: string[];
}

export default function Sidebar({ roles }: SidebarProps) {
  const pathname = usePathname();

  const hasPermission = (requiredRoles: string[]) => {
    return requiredRoles.some((role) => roles.includes(role));
  };

  const filteredNavItems = navigationItems.filter((item) =>
    hasPermission(item.requiredRoles)
  );

  return (
    <nav className="w-64 bg-gray-100 p-5 border-r border-gray-300">
      <h2 className="mb-5 text-lg font-semibold">Navigation</h2>

      <ul className="list-none p-0 space-y-2">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block px-4 py-2 rounded transition-colors duration-200 ${
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-800 hover:bg-gray-200"
                }`}
              >
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 p-3 bg-gray-200 rounded">
        <p className="m-0 text-sm font-medium">Your roles:</p>
        <p className="m-0 text-xs text-gray-600">
          {roles.length > 0 ? roles.join(", ") : "No roles"}
        </p>
      </div>
    </nav>
  );
}
