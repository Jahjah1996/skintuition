import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabase";

const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export function SessionWatcher() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timeout);

      // Check if user is actually authenticated before setting inactivity logout
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          timeout = setTimeout(async () => {
            await supabase.auth.signOut();
            if (
              location.pathname.startsWith("/patient") ||
              location.pathname.startsWith("/doctor")
            ) {
              navigate("/login");
            } else {
              window.location.reload();
            }
          }, INACTIVITY_TIMEOUT_MS);
        }
      });
    };

    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];
    events.forEach((event) => document.addEventListener(event, resetTimer));
    resetTimer(); // Initialize

    return () => {
      events.forEach((event) =>
        document.removeEventListener(event, resetTimer),
      );
      clearTimeout(timeout);
    };
  }, [location.pathname, navigate]);

  return null; // Silent wrapper
}
