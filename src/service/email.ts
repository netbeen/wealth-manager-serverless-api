import { Provide } from '@midwayjs/decorator';

const nodemailer = require('nodemailer');

@Provide()
export class EmailService {
  async send(receiverEmail: string, subject: string, content: string): Promise<boolean> {
    const transporter = nodemailer.createTransport({
      host: 'smtp.163.com',
      port: 465,
      secure: true,
      auth: {
        user: '15606617716@163.com',
        pass: process.env.SMTP_PASSWORD,
      },
    });
    const result = await transporter.sendMail({
      from: '"Wealth Manager Notification" <15606617716@163.com>', // sender address
      to: receiverEmail,
      subject: subject,
      text: content,
      html: content,
    });
    if (result.accepted.length === 1) {
      return true;
    } else {
      throw new Error(result.toString());
    }
  }
}
