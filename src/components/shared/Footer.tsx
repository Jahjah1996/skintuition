import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="w-full rounded-t-[40px] py-16 px-12 flex flex-col md:flex-row justify-between items-center gap-8 bg-surface-container border-t border-white/30 mt-20">
      <div className="flex flex-col items-center md:items-start gap-4">
        <span className="font-serif text-lg italic text-emerald-900">
          Skintuition AI
        </span>
        <p className="font-sans text-xs uppercase tracking-widest text-emerald-900 opacity-70">
          © {new Date().getFullYear()} Skintuition AI. Dermatology Precision.
        </p>
      </div>
      <div className="flex gap-12 text-emerald-900">
        <div className="flex flex-col gap-2">
          <Link
            to="/privacy"
            className="font-sans text-xs uppercase tracking-widest font-bold underline hover:opacity-100 transition-opacity"
          >
            Privacy Shield
          </Link>
          <Link
            to="/terms"
            className="font-sans text-xs uppercase tracking-widest opacity-70 hover:opacity-100 transition-opacity"
          >
            Clinical Ethics
          </Link>
          <Link
            to="/about"
            className="font-sans text-xs uppercase tracking-widest opacity-70 hover:opacity-100 transition-opacity"
          >
            Methodology
          </Link>
          <Link
            to="/contact"
            className="font-sans text-xs uppercase tracking-widest opacity-70 hover:opacity-100 transition-opacity"
          >
            Contact
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-4 bg-emerald-50 px-6 py-3 rounded-full border border-emerald-100">
        <span
          className="material-symbols-outlined text-emerald-800"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          shield_with_heart
        </span>
        <span className="font-sans text-xs uppercase tracking-widest text-emerald-900 font-bold">
          HIPAA Compliant
        </span>
      </div>
    </footer>
  );
}
