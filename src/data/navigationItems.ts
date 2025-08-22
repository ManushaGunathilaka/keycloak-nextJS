export const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    requiredRoles: ["default-roles-resturant-uat"],
  },
  {
    name: "Restaurant",
    href: "/restaurant",
    requiredRoles: ["default-roles-resturant-uat"],
  },
  {
    name: "Product Category",
    href: "/productcategory",
    requiredRoles: ["default-roles-resturant-uat", "CUSTOMER"],
  },
  {
    name: "Product",
    href: "/product",
    requiredRoles: ["default-roles-resturant-uat", "CUSTOMER"],
  },
];
