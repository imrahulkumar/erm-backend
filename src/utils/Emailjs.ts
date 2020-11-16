import emailjs from 'emailjs-com';
import { getEnvironmentVariable } from '../environments/env';
const axios = require('axios');

export class Emailjs {

    static sendEmail(data: { template_id: string, template_params: any }) {
        axios.post('https://api.emailjs.com/api/v1.0/email/send', {
            service_id: getEnvironmentVariable().emailjs_com.service_id,
            user_id: getEnvironmentVariable().emailjs_com.user_id,
            template_id: data.template_id,
            template_params: data.template_params,

        })
            .then(function (response) {
                console.log("response");
            })
            .catch(function (error) {
                console.log("error");
            });
    }

    /**
    * For TemplateId : template_yauskhc => Email Verification
    *
    * templateParams are : { name:"Rahul", verificationToken:"454534" }
    *
    * For TemplateId : template_cfg3npl => Reset Password Email
    *
    * templateParams are : { name:"Rahul", verificationToken:"454534" }
    *
    */


}