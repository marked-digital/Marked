import type { Metadata } from "next";
import StackPage from "@/components/stack-page";

export const metadata: Metadata = {
  title: "The Stack",
  description:
    "Best-in-class tools, wired into one system. The platforms behind Marked Digital — commerce, cloud, AI, analytics, and advertising, orchestrated end-to-end.",
};

export default function Stack() {
  return <StackPage />;
}
