import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { PublicNavbar } from "../shared/PublicNavbar";
import { Footer } from "../shared/Footer";
import { supabase } from "../../config/supabase";

export function AuthLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setUserRole(session?.user?.user_metadata?.role || "patient");
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setUserRole(session?.user?.user_metadata?.role || "patient");
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
    );
  }

  // If already authenticated, redirect away from auth pages
  if (isAuthenticated) {
    return (
      <Navigate to={userRole === "doctor" ? "/doctor" : "/patient"} replace />
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-white">
      <PublicNavbar />
      <div className="flex-1 mt-20 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-emerald-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.12),_transparent_55%)]" />
        <div className="relative z-10 min-h-[calc(100dvh-5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-10">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}
