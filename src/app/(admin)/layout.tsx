import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className="antialiased"
      >
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}
