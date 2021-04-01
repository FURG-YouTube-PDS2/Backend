import * as nodemailer from 'nodemailer';
import getButton from '../util/getHtml';

class Mail {
	constructor(public to?: string) {}

	sendMail(mail: string, id: string, cond: number) {
		let mailOptions = {
			from: 'Nintube <nintube.rg@gmail.com',
			to: mail,
			subject: 'Verificação de Email NinTube',
			html: getButton(cond, id),
		};

		const transporter = nodemailer.createTransport({
			host: 'smtp.ethereal.email',
			port: 587,
			secure: STARTTLS,
			auth: {
				user: 'terrill.balistreri@ethereal.email',
				pass: 'CSFXWjhNdATAZa5gMF',
			},
			tls: { rejectUnauthorized: false },
		});

		transporter.sendMail(mailOptions);
	}
}

export default new Mail();
