export const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboards",
    requiredRoles: ["admin"],
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
  {
    name: "Orders",
    href: "/dashboards/orders",
    requiredRoles: ["admin", "user"],
  },
];
