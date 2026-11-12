import type { Metadata } from "next";
import copy from "@/locales/en-us.json";
import "./learning-player.css";
import "./course-reader.css";

export const metadata: Metadata = {
  title: copy.METADATA.TITLE,
  description: copy.METADATA.DESCRIPTION,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
