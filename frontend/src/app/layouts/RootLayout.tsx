import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Header } from "@/components/layout/Header";
import { DrizzyChat } from "@/components/shared/DrizzyChat";
import { useTheme } from "@/hooks/useTheme";

export default function RootLayout() {
  const { pathname } = useLocation();
  useTheme();

  return (
    <div className="min-h-screen kit-page-bg">
      <Sidebar />
      <Header />
      <main className="md:ml-64">
        <div key={pathname} className="animate-frost-reveal">
          <Outlet />
        </div>
      </main>
      <MobileNav />
      <DrizzyChat />
    </div>
  );
}
