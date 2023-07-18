import { transporter } from '../utils.js';

export const sendEmail = async (email) =>{
    await transporter.sendMail({
        from: 'Curso Backend Coder<cuser@coder.com>',
        to: email.to,
        subject: email.subject,
        html: email.html
    });
}