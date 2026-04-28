import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Recipe App",
  description: "Manage and discover recipes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
