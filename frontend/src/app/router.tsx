import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import LoginPage from "@/pages/LoginPage";
import AuthCallbackPage from "@/pages/AuthCallbackPage";
import DashboardPage from "@/pages/DashboardPage";
import WardrobePage from "@/pages/WardrobePage";
import OutfitGeneratorPage from "@/pages/OutfitGeneratorPage";
import ShoppingPage from "@/pages/ShoppingPage";
import ProfilePage from "@/pages/ProfilePage";
import SubscriptionPage from "@/pages/SubscriptionPage";
import NotFoundPage from "@/pages/NotFoundPage";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/auth/callback", element: <AuthCallbackPage /> },
  { path: "/subscription", element: <SubscriptionPage /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <RootLayout />
      </ProtectedRoute>
    ),
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
