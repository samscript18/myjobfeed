import Layout from "@/components/Layout";

const PrivacyPolicy = () => (
  <Layout>
    <div className="container py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl font-bold">Privacy Policy</h1>
        <div className="mt-6 space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>Last updated: February 2026</p>
          <p>Your privacy is important to us. This policy outlines how JobNest collects, uses, and protects your information.</p>
          <h2 className="font-display text-lg font-semibold text-foreground pt-4">Information We Collect</h2>
          <p>We collect minimal information necessary to provide our service, including job posting details and contact information submitted by employers.</p>
          <h2 className="font-display text-lg font-semibold text-foreground pt-4">How We Use Information</h2>
          <p>Information is used solely to display job listings and facilitate the application process. We do not sell personal data.</p>
          <h2 className="font-display text-lg font-semibold text-foreground pt-4">Advertising</h2>
          <p>We use Google AdSense to display ads. Google may use cookies to serve ads based on your browsing activity.</p>
        </div>
      </div>
    </div>
  </Layout>
);

export default PrivacyPolicy;
