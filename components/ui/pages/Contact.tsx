"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { ContactUsType } from "@/lib/types";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { contactUs } from "@/lib/services/contact.service";
import { toast } from "sonner";

const Contact = () => {
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
			<section className="relative overflow-hidden py-20 md:py-28 -mx-12 max-md:-mx-4">
				<div className="absolute inset-0 -z-10">
					<div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/5" />
				</div>

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

								<Button type="submit" className="w-full h-11 bg-linear-to-r from-primary to-primary/90 text-white font-semibold hover:shadow-lg transition-all" disabled={contactUsPending}>
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

					<div className="max-w-2xl mx-auto space-y-4">
						{[
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
