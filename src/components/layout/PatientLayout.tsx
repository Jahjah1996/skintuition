import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabase";
import { cn } from "../../utils/cn";
import { NotificationBell } from "../shared/NotificationBell";
import { Footer } from "../shared/Footer";

export function PatientLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    if (location.pathname.startsWith("/patient")) {
      navigate("/login");
    } else {
      window.location.reload();
    }
  };

  const navLinks = [
    { name: "Dashboard", path: "/patient", icon: "space_dashboard" },
    { name: "Scan History", path: "/patient/history", icon: "history" },
    { name: "Education", path: "/patient/education", icon: "menu_book" },
  ];

  return (
    <div className="min-h-screen bg-background text-on-background font-body-md antialiased flex flex-col">
      <nav className="sticky top-0 flex justify-between items-center w-full px-6 md:px-10 py-4 bg-white/80 backdrop-blur-md border-b border-surface-dim shadow-sm z-50">
        <div className="flex items-center gap-12">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <span className="text-2xl font-bold text-primary font-serif italic tracking-tight">
              Skintuition
            </span>
          </Link>
          <div className="hidden sm:flex gap-8">
            {navLinks.map((link) => {
              const isActive =
                location.pathname === link.path ||
                (link.path !== "/patient" &&
                  location.pathname.startsWith(link.path));
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "font-body-md transition-colors flex items-center gap-1.5",
                    isActive
                      ? "text-primary border-b-2 border-primary pb-1"
                      : "text-secondary hover:text-primary"
                  )}
                >
                  <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-6 text-primary">
          <NotificationBell role="patient" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-secondary hover:text-primary transition-colors text-sm font-medium"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Sign Out
          </button>
        </div>

        <div className="-mr-2 flex items-center sm:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-lg text-primary hover:bg-surface-container focus:outline-none"
          >
            <span className="material-symbols-outlined">
              {isMobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMobileMenuOpen &&
        createPortal(
          <div className="sm:hidden fixed inset-0 z-[100] bg-surface-lowest">
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-dim bg-white">
              <span className="text-sm font-semibold text-secondary">Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container text-primary"
                aria-label="Close menu"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="h-[calc(100dvh-4.5rem)] overflow-y-auto bg-background">
              <div className="min-h-full flex flex-col px-6 py-6">
                <div className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                  Navigation
                </div>
                <div className="space-y-2">
                  {navLinks.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                      <Link
                        key={link.name}
                        to={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center justify-between rounded-2xl border px-4 py-4 text-base font-semibold transition",
                          isActive
                            ? "border-primary/30 bg-primary/5 text-primary"
                            : "border-surface-dim text-secondary hover:bg-surface-container"
                        )}
                      >
                        <span className="flex items-center gap-3">
                          <span className="material-symbols-outlined">
                            {link.icon}
                          </span>
                          {link.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-6 border-t border-surface-dim pt-6">
                  <div className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                    Account
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between rounded-2xl border border-surface-dim px-4 py-4 text-base font-semibold text-secondary hover:bg-surface-container"
                  >
                    <span className="flex items-center gap-3">
                      <span className="material-symbols-outlined">logout</span>
                      Sign Out
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 relative">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
