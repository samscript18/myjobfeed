import Layout from "@/components/Layout";

const About = () => (
  <Layout>
    <div className="container py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl font-bold">About JobNest</h1>
        <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
          <p>JobNest is a public job discovery platform designed to connect talented professionals with the best career opportunities across Nigeria and beyond.</p>
          <p>Our mission is simple: make job searching effortless and accessible. No sign-ups, no hidden walls — just browse, search, and apply.</p>
          <p>For employers, we provide a frictionless way to reach thousands of qualified candidates without the overhead of complex hiring platforms.</p>
        </div>
      </div>
    </div>
  </Layout>
);

export default About;
