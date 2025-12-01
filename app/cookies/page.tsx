export default function CookiesPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <section className="border-b border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Cookie Policy</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">Last updated: November 2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="space-y-8 text-muted-foreground">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">What Are Cookies?</h2>
            <p>
              Cookies are small text files that are stored on your device (computer, mobile phone, tablet, etc.) when
              you visit a website. They help websites to function properly and provide information to the website
              owners.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">How We Use Cookies</h2>
            <p className="mb-4">ConvertHub uses cookies for the following purposes:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Session Management:</strong> To keep you logged in and maintain your preferences
              </li>
              <li>
                <strong>User Preferences:</strong> To remember your language and interface preferences
              </li>
              <li>
                <strong>Security:</strong> To protect against fraud and malicious activity
              </li>
              <li>
                <strong>Analytics:</strong> To understand how users interact with ConvertHub (optional)
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Types of Cookies We Use</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Essential Cookies</h3>
                <p>These are necessary for the website to function properly and cannot be disabled.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Performance Cookies</h3>
                <p>
                  These help us understand how visitors use the website and improve our services. They are not essential
                  to functionality.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Preference Cookies</h3>
                <p>
                  These remember your choices to provide a personalized experience, such as language or theme
                  preferences.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Your Cookie Choices</h2>
            <p className="mb-4">
              Most browsers allow you to refuse cookies or alert you when cookies are being sent. You can typically find
              these settings in your browser settings. However, if you disable cookies, some features of ConvertHub may
              not work properly.
            </p>
            <p>
              You can also manage your cookie preferences through most modern browsers using their privacy/settings
              options.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Third-Party Cookies</h2>
            <p>
              ConvertHub does not currently use third-party services that place cookies on your device. We are committed
              to maintaining your privacy and data security.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Data Privacy</h2>
            <p>
              We do not sell or share your personal information with third parties. All data processed through
              ConvertHub is handled securely and in accordance with applicable privacy laws.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Changes to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other
              operational, legal, or regulatory reasons. We will notify you of any material changes by posting the
              updated policy on this page.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Contact Us</h2>
            <p>
              If you have questions about our use of cookies or this Cookie Policy, please contact us at
              contact@c.tools.dishis.tech
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
