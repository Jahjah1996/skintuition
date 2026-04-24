import { Link } from "react-router-dom";
import { Button } from "../../components/core/Button";
import { PublicNavbar } from "../../components/shared/PublicNavbar";
import { Footer } from "../../components/shared/Footer";

export function ContactPage() {
  return (
    <div className="min-h-screen bg-background font-body-md flex flex-col pt-20">
      <PublicNavbar />
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full">
        <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-4 text-center font-serif italic tracking-tight">
          Contact Skintuition
        </h1>
        <p className="text-lg text-secondary mb-8 text-center max-w-2xl mx-auto font-medium">
          Our support team is available to assist with platform access,
          technical issues, and general inquiries about the service.
        </p>

        {/* emergency notice */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-10 flex items-start gap-3 max-w-2xl mx-auto shadow-sm">
          <span className="material-symbols-outlined text-[24px] text-red-600 shrink-0 mt-0.5">warning</span>
          <p className="text-red-800 text-sm font-medium">
            <strong>Medical emergency?</strong> Do not use this contact form.
            Call <strong>911</strong> or go to your nearest emergency department
            immediately.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm border border-surface-dim p-8">
            <h2 className="text-2xl font-bold text-primary mb-2 font-serif italic">
              Send a Message
            </h2>
            <p className="text-sm text-secondary mb-6">
              For platform support, billing questions, or partnership enquiries.
              We respond within 1–2 business days.
            </p>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-semibold text-primary mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full border border-surface-dim rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-surface-lowest text-primary"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full border border-surface-dim rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-surface-lowest text-primary"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-1.5">
                  Subject
                </label>
                <select className="w-full border border-surface-dim rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-surface-lowest text-primary">
                  <option>Technical support</option>
                  <option>Account access</option>
                  <option>Doctor or clinician enquiry</option>
                  <option>Privacy or data request</option>
                  <option>General question</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-1.5">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full border border-surface-dim rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-surface-lowest text-primary resize-none"
                  placeholder="Describe your question or issue..."
                ></textarea>
              </div>
              <Button className="w-full bg-primary text-on-primary hover:bg-primary/90 rounded-full font-bold shadow-sm transition-all h-12">Submit Inquiry</Button>
              <p className="text-xs text-secondary text-center pt-2">
                Please do not include sensitive medical information in this
                form. Use the secure in-app messaging to communicate with your
                assigned doctor.
              </p>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-surface-dim p-8 flex items-start space-x-4">
              <div className="bg-primary/5 p-3 rounded-full text-primary border border-primary/10">
                <span className="material-symbols-outlined text-[24px]">mail</span>
              </div>
              <div>
                <h3 className="font-bold text-primary text-lg font-serif italic mb-0.5">Email Support</h3>
                <p className="text-secondary font-medium">support@skintuition.com</p>
                <p className="text-sm text-secondary mt-1">
                  Response within 1–2 business days
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-surface-dim p-8 flex items-start space-x-4">
              <div className="bg-primary/5 p-3 rounded-full text-primary border border-primary/10">
                <span className="material-symbols-outlined text-[24px]">call</span>
              </div>
              <div>
                <h3 className="font-bold text-primary text-lg font-serif italic mb-0.5">Phone Support</h3>
                <p className="text-secondary font-medium">+1 (800) 555-SKIN</p>
                <p className="text-sm text-secondary mt-1">
                  Mon–Fri, 9 am–5 pm EST
                </p>
                <p className="text-xs text-amber-700 mt-2 font-bold flex items-center gap-1 bg-amber-50 inline-block px-2 py-0.5 rounded border border-amber-200">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  Not for medical emergencies — call 911
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-surface-dim p-8 flex items-start space-x-4">
              <div className="bg-primary/5 p-3 rounded-full text-primary border border-primary/10">
                <span className="material-symbols-outlined text-[24px]">location_on</span>
              </div>
              <div>
                <h3 className="font-bold text-primary text-lg font-serif italic mb-0.5">Headquarters</h3>
                <p className="text-secondary font-medium">123 Medical Innovation Drive</p>
                <p className="text-secondary font-medium">Boston, MA 02115, USA</p>
              </div>
            </div>

            {/* privacy note */}
            <div className="bg-surface-lowest border border-surface-dim rounded-xl p-6 shadow-sm">
              <h4 className="font-bold text-primary mb-2 text-sm">Privacy Inquiries</h4>
              <p className="text-sm text-secondary leading-relaxed font-medium">
                For data access, deletion requests, or privacy concerns under
                HIPAA or GDPR, please email{" "}
                <span className="text-primary font-bold">
                  privacy@skintuition.com
                </span>{" "}
                directly. We aim to respond to all privacy requests within 14
                business days.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
