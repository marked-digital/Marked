import type { Metadata } from "next";
import BookPage from "@/components/book-page";

export const metadata: Metadata = {
  title: "Book a strategy call",
  description:
    "Book a 30-minute strategy call with Marked Digital. We'll map the fastest path to your next market. No decks, no fluff.",
  alternates: { canonical: "/book" },
};

export default function Book() {
  return <BookPage />;
}
