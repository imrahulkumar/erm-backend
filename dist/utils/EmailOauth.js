"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailOauth = void 0;
const nodemailer = require("nodemailer");
const googleapis_1 = require("googleapis");
const env_1 = require("../environments/env");
class EmailOauth {
    constructor() {
    }
    static accessToken() {
        let oAuth2Client = new googleapis_1.google.auth.OAuth2(env_1.getEnvironmentVariable().email_oauth.CLIENT_ID, env_1.getEnvironmentVariable().email_oauth.CLEINT_SECRET, env_1.getEnvironmentVariable().email_oauth.REDIRECT_URI);
        oAuth2Client.setCredentials({ refresh_token: env_1.getEnvironmentVariable().email_oauth.REFRESH_TOKEN });
        return oAuth2Client.getAccessToken();
    }
    static sendEmail(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transport = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        type: 'OAuth2',
                        user: 'askmeanstackdeveloper@gmail.com',
                        clientId: env_1.getEnvironmentVariable().email_oauth.CLIENT_ID,
                        clientSecret: env_1.getEnvironmentVariable().email_oauth.CLEINT_SECRET,
                        refreshToken: env_1.getEnvironmentVariable().email_oauth.REFRESH_TOKEN,
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
                const result = yield transport.sendMail(mailOptions);
                return result;
            }
            catch (error) {
                return error;
            }
        });
    }
}
exports.EmailOauth = EmailOauth;
