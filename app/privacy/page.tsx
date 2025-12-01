export default function PrivacyPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

      <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-3">1. Privacy First Principle</h2>
          <p>
            ConvertHub is built on the principle that your privacy matters. We do not store, track, or share your files.
            Client-side conversions happen entirely on your device.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-3">2. Data We Don't Collect</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>We don't store your files after conversion</li>
            <li>We don't track what you convert</li>
            <li>We don't create conversion logs</li>
            <li>We don't sell or share your data</li>
            <li>We don't use files for ML training</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-3">3. Client-Side Processing</h2>
          <p>
            For files under 50MB, all processing happens in your browser. Your files never leave your device. This is
            the most secure way to handle your data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-3">4. Server Processing</h2>
          <p>
            For larger files, we process them on secure servers with HTTPS encryption. Files are automatically deleted
            after conversion and are never stored or accessed again.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-3">5. Cookies & Tracking</h2>
          <p>
            We use minimal cookies for essential functionality only (session management, preferences). We don't use
            tracking pixels or analytics that identify you personally.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-3">6. Third-Party Services</h2>
          <p>
            We host on secure infrastructure but don't share data with third parties. Payment processing uses
            PCI-compliant providers but no conversion data is shared.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-3">7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Know what data we collect (minimal)</li>
            <li>Request deletion of any stored data</li>
            <li>Export your data in portable format</li>
            <li>Opt-out of non-essential tracking</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-3">8. Security</h2>
          <p>
            All data in transit is encrypted with HTTPS/TLS. We follow industry security best practices to protect
            against unauthorized access.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-3">9. Changes to This Policy</h2>
          <p>We will notify you of any significant changes to this privacy policy. Last updated: November 30, 2025.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-3">10. Contact</h2>
          <p>Questions about your privacy? Contact us at privacy@converthub.com. We respond within 48 hours.</p>
        </section>
      </div>
    </div>
  )
}
