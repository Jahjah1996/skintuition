import { Link } from "react-router-dom";
import { PublicNavbar } from "../../components/shared/PublicNavbar";
import { Footer } from "../../components/shared/Footer";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-on-background font-body-md antialiased overflow-x-hidden">
      <PublicNavbar />

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[700px] flex items-start overflow-hidden px-10 pt-[140px] pb-20">
          <div className="absolute inset-0 z-0">
            <img
              alt="Dermatology Clinic Background"
              className="w-full h-full object-cover opacity-20"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyZWy2cocHfhdVtBDPkzE_m2CKvzCPPqHvzDPjBFZdD9V-YhIoa1mTuUliaFuCF5OAfTpSZybn-GdT_U7u1CMvFdy43Xkc0yHyYP5GYHb5zdmDJSWBvTGfz7bMVvCN8xJMJ919sV5wQ1_po1GeXTHhn3BicVYYuuS5RPJvZVPm3yB572oyf7DPTMtQa3lz7JeH1r24A9_VKiyQ3qMU7dvFaGFMANlxLgRhKX2plOxFmOYRRIotoxQwJ_EYDULd4qguF_p-kl2xryM"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent"></div>
          </div>
          <div className="container mx-auto relative z-10 grid grid-cols-12 gap-grid-gutter">
            <div className="col-span-12 md:col-span-7 space-y-8">
              <span className="font-data-display text-data-display text-primary uppercase tracking-[0.2em]">
                Dermatology Precision AI
              </span>
              <h1 className="font-display-lg text-display-lg text-primary max-w-2xl">
                Your skin's health, <br />
                <span className="italic">decoded</span> with clinical intelligence.
              </h1>
              <p className="font-body-lg text-body-lg text-secondary max-w-xl">
                Experience the sanctuary of high-end skincare through the lens of
                advanced medical technology. Start your professional-grade
                assessment today.
              </p>
              <div className="pt-4 flex gap-4 items-center">
                <Link to="/patient/upload">
                  <button className="bg-primary text-on-primary px-8 py-4 rounded-full font-body-md font-medium tracking-wide shadow-lg hover:shadow-xl transition-all scale-100 hover:scale-105 active:scale-95 relative overflow-hidden group">
                    <span className="relative z-10">Start My Scan</span>
                    <div className="absolute inset-0 bg-white/10 scale-0 group-hover:scale-150 transition-transform duration-700 rounded-full"></div>
                  </button>
                </Link>
                <Link to="/about">
                  <button className="border border-secondary px-8 py-4 rounded-full font-body-md text-secondary hover:bg-secondary/5 transition-colors">
                    View Methodology
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid Services */}
        <section className="px-10 py-section-gap max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-auto">
            <div className="md:col-span-2 bg-white rounded-[24px] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] relative overflow-hidden h-[400px]">
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-40 mix-blend-multiply">
                <img
                  alt="Clinical Analysis"
                  className="w-full h-full object-cover rounded-l-[100%]"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAbGH5tQtwwIRaHBTP2c_j7pT-APpIDh61Ks6_r9Nb8gebHJVTX4eprWTD6Kl3negvJY_28_wmmutqkOV89Rpb6IbHOBqgQKiuV9fFlpHg3tABYGuYVXlqQNOWpRq_UbeWZkeSgqA6hGNN03xuZv9XTePXyrap2qm1j7NGDFF9zokOImwjlm8xtyQwo4cLijmBJqwJQiCWZLZu0SQRGV1nddOU0fgItVcZ6J2Shuj4GR1DEg8vghpyTfPy3oD1JgjYgOUsXPut_AM"
                />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-end max-w-[50%]">
                <h3 className="font-headline-lg text-headline-lg text-primary mb-4">
                  Precision Analysis
                </h3>
                <p className="font-body-md text-secondary mb-6">
                  Our AI detects patterns invisible to the naked eye, mapping over
                  200 health markers in seconds.
                </p>
                <Link
                  to="/patient/upload"
                  className="font-data-display text-data-display text-primary flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  EXPLORE THE TECHNOLOGY{" "}
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>

            <div className="bg-primary-container text-on-primary-container rounded-[24px] p-8 shadow-xl flex flex-col justify-between">
              <span className="material-symbols-outlined text-4xl text-on-primary-container/40">
                clinical_notes
              </span>
              <div>
                <h3 className="font-headline-md text-headline-md text-white mb-2 italic">
                  Clinical Protocols
                </h3>
                <p className="font-body-md opacity-80 mb-6">
                  Each recommendation is cross-referenced with global
                  dermatological databases.
                </p>
                <Link to="/about">
                  <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors">
                    Learn More
                  </button>
                </Link>
              </div>
            </div>

            <div className="bg-secondary-container rounded-[24px] p-8 flex flex-col items-center text-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-secondary">
                  verified_user
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary">
                Privacy Shield™
              </h3>
              <p className="font-body-md text-on-secondary-container">
                Your data is encrypted using military-grade standards, ensuring
                absolute anonymity.
              </p>
            </div>

            <div className="md:col-span-2 bg-white rounded-[24px] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="font-headline-lg text-headline-lg text-primary mb-4">
                  Tailored Regimens
                </h3>
                <p className="font-body-md text-secondary mb-4">
                  Forget generic products. Skintuition designs a morning and
                  evening ritual based on your Ai analysis.
                </p>
                <div className="flex gap-4">
                  <span className="p-2 bg-background rounded-full">
                    <span className="material-symbols-outlined text-primary">
                      eco
                    </span>
                  </span>
                  <span className="p-2 bg-background rounded-full">
                    <span className="material-symbols-outlined text-primary">
                      science
                    </span>
                  </span>
                  <span className="p-2 bg-background rounded-full">
                    <span className="material-symbols-outlined text-primary">
                      water_drop
                    </span>
                  </span>
                </div>
              </div>
              <img
                alt="Skincare Products"
                className="w-full h-48 object-cover rounded-xl"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdn51JDgzXgK3Xe0XW6RfrQXR5N4hDziGm5SyqiYxgPXsjggsLxjm5p0LKt-NCSBoY-VxjI4xANSYktIwmDEhgi6__QE1nRO4e2jOKvyAiD_5W8GxPCLuUXtLsI09M1fRz01-kimntt5MgpZvSdHymaqN5p2Qxt9UjlKjCpPhDd-8bprVFFPt2dbJf3kQ6U1O_pNmXBcjCAEEG7Ihj1H_7wMyeVaciVfElfCsHghKGfHjU-ZHuvgMC-bQ2lCQCBGhdH7yIIXKrZXU"
              />
            </div>
          </div>
        </section>

        {/* Glassmorphic AI Section */}
        <section className="px-10 py-section-gap bg-surface-container overflow-hidden">
          <div className="container mx-auto grid grid-cols-12 gap-grid-gutter items-center">
            <div className="col-span-12 md:col-span-5 order-2 md:order-1">
              <div className="relative">
                <img
                  alt="AI Mapping"
                  className="w-full rounded-[40px] shadow-2xl"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXQJQtUlVuy0IXAh25Fs8ue3T6mckt6mRnH_aA30JEhd3rBTWiuXKLy584m_cMP4rwCrcIp3ztmVoENFsBP9pq6huzs6n4H2zdX4UkHV-RWtFFlmHbdfFNYWpADp9gJtIHZ8kOLxCziE96ZDZPMF1ewXb_IUJiL-n8iEuuVZ44LJ8cjqZY5vzCbqTe2FrS3i6nvLve3iLO1I363YeVn13YIBo9eOT4NppEVq039qD5H1wJcY6APicpx_a8sp8ieb6dJ-p3MMI8LzA"
                />
                {/* Glass Overlay */}
                <div className="absolute -bottom-10 -right-10 bg-white/70 backdrop-blur-xl p-8 rounded-[32px] border border-white/20 shadow-2xl max-w-sm hidden md:block">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="font-data-display text-data-display text-primary">
                      SCANNING HYDRATION LEVEL... 88%
                    </span>
                  </div>
                  <p className="font-body-md text-secondary italic">
                    "Epidermal barrier strength optimal. Slight hyperpigmentation
                    detected in zone 4."
                  </p>
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-6 md:offset-1 order-1 md:order-2 space-y-6">
              <h2 className="font-display-lg text-display-lg text-primary italic">
                Intelligence at the surface.
              </h2>
              <p className="font-body-lg text-body-lg text-secondary">
                Our platform bridges the gap between expensive clinic visits and
                home maintenance. By utilizing multi-spectral analysis from your
                mobile device, Skintuition provides a level of depth previously
                reserved for world-class dermatology labs.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 font-body-md text-primary">
                  <span
                    className="material-symbols-outlined text-emerald-800"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  Texture and Pore Refinement
                </li>
                <li className="flex items-center gap-3 font-body-md text-primary">
                  <span
                    className="material-symbols-outlined text-emerald-800"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  UV Damage Assessment
                </li>
                <li className="flex items-center gap-3 font-body-md text-primary">
                  <span
                    className="material-symbols-outlined text-emerald-800"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  Inflammation & Sensitivity Tracking
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Newsletter / CTA */}
        <section className="px-10 py-section-gap text-center max-w-3xl mx-auto">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-6">
            Stay informed on skin health.
          </h2>
          <p className="font-body-md text-secondary mb-8">
            Join our curated list of individuals committed to longevity and
            precision care.
          </p>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              className="flex-grow bg-surface-container border-none rounded-full px-8 py-4 focus:ring-1 focus:ring-primary font-body-md outline-none"
              placeholder="Your clinical email"
              type="email"
            />
            <button className="bg-primary text-on-primary px-10 py-4 rounded-full font-body-md font-medium">
              Subscribe
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
