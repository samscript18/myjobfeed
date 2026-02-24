import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message sent!", description: "We'll get back to you soon." });
  };

  return (
    <Layout>
      <div className="container py-16">
        <div className="mx-auto max-w-lg">
          <h1 className="font-display text-3xl font-bold">Contact Us</h1>
          <p className="mt-1 text-muted-foreground">Have a question? We&#39;d love to hear from you.</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div><Label htmlFor="name">Name</Label><Input id="name" required className="mt-1.5" /></div>
            <div><Label htmlFor="email">Email</Label><Input id="email" type="email" required className="mt-1.5" /></div>
            <div><Label htmlFor="message">Message</Label><Textarea id="message" required rows={5} className="mt-1.5" /></div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground font-semibold">Send Message</Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
