import * as nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { getEnvironmentVariable } from '../environments/env';


export class EmailOauth {



    public accessToken;

    constructor() {


    }


    static accessToken() {
        let oAuth2Client: any = new google.auth.OAuth2(
            getEnvironmentVariable().email_oauth.CLIENT_ID,
            getEnvironmentVariable().email_oauth.CLEINT_SECRET,
            getEnvironmentVariable().email_oauth.REDIRECT_URI);

        oAuth2Client.setCredentials({ refresh_token: getEnvironmentVariable().email_oauth.REFRESH_TOKEN });

       return oAuth2Client.getAccessToken();
    }

    static async sendEmail(data: {
        to: string,
        subject: string,
        text: string,
        html: string,
    }) {
        try {
            const transport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAuth2',
                    user: 'askmeanstackdeveloper@gmail.com',
                    clientId: getEnvironmentVariable().email_oauth.CLIENT_ID,
                    clientSecret: getEnvironmentVariable().email_oauth.CLEINT_SECRET,
                    refreshToken: getEnvironmentVariable().email_oauth.REFRESH_TOKEN,
                    accessToken: this.accessToken(),
                },
            });

            // const mailOptions = {
            //     from: 'askmeanstackdeveloper@gmail.com',
            //     to: 'rahulgbu13@gmail.com',
            //     subject: 'Hello from gmail using API',
            //     text: 'Hello from gmail email using API',
            //     html: '<h1>Hello from gmail email using API</h1>',
            // };

            const mailOptions = {
                from: 'askmeanstackdeveloper@gmail.com',
                to: data.to,
                subject: data.subject,
                text: data.text,
                html: data.html,
            };

            const result = await transport.sendMail(mailOptions);
            return result;
        } catch (error) {
            return error;
        }
    }



}