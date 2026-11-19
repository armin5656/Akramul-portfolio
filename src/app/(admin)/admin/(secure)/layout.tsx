import type { Metadata } from "next";
import "@/app/globals.css";
import Sidebar from "../components/Sidebar";
import { getPageAdminSession } from "@/lib/admin-auth";
import { redirect } from "next/navigation";


export const metadata: Metadata = {
  title: "Admin Panel",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getPageAdminSession();
  if (!session) redirect("/admin");

  return (

        <div className="flex min-h-screen">
          <aside className="max-w-80 min-h-screen bg-gray-900 text-white p-6 fixed">
            {/* Sidebar content */}
            <Sidebar />
          </aside>
          <main className="flex-1 p-8 pl-90 bg-gray-100 dark:bg-gray-950">
            {children}
          </main>
        </div>
  );
}
