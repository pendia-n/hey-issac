import type { Route } from "./+types/home";
import HeyIssac from "../legacy-app";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "heyIssac | A calmer way to grow" },
    { name: "description", content: "Bring a website and a question. Leave with an evidence-backed next step." },
  ];
}

export default function Home(_props: Route.ComponentProps) {
  return <HeyIssac />;
}
