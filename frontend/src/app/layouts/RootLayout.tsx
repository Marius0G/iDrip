import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Header } from "@/components/layout/Header";

export default function RootLayout() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-snowdrift">
      <Sidebar />
      <Header />
      <main className="md:ml-64">
        <div key={pathname} className="animate-frost-reveal">
          <Outlet />
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
