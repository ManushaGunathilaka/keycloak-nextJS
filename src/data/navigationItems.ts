export const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboards",
    requiredRoles: ["SOFFCRICKET_ADMIN"],
  },
  {
    name: "Customers",
    href: "/dashboards/customers",
    requiredRoles: ["SOFFCRICKET_ADMIN"],
  },
  {
    name: "Advertisement",
    href: "/dashboards/advertisement",
    requiredRoles: ["SOFFCRICKET_ADMIN", "user"],
  },
  {
    name: "Orders",
    href: "/dashboards/orders",
    requiredRoles: ["SOFFCRICKET_ADMIN", "user"],
  },
];
