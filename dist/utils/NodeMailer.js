"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeMailer = void 0;
const nodeMailer = require("nodemailer");
const SendGrid = require("nodemailer-sendgrid-transport");
class NodeMailer {
    static initializeTransport() {
        return nodeMailer.createTransport(SendGrid({
            auth: {
                api_key: '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'
            }
        }));
    }
    static sendEmail(data) {
        NodeMailer.initializeTransport().sendMail({
            from: 'rahulgbu13@gmail.com',
            to: ['rahulgbu13@gmail.com'],
            subject: data.subject,
            html: data.html
        });
    }
}
exports.NodeMailer = NodeMailer;
