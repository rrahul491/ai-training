import type { Metadata } from "next";
import "./learning-player.css";

export const metadata: Metadata = {
  title: "Nexora Learning Portal",
  description: "Interactive required-learning experience for employees",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
