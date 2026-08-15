import type { Metadata } from "next";
import StackPage from "@/components/stack-page";

export const metadata: Metadata = {
  title: "The Stack",
  description:
    "The right stack, not the biggest one. The commerce, cloud, AI, analytics, and advertising platforms Marked Digital has hands-on experience with, and how we pick the few that fit your business.",
  alternates: { canonical: "/stack" },
};

export default function Stack() {
  return <StackPage />;
}
