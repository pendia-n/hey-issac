import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx", { id: "home-index" }),
  route("*", "routes/home.tsx"),
] satisfies RouteConfig;
