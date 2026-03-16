import * as nodemailer from "nodemailer";
import { mailerPass, mailerUser } from "../constants/env";

async function transporter() {
	const account = {
		user: mailerUser,
		pass: mailerPass,
	};

	const mailer = await nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: account.user,
			pass: account.pass,
		},
	});
	return mailer;
}

export { transporter };
