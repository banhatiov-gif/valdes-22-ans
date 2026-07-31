import type { Metadata } from "next";
import AdminWishesClient from "@/components/AdminWishesClient";

export const metadata: Metadata = {
  title: "Vœux — accès privé",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminWishesClient />;
}
