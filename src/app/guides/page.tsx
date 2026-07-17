import { notFound } from "next/navigation";

// Guides page removed — this route intentionally 404s.
export default function GuidesPage() {
  notFound();
}
