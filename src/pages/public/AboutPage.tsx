import { Link } from "react-router-dom";
import { PublicNavbar } from "../../components/shared/PublicNavbar";
import { Footer } from "../../components/shared/Footer";

export function AboutPage() {
  return (
    <div className="min-h-screen bg-background font-body-md flex flex-col pt-20">
      <PublicNavbar />
      <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full">
        {/* hero section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl shadow-sm border border-surface-dim bg-white">
              <img src="/dermify-logo.png" className="w-16 h-16 object-contain" alt="Skintuition Logo" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-6xl font-extrabold text-primary mb-6 font-serif italic tracking-tight">
            About Skintuition
          </h1>
          <p className="text-xl text-secondary leading-relaxed font-medium">
            We are building technology that makes it faster and less stressful
            for people to understand when their skin needs professional
            attention — without replacing the doctors who provide that care.
          </p>
        </div>

        {/* mission section */}
        <div className="bg-white border border-surface-dim rounded-2xl p-8 md:p-12 shadow-sm mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4 font-serif italic">
            Our Mission
          </h2>
          <p className="text-secondary leading-relaxed mb-4">
            Dermatology is one of the most under-resourced specialties in
            healthcare. Average appointment wait times can exceed 30 days —
            during which patients are left unsure whether their concern is
            routine or urgent. That uncertainty is stressful, and in some cases,
            it leads people to either panic unnecessarily or delay care they
            needed sooner.
          </p>
          <p className="text-secondary leading-relaxed">
            concern so they can make an informed decision about next steps. We want to be the first call people make, not the last
            resort.
          </p>
        </div>

        {/* values grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-surface-dim text-center hover:shadow transition-shadow">
            <div className="flex justify-center mb-4 text-primary bg-primary/5 w-16 h-16 mx-auto rounded-full items-center">
              <span className="material-symbols-outlined text-[32px]">workspace_premium</span>
            </div>
            <h3 className="font-bold text-primary text-xl mb-2 font-serif italic">
              Clinical Rigour
            </h3>
            <p className="text-secondary text-sm leading-relaxed">
              Our AI models are developed with input from board-certified
              dermatologists. Every screening report includes a transparency
              score so you always know how much weight to place on the result.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-surface-dim text-center hover:shadow transition-shadow">
            <div className="flex justify-center mb-4 text-emerald-600 bg-emerald-50 w-16 h-16 mx-auto rounded-full items-center">
              <span className="material-symbols-outlined text-[32px]">health_and_safety</span>
            </div>
            <h3 className="font-bold text-primary text-xl mb-2 font-serif italic">
              Patients Come First
            </h3>
            <p className="text-secondary text-sm leading-relaxed">
              We designed every part of this platform around reducing anxiety
              and increasing clarity. No medical jargon, no unnecessary
              friction, and no rushing patients into decisions they don't
              understand.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-surface-dim text-center hover:shadow transition-shadow">
            <div className="flex justify-center mb-4 text-red-600 bg-red-50 w-16 h-16 mx-auto rounded-full items-center">
              <span className="material-symbols-outlined text-[32px]">favorite</span>
            </div>
            <h3 className="font-bold text-primary text-xl mb-2 font-serif italic">
              Equitable Access
            </h3>
            <p className="text-secondary text-sm leading-relaxed">
              Access to quick dermatology input should not depend on your
              geography or income. Skintuition is free to use for screening, with
              the goal of helping people in under-served communities get faster
              answers.
            </p>
          </div>
        </div>

        {/* what we are not */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 mb-12 shadow-sm">
          <h2 className="text-2xl font-bold text-amber-900 mb-4 flex items-center gap-3 font-serif italic">
            <span className="material-symbols-outlined text-[28px]">lock</span>
            What Skintuition Is — and Is Not
          </h2>
          <ul className="space-y-3 text-amber-900 text-sm leading-relaxed font-medium">
            <li className="flex gap-2 items-start">
              <span className="material-symbols-outlined text-emerald-600 mt-0.5 text-[20px]">check_circle</span>
              <span><span className="font-bold text-emerald-700">It IS</span> an AI-assisted preliminary triage tool that helps assess the urgency of a skin concern.</span>
            </li>

            <li className="flex gap-2 items-start">
              <span className="material-symbols-outlined text-red-600 mt-0.5 text-[20px]">cancel</span>
              <span><span className="font-bold text-red-700">It is NOT</span> a replacement for a clinical diagnosis by a qualified healthcare provider.</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="material-symbols-outlined text-red-600 mt-0.5 text-[20px]">cancel</span>
              <span><span className="font-bold text-red-700">It is NOT</span> a source of medical treatment recommendations or prescriptions.</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="material-symbols-outlined text-red-600 mt-0.5 text-[20px]">cancel</span>
              <span><span className="font-bold text-red-700">It is NOT</span> intended to be used as a substitute for emergency medical services.</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-surface-dim flex flex-col md:flex-row items-start gap-6">
          <div className="bg-primary/5 p-4 rounded-full text-primary shrink-0">
            <span className="material-symbols-outlined text-[40px]">public</span>
          </div>
          <div>
            <h3 className="font-bold text-primary text-2xl mb-2 font-serif italic">
              Built to Scale Responsibly
            </h3>
            <p className="text-secondary leading-relaxed">
              Our infrastructure is built for global healthcare standards —
              HIPAA-compliant in the United States and designed with GDPR
              principles for international users. We continuously improve our AI
              models under the oversight of medical advisors to ensure the
              platform remains accurate, safe, and beneficial as we grow.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
