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
			host: 'smtp.gmail.com',
			port: 587,
			secure: false,
			auth: {
				user: 'nintube.rg@gmail.com',
				pass: 'youtoba2020',
			},
			tls: { rejectUnauthorized: false },
		});

		transporter.sendMail(mailOptions);
	}
}

export default new Mail();
