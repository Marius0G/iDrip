import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Header } from "@/components/layout/Header";

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#0a0a0f] dark:via-[#0d0d14] dark:to-[#0a0a12]">
      <Sidebar />
      <Header />
      <main className="md:ml-64">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  );
}
