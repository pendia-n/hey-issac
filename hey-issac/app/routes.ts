import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx", { id: "home" }),
  route("*", "routes/home.tsx", { id: "app-pages" }),
] satisfies RouteConfig;
