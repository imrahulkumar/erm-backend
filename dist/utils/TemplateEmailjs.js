"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTemplate = void 0;
class EmailTemplate {
    constructor() {
        this.emailTemplate = {
            emailVerification: { templateId: "template_yauskhc", summary: "Email Verification" },
            resetPaswordEmail: { templateId: "template_cfg3npl", summary: "Reset Password Email" },
        };
    }
}
exports.EmailTemplate = EmailTemplate;
