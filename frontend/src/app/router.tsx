import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import DashboardPage from "@/pages/DashboardPage";
import WardrobePage from "@/pages/WardrobePage";
import OutfitGeneratorPage from "@/pages/OutfitGeneratorPage";
import ShoppingPage from "@/pages/ShoppingPage";
import ProfilePage from "@/pages/ProfilePage";
import NotFoundPage from "@/pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "wardrobe", element: <WardrobePage /> },
      { path: "generator", element: <OutfitGeneratorPage /> },
      { path: "shopping", element: <ShoppingPage /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);
