import type { Metadata } from "next";
import ApproachPage from "@/components/approach-page";

export const metadata: Metadata = {
  title: "The Approach",
  description:
    "We build growth like architecture. A five-sheet blueprint of the Marked Digital system: foundation, frame, wiring, load test and self-serve scale, drawn layer by layer as you scroll.",
};

export default function Approach() {
  return <ApproachPage />;
}
