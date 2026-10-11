import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/landing.tsx"),
  route("hinneh", "routes/hinneh.tsx"),
  route("pricing", "routes/pricing.tsx"),
  route("about", "routes/about.tsx"),
  route("announcements", "routes/announcements.tsx"),
  route("signup", "routes/signup.tsx"),
  route("signin", "routes/signin.tsx"),
  route("security", "routes/security.tsx"),
  route("profile", "routes/profile.tsx"),
  route("billing", "routes/billing.tsx"),
  route("rooms", "routes/rooms.tsx"),
  route("rooms/new", "routes/new-room.tsx"),
  route("rooms/:id", "routes/room.tsx"),
  route("share", "routes/share.tsx"),
  route("share/:id", "routes/shared-room.tsx"),
] satisfies RouteConfig;
