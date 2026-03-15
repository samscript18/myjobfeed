import { transporter } from "@/lib/config/email.config";
import { ContactSubmissionEmailTemplate } from "@/lib/templates";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const { name, email, subject, message } = await req.json();

	if (!name || !email || !subject || !message) {
		return NextResponse.json({ message: "All fields are required." });
	}

	try {
		const mailOptions = {
			from: `${email}`,
			to: process.env.MAILER_USER,
			subject: `MyJobFeed Inquiry - ${subject}`,
			html: ContactSubmissionEmailTemplate({ name, email, message }),
		};

		await (await transporter()).sendMail(mailOptions);
		return NextResponse.json({ success: true, message: "Email sent successfully!" }, { status: 200 });
	} catch (error) {
		console.error("Error sending email:", error);
		return NextResponse.json({ success: false, message: "Failed to send email. Please try again later." }, { status: 500 });
	}
}
