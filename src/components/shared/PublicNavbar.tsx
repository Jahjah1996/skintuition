import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../../config/supabase";

export function PublicNavbar() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();
  const modalLinkState = { backgroundLocation: location };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="fixed top-0 flex justify-between items-center w-full px-6 md:px-10 py-4 bg-white/80 backdrop-blur-md border-b border-surface-dim shadow-sm z-50">
      <div className="flex items-center gap-12">
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <span className="text-2xl font-bold text-primary font-serif italic tracking-tight">
            Skintuition
          </span>
        </Link>
        <nav className="hidden md:flex gap-8">
          {isAuthenticated && (
            <Link
              to="/patient"
              className="text-primary font-body-md hover:text-primary/80 transition-colors"
            >
              Dashboard
            </Link>
          )}
        </nav>
      </div>

      <div className="flex items-center gap-6 text-primary">
        {isAuthenticated === null ? (
          <div className="h-8 w-24 bg-surface-dim animate-pulse rounded-full" />
        ) : isAuthenticated ? (
          <>
            <button className="scale-95 active:scale-90 transition-transform">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <Link to="/patient">
              <button className="scale-95 active:scale-90 transition-transform">
                <span className="material-symbols-outlined">account_circle</span>
              </button>
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              state={modalLinkState}
              className="text-sm font-medium text-secondary hover:text-primary transition-colors hidden sm:block"
            >
              Log In
            </Link>
            <Link to="/register" state={modalLinkState}>
              <button className="bg-primary text-on-primary px-5 py-2 rounded-full font-body-md font-medium tracking-wide shadow-sm hover:shadow transition-all scale-100 hover:scale-105 active:scale-95">
                Get Started
              </button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
