import { APP_LOGO } from "@/const";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="flex items-center justify-center mb-8">
          <img src={APP_LOGO} alt="AI LUXE" className="h-12" />
        </div>
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Terms of Service</h1>
        <div className="prose prose-lg max-w-none text-gray-700">
          <p className="text-sm text-gray-500 text-center mb-6">Last Updated: December 2, 2025</p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using the AI LUXE platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, you may not access the Service. These Terms apply to all visitors, users, and others who access or use the Service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            AI LUXE provides a white-label AI concierge system for luxury event management, including but not limited to persona cloning, multi-platform messaging, smart bookings, and contract generation. The Service is provided on an "as is" and "as available" basis.
          </p>

          <h2>3. User Accounts</h2>
          <p>
            When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
          </p>

          <h2>4. White-Label and Multi-Tenancy</h2>
          <p>
            The Service supports multi-tenant architecture, allowing clients to use the platform under their own branding ("White-Label"). Each client organization is responsible for its own users and the content generated under its brand. AI LUXE is not responsible for the actions or content of any individual tenant.
          </p>

          <h2>5. Acceptable Use</h2>
          <p>
            You agree not to use the Service:
          </p>
          <ul>
            <li>In any way that violates any applicable national or international law or regulation.</li>
            <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way.</li>
            <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter," "spam," or any other similar solicitation.</li>
            <li>To impersonate or attempt to impersonate AI LUXE, an AI LUXE employee, another user, or any other person or entity.</li>
          </ul>

          <h2>6. Intellectual Property</h2>
          <p>
            The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of AI LUXE and its licensors. The Service is protected by copyright, trademark, and other laws of both the United Arab Emirates and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of AI LUXE.
          </p>

          <h2>7. Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            In no event shall AI LUXE, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>

          <h2>9. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of the Dubai International Financial Centre (DIFC), United Arab Emirates, without regard to its conflict of law provisions.
          </p>

          <h2>10. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>

          <h2>11. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at <a href="mailto:legal@ailuxe.co">legal@ailuxe.co</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
