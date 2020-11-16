import * as nodeMailer from 'nodemailer';
import * as SendGrid from 'nodemailer-sendgrid-transport'


export class NodeMailer {

    private static initializeTransport() {
        return nodeMailer.createTransport(SendGrid({
            auth: {
                api_key: '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'
            }
        }))
    }


    static sendEmail(data: { to: [string], subject: string, html: string }) {
        NodeMailer.initializeTransport().sendMail({
            from: 'rahulgbu13@gmail.com',
            to: ['rahulgbu13@gmail.com'],
            subject: data.subject,
            html: data.html
        })
    }

}