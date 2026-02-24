import Layout from "@/components/Layout";

const Terms = () => (
  <Layout>
    <div className="container py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl font-bold">Terms of Service</h1>
        <div className="mt-6 space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>Last updated: February 2026</p>
          <p>By using JobNest, you agree to these terms. Please read them carefully.</p>
          <h2 className="font-display text-lg font-semibold text-foreground pt-4">Use of Service</h2>
          <p>JobNest provides a public job listing platform. Job seekers may browse without an account. Employers may post jobs subject to moderation.</p>
          <h2 className="font-display text-lg font-semibold text-foreground pt-4">Job Postings</h2>
          <p>Employers are responsible for the accuracy of job postings. JobNest reserves the right to remove any listing that violates our guidelines.</p>
          <h2 className="font-display text-lg font-semibold text-foreground pt-4">Limitation of Liability</h2>
          <p>JobNest is not responsible for the outcome of any job application or hiring decision made through the platform.</p>
        </div>
      </div>
    </div>
  </Layout>
);

export default Terms;
