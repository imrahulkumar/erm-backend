"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emailjs = void 0;
const env_1 = require("../environments/env");
const axios = require('axios');
class Emailjs {
    static sendEmail(data) {
        axios.post('https://api.emailjs.com/api/v1.0/email/send', {
            service_id: env_1.getEnvironmentVariable().emailjs_com.service_id,
            user_id: env_1.getEnvironmentVariable().emailjs_com.user_id,
            template_id: data.template_id,
            template_params: data.template_params
        })
            .then(function (response) {
            console.log("response");
        })
            .catch(function (error) {
            console.log("Mail Error");
        });
    }
}
exports.Emailjs = Emailjs;
