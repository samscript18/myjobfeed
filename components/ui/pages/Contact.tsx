"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { ContactUsType } from "@/lib/types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { contactUs } from "@/lib/services/contact.service";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";

const Contact = () => {
	const [openFaq, setOpenFaq] = useState<string>("faq-0");

	const faqs = [
		{
			q: "Is MyJobFeed really free?",
			a: "Yes! Job searching and applying is completely free for everyone. No hidden fees or subscriptions needed.",
		},
		{
			q: "How long does it take to get a response?",
			a: "We typically respond to inquiries within 24 business hours. During peak times, it may take up to 48 hours.",
		},
		{
			q: "Can I post jobs on MyJobFeed?",
			a: "Yes! Employers can post jobs for free. Just head to our Post a Job page and follow the simple steps.",
		},
		{
			q: "What areas does MyJobFeed cover?",
			a: "We focus on opportunities across your country.",
		},
	];

	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<ContactUsType>({});

	const { mutateAsync: _contactUs, isPending: contactUsPending } = useMutation({
		mutationKey: ["contact-us"],
		mutationFn: contactUs,
		onSuccess(data) {
			toast.success(data.message);
		},
		onError(error) {
			toast.error(error.message);
		},
	});

	const submit = async (data: ContactUsType) => {
		await _contactUs(data);
	};

	return (
		<Layout>
			<section className="relative overflow-hidden py-20 md:py-28 max-md:px-4">
				<div className="container">
					<div className="mx-auto max-w-3xl text-center">
						<h1 className="font-display text-5xl md:text-6xl font-bold leading-tight">Get In Touch</h1>
						<p className="mt-6 text-lg text-muted-foreground">Have a question or feedback? We&#39;d love to hear from you. Our team is ready to help.</p>
					</div>
				</div>
			</section>

			<section className="py-20 bg-linear-to-b from-primary/5 to-transparent rounded-2xl">
				<div className="container">
					<div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
						<div className="p-8">
							<h2 className="font-display text-3xl font-bold mb-2">Send Us a Message</h2>
							<p className="text-muted-foreground mb-8">Fill out the form below and we&#39;ll get back to you as soon as possible.</p>

							<form onSubmit={handleSubmit(submit)} className="space-y-5">
								<div>
									<Label htmlFor="name" className="text-base font-semibold">
										Full Name
									</Label>
									<Input
										id="name"
										placeholder="Your name"
										type="text"
										required
										className="mt-2 h-11"
										{...register("name", {
											required: {
												value: true,
												message: "Full name is required",
											},
										})}
										helperText={errors.name?.message}
									/>
								</div>

								<div>
									<Label htmlFor="email" className="text-base font-semibold">
										Email Address
									</Label>
									<Input
										id="email"
										type="email"
										placeholder="your@email.com"
										required
										className="mt-2 h-11"
										{...register("email", {
											required: {
												value: true,
												message: "Email address is required",
											},
										})}
										helperText={errors.email?.message}
									/>
								</div>

								<div>
									<Label htmlFor="subject" className="text-base font-semibold">
										Subject
									</Label>
									<Input
										id="subject"
										placeholder="What is this about?"
										className="mt-2 h-11"
										type="text"
										required
										{...register("subject", {
											required: {
												value: true,
												message: "Subject is required",
											},
										})}
										helperText={errors.subject?.message}
									/>
								</div>

								<div>
									<Label htmlFor="message" className="text-base font-semibold">
										Message
									</Label>
									<Textarea
										id="message"
										placeholder="Tell us more..."
										required
										rows={6}
										className="mt-2 resize-none"
										{...register("message", {
											required: {
												value: true,
												message: "Message is required",
											},
										})}
										helperText={errors.message?.message}
									/>
								</div>

								<Button
									type="submit"
									className="w-full h-11 bg-linear-to-r from-primary to-primary/90 text-white font-semibold hover:shadow-lg transition-all cursor-pointer"
									disabled={contactUsPending}
								>
									{contactUsPending ? "Sending..." : "Send Message"}
								</Button>
							</form>
						</div>

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

			<section className="py-20">
				<div className="container">
					<div className="text-center mb-12">
						<h2 className="font-display text-4xl font-bold mb-3">Frequently Asked Questions</h2>
						<p className="text-muted-foreground text-lg">Quick answers to common questions</p>
					</div>

					<div className="w-full md:w-[75vw] mx-auto">
						<div className="space-y-4">
							{faqs.map((faq, i) => {
								const faqId = `faq-${i}`;
								const isOpen = openFaq === faqId;

								return (
									<div
										key={faq.q}
										data-state={isOpen ? "open" : "closed"}
										className="group overflow-hidden rounded-2xl border border-border/70 bg-background/80 backdrop-blur-xs shadow-xs transition-all hover:border-primary/40 hover:shadow-md data-[state=open]:border-primary/50 data-[state=open]:bg-primary/5"
									>
										<button
											type="button"
											onClick={() => setOpenFaq(isOpen ? "" : faqId)}
											aria-expanded={isOpen}
											aria-controls={`${faqId}-content`}
											className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-semibold text-lg leading-snug cursor-pointer"
										>
											<span>{faq.q}</span>
											<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-data-[state=open]:bg-primary/20">
												<ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
											</span>
										</button>
										{isOpen ? (
											<div id={`${faqId}-content`} className="overflow-hidden text-muted-foreground animate-accordion-down">
												<div className="px-6 pb-6 pt-1 text-base leading-relaxed">{faq.a}</div>
											</div>
										) : null}
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</section>
		</Layout>
	);
};

export default Contact;
