export default function TermsPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <section className="border-b border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Terms of Service</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">Last updated: November 2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="space-y-8 text-muted-foreground">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using ConvertHub, you accept and agree to be bound by the terms and provision of this
              agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Use License</h2>
            <p className="mb-4">
              Permission is granted to temporarily download one copy of the materials (information or software) on
              ConvertHub for personal, non-commercial transitory viewing only. This is the grant of a license, not a
              transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Modifying or copying the materials</li>
              <li>Using the materials for any commercial purpose or for any public display</li>
              <li>Attempting to decompile or reverse engineer any software contained on ConvertHub</li>
              <li>Removing any copyright or other proprietary notations from the materials</li>
              <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Disclaimer</h2>
            <p>
              The materials on ConvertHub are provided on an 'as is' basis. DishIs Technologies makes no warranties,
              expressed or implied, and hereby disclaims and negates all other warranties including, without limitation,
              implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement
              of intellectual property or other violation of rights.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Limitations</h2>
            <p>
              In no event shall DishIs Technologies or its suppliers be liable for any damages (including, without
              limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or
              inability to use the materials on ConvertHub.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. File Conversions</h2>
            <p className="mb-4">
              ConvertHub provides tools for converting files between various formats. We make no guarantee about the
              accuracy or quality of conversions. Users assume full responsibility for verifying converted files and
              ensuring they meet their needs.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Limitations on Use</h2>
            <p className="mb-4">You agree not to use ConvertHub for any of the following purposes:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                Transmitting any unlawful, threatening, abusive, defamatory, obscene, or otherwise objectionable
                material
              </li>
              <li>Disrupting the normal flow of dialogue within our website</li>
              <li>Attempting to gain unauthorized access to our systems</li>
              <li>Using automated tools to harvest data from ConvertHub</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Privacy Policy</h2>
            <p>
              Your use of ConvertHub is also governed by our Privacy Policy. Please review our Privacy Policy to
              understand our practices.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Changes to Terms</h2>
            <p>
              DishIs Technologies reserves the right to revise these terms of service at any time without notice. By
              using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">9. Governing Law</h2>
            <p>These terms and conditions are governed by and construed in accordance with the laws of India.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">10. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at contact@c.tools.dishis.tech
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
