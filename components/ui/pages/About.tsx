import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { CheckCircle, Target, Users, Zap } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Accessibility",
    description: "Making job search simple and free for everyone, no hidden fees or barriers"
  },
  {
    icon: Zap,
    title: "Speed",
    description: "Lightning-fast job discovery and application process that respects your time"
  },
  {
    icon: Users,
    title: "Community",
    description: "Building a thriving community of job seekers and employers across Africa"
  },
  {
    icon: CheckCircle,
    title: "Trust",
    description: "Verified listings and transparent information you can rely on"
  },
];

const stats = [
  { number: "2,400+", label: "Active Jobs" },
  { number: "850+", label: "Companies" },
  { number: "50K+", label: "Users" },
];

const About = () => (
  <Layout>
    <section className="relative overflow-hidden py-20 md:py-28 -mx-12 max-md:-mx-4">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/5" />
      </div>

      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight">
            Transforming Job Search in Africa
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            MyJobFeed is on a mission to make job searching effortless, accessible, and transparent for everyone.
          </p>
        </div>
      </div>
    </section>

    <section className="py-20">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div>
            <h2 className="font-display text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
              We believe everyone deserves equal access to career opportunities. That&#39;s why we built MyJobFeed — a platform where job searching is simple, transparent, and completely free.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              No sign-ups, no paywalls, no hidden fees. Just browse, search, and apply to opportunities that match your skills and goals.
            </p>
          </div>

          <div className="bg-linear-to-br from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12">
            <div className="space-y-4">
              <div className="flex gap-3">
                <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Free to Use</h3>
                  <p className="text-sm text-muted-foreground">No sign-up required, no subscriptions</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Verified Listings</h3>
                  <p className="text-sm text-muted-foreground">All jobs are verified and legitimate</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Easy Applications</h3>
                  <p className="text-sm text-muted-foreground">Apply directly to hiring managers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="py-20 px-8 rounded-xl bg-linear-to-b from-primary/5 to-transparent">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl font-bold mb-3">Our Values</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">These principles guide everything we do</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <Card key={value.title} className="p-6 hover:shadow-lg hover:border-primary/30 transition-all group">
                <div className="bg-linear-to-br from-primary/20 to-primary/10 w-fit p-3 rounded-lg mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>

    <section className="py-20">
      <div className="container">
        <div className="grid sm:grid-cols-3 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-primary mb-2">{stat.number}</div>
              <p className="text-muted-foreground text-lg">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>


    <section className="py-20 bg-linear-to-r from-primary/5 to-transparent -mx-12 max-md:-mx-4">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-4xl font-bold mb-6 text-center">Looking Ahead</h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-center mb-6">
            Our vision is to be the most trusted job discovery platform in Africa. We&#39;re constantly improving to serve both job seekers and employers better.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed text-center">
            Whether you&#39;re looking for your first job, making a career switch, or hiring top talent, MyJobFeed is here to help you succeed.
          </p>
        </div>
      </div>
    </section>
  </Layout>
);

export default About;
