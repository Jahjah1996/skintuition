import { Link } from "react-router-dom";
import { PublicNavbar } from "../../components/shared/PublicNavbar";
import { Footer } from "../../components/shared/Footer";

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background font-body-md flex flex-col pt-20">
      <PublicNavbar />
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-surface-dim p-8 md:p-12">
          <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-surface-dim">
            <div className="bg-primary/5 p-3 rounded-xl border border-primary/10 text-primary">
              <span className="material-symbols-outlined text-[32px]">gavel</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-primary font-serif italic tracking-tight">
              {title}
            </h1>
          </div>
          <div className="prose prose-slate max-w-none text-secondary prose-headings:text-primary prose-headings:font-serif prose-headings:italic prose-a:text-primary prose-strong:text-primary">
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export function PrivacyPolicy() {
  return (
    <LegalPage title="Privacy Policy">
      <p className="text-sm font-medium">Last updated: March 2026</p>

      <h3>Our Commitment to Your Privacy</h3>
      <p>
        At Skintuition, we understand that the information you share with us —
        particularly images of your skin and related health concerns — is among
        the most sensitive data you could provide. We treat it accordingly. This
        policy explains clearly what we collect, how it is used, and how it is
        protected.
      </p>

      <h3>1. What Information We Collect</h3>
      <p>
        We collect only the information necessary to provide our screening
        service:
      </p>
      <ul>
        <li>
          <strong>Account information</strong>: Your name and email address when
          you register.
        </li>
        <li>
          <strong>Uploaded images</strong>: Photographs of skin areas you submit
          for AI screening.
        </li>
        <li>
          <strong>Health notes</strong>: Any optional symptom notes or context
          you provide alongside an upload.
        </li>

      </ul>
      <p>
        We do not collect payment card data directly. If payment is required, it
        is processed securely by our payment provider and we never see or store
        card details.
      </p>

      <h3>2. How We Use Your Data</h3>
      <p>
        Your data is used exclusively to provide the AI screening service. Specifically:
      </p>
      <ul>
        <li>
          To generate a preliminary triage assessment of your submitted image.
        </li>


        <li>
          To improve the safety and accuracy of our AI systems under strict
          medical supervision.
        </li>
      </ul>
      <p>
        <strong>We never sell your data.</strong> We do not share your
        information with advertisers, data brokers, or third parties for
        commercial purposes — under any circumstances.
      </p>

      <h3>3. Data Retention &amp; Automatic Deletion</h3>
      <p>
        Uploaded images are automatically deleted from our primary servers after
        AI analysis is complete, unless you have explicitly opted in to retain
        them within your secure encrypted patient record.
      </p>

      <h3>4. Security Standards</h3>
      <p>
        Access to patient data is enforced at the database level — no staff member can
        access individual patient records without a documented clinical reason.
      </p>

      <h3>5. Your Rights</h3>
      <p>
        You have the right to request a copy of your data, correct inaccuracies,
        or request deletion of your account and associated records at any time.
        To exercise these rights, contact us at{" "}
        <strong>privacy@skintuition.com</strong>. We respond to all
        privacy requests within 14 business days.
      </p>

      <h3>6. Changes to This Policy</h3>
      <p>
        We will notify registered users of material changes to this policy via
        email at least 14 days before they take effect. Continued use of the
        platform after that date constitutes acceptance of the updated policy.
      </p>
    </LegalPage>
  );
}

export function MedicalDisclaimer() {
  return (
    <LegalPage title="Medical Disclaimer">
      <p className="text-sm font-medium">Last updated: March 2026</p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 my-6 flex items-start gap-3 not-prose shadow-sm">
        <span className="material-symbols-outlined text-[20px] text-amber-700 shrink-0 mt-0.5">warning</span>
        <p className="text-amber-900 text-sm font-medium">
          If you are experiencing a medical emergency, stop reading this page
          and call <strong>911</strong> or go to your nearest emergency department immediately.
        </p>
      </div>

      <h3>This Platform Is a Triage Tool — Not a Diagnosis</h3>
      <p>
        Skintuition provides AI-assisted visual screening of skin images to help
        users understand the approximate priority level of their concern. This
        is fundamentally different from a clinical medical diagnosis. The output
        of our AI is a <strong>preliminary triage assessment</strong> — a tool
        to help you decide whether and how urgently to seek professional medical
        care.
      </p>
      <p>
        The AI screening report produced by Skintuition is <strong>NOT</strong> a
        substitute for, and should never be treated as equivalent to, a
        diagnosis, prognosis, or treatment recommendation from a qualified,
        licensed healthcare provider.
      </p>

      <h3>AI Limitations You Should Understand</h3>
      <ul>
        <li>
          AI models can make errors. No automated system is 100% accurate.
        </li>
        <li>
          The accuracy of any screening depends on the quality of the uploaded
          image. Poor lighting, blurriness, or unusual angles may affect the
          result.
        </li>
        <li>
          The AI has been trained on a broad dataset of skin images but may
          perform differently across different skin tones, body locations, or
          rare presentations.
        </li>
        <li>
          A "Low Risk" triage result does not guarantee the absence of a serious
          condition. If you remain concerned, please consult a doctor regardless
          of the AI output.
        </li>
      </ul>

      <h3>Always Consult a Qualified Healthcare Professional</h3>
      <p>
        Never delay seeking medical advice, or disregard professional medical
        guidance, because of something you read or saw on this platform. Always
        consult your primary care physician or a licensed dermatologist for any
        skin-related condition or concern.
      </p>

      <h3>No Prescriptions or Treatment Recommendations</h3>
      <p>
        provide any form of clinical intervention.
      </p>

      <h3>Emergency Situations</h3>
      <p>
        This platform is not designed for or appropriate in emergency or
        time-critical medical situations. If you or someone else requires
        immediate medical assistance, call 911 (USA) or your local emergency
        number without delay.
      </p>
    </LegalPage>
  );
}

export function TermsOfUse() {
  return (
    <LegalPage title="Terms of Use">
      <p className="text-sm font-medium">Last updated: March 2026</p>

      <h3>1. Acceptance of These Terms</h3>
      <p>
        By creating an account or using any part of the Skintuition platform, you
        confirm that you have read, understood, and agree to these Terms of Use.
        If you do not agree, you must not use the platform.
      </p>

      <h3>2. Nature of the Service</h3>
      <p>
        Skintuition provides AI-assisted skin image screening. It is not a
        medical practice, it does not employ physicians directly, and it does
        not provide clinical diagnoses or treatment. All screening results are
        preliminary and informational only.
      </p>

      <h3>3. Eligibility</h3>
      <p>
        You must be at least 18 years of age to create an account. If you are
        setting up an account on behalf of a minor, you confirm that you are
        their legal guardian and accept full responsibility for their use of the
        platform.
      </p>

      <h3>4. User Responsibilities</h3>
      <ul>
        <li>
          You must provide accurate registration information and keep your
          account secure.
        </li>
        <li>
          You must only upload images of your own skin, or images for which you
          have the explicit legal consent of the subject.
        </li>
        <li>
          You may not misuse the platform, attempt to reverse-engineer its AI
          systems, or use it for any commercial purpose without prior written
          agreement.
        </li>

      </ul>

      <h3>5. Medical Responsibility</h3>
      <p>
        You acknowledge that this platform does not constitute the provision of
        medical care, and that all clinical decisions rest with you and your
        licensed healthcare provider. You are encouraged to seek professional
        medical advice regardless of the triage output generated by our AI.
      </p>

      <h3>6. Service Availability</h3>
      <p>
        We make reasonable efforts to maintain platform availability but do not
        guarantee uninterrupted service. Scheduled maintenance or unforeseen
        outages may occur. AI triage results are probabilistic in nature and are
        subject to the limitations described in our Medical Disclaimer.
      </p>

      <h3>7. Intellectual Property</h3>
      <p>
        All content, branding, AI models, and underlying software on this
        platform are the intellectual property of Skintuition Ltd. and may not be
        reproduced, copied, or distributed without express written permission.
      </p>

      <h3>8. Limitation of Liability</h3>
      <p>
        To the fullest extent permitted by law, Skintuition Ltd. shall not be
        liable for any direct, indirect, or consequential harm arising from
        reliance on the AI screening output, technical errors, or any failure of
        the platform outside of our direct control.
      </p>

      <h3>9. Changes to These Terms</h3>
      <p>
        We may update these Terms from time to time. We will provide reasonable
        notice of material changes via email. Your continued use of the platform
        after changes take effect constitutes acceptance.
      </p>
    </LegalPage>
  );
}
