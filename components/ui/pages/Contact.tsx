'use client';

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";
import { useToast } from "@/lib/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useState } from "react";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "hello@myjobfeed.com",
    description: "Get in touch with our support team"
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+234 (0) 123 456 7890",
    description: "Call us during business hours"
  },
  {
    icon: MapPin,
    title: "Office",
    value: "Lagos, Nigeria",
    description: "Visit our main office"
  },
  {
    icon: Clock,
    title: "Hours",
    value: "Mon - Fri, 9AM - 6PM",
    description: "We're here to help"
  },
];

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. We'll get back to you within 24 hours."
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Layout>
      <section className="relative overflow-hidden py-20 md:py-28 -mx-12 max-md:-mx-4">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/5" />
        </div>

        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight">
              Get In Touch
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Have a question or feedback? We&#39;d love to hear from you. Our team is ready to help.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info) => {
              const Icon = info.icon;
              return (
                <Card key={info.title} className="p-6 hover:shadow-lg hover:border-primary/30 transition-all group">
                  <div className="bg-linear-to-br from-primary/20 to-primary/10 w-fit p-3 rounded-lg mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-1">{info.title}</h3>
                  <p className="font-semibold text-primary mb-1">{info.value}</p>
                  <p className="text-sm text-muted-foreground">{info.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-linear-to-b from-primary/5 to-transparent">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div>
              <h2 className="font-display text-3xl font-bold mb-2">Send Us a Message</h2>
              <p className="text-muted-foreground mb-8">Fill out the form below and we&#39;ll get back to you as soon as possible.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="name" className="text-base font-semibold">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    required
                    className="mt-2 h-11"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-base font-semibold">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    className="mt-2 h-11"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="subject" className="text-base font-semibold">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="What is this about?"
                    className="mt-2 h-11"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-base font-semibold">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more..."
                    required
                    rows={6}
                    className="mt-2 resize-none"
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-linear-to-r from-primary to-primary/90 text-white font-semibold hover:shadow-lg transition-all"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>

            {/* Why Contact Us */}
            <div className="flex flex-col justify-center">
              <Card className="p-8 bg-linear-to-br from-primary/5 to-transparent">
                <h3 className="font-display text-2xl font-bold mb-6">Why Reach Out?</h3>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                        <span className="text-lg">💼</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Business Inquiries</h4>
                      <p className="text-sm text-muted-foreground">Interested in partnerships or collaborations</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                        <span className="text-lg">🐛</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Report Issues</h4>
                      <p className="text-sm text-muted-foreground">Found a bug or something not working right</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                        <span className="text-lg">💡</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Feature Requests</h4>
                      <p className="text-sm text-muted-foreground">Have an idea to improve MyJobFeed</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                        <span className="text-lg">❓</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">General Questions</h4>
                      <p className="text-sm text-muted-foreground">Any other inquiries or assistance needed</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold mb-3">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg">Quick answers to common questions</p>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            {[
              {
                q: "Is MyJobFeed really free?",
                a: "Yes! Job searching and applying is completely free for everyone. No hidden fees or subscriptions needed."
              },
              {
                q: "How long does it take to get a response?",
                a: "We typically respond to inquiries within 24 business hours. During peak times, it may take up to 48 hours."
              },
              {
                q: "Can I post jobs on MyJobFeed?",
                a: "Yes! Employers can post jobs for free. Just head to our Post a Job page and follow the simple steps."
              },
              {
                q: "What areas does MyJobFeed cover?",
                a: "We focus on opportunities across your country."
              },
            ].map((faq, i) => (
              <Card key={i} className="p-6 hover:shadow-md transition-all">
                <h4 className="font-semibold text-lg mb-2">{faq.q}</h4>
                <p className="text-muted-foreground">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
