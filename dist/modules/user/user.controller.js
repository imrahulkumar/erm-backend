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
exports.UserController = void 0;
const user_modal_1 = require("./user.modal");
const Utils_1 = require("../../utils/Utils");
const Jwt = require("jsonwebtoken");
const env_1 = require("../../environments/env");
const Emailjs_1 = require("../../utils/Emailjs");
const TemplateEmailjs_1 = require("../../utils/TemplateEmailjs");
const Helper_1 = require("../../utils/Helper");
const Picker_1 = require("../../utils/Picker");
const address_modal_1 = require("../address/address.modal");
const profile_modal_1 = require("../profile/profile.modal");
const EmailOauth_1 = require("../../utils/EmailOauth");
const invite_employee_1 = require("../../utils/emailTemplate/invite-employee");
class UserController {
    static signup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let d = req.body;
            let data = Picker_1.Picker.objPicker(d, Helper_1.signupObj);
            const verificationToken = Utils_1.Utils.generateVerificationToken();
            data['verification_token'] = verificationToken;
            data['verification_token_time'] = Date.now() + new Utils_1.Utils().MAX_TOKEN_TIME;
            data['verified'] = false;
            try {
                if (data['address']) {
                    data['address'] = [data.address];
                    let user = yield new user_modal_1.default(data).save();
                    res.send(user);
                }
                else {
                    // TO ASSIGN THE ADDRESS IN ADDRESS MODEL SCHEMA
                    const newAddress = new address_modal_1.default({
                        location: data['newAddress'],
                        created_at: new Date(),
                        updated_at: new Date()
                    });
                    data['address'] = [];
                    data['address'].push(newAddress);
                    // TO ASSIGN THE PROFILE DETAILS INFORMATION IN PROFILE DETAILS SCHEMA
                    const newProfileDetail = new profile_modal_1.default({
                        doj: new Date(),
                        panCard: "",
                        adharCard: "",
                        designation: "",
                        income: ""
                    });
                    data['userDetails'] = newProfileDetail;
                    let user = yield Promise.all([new user_modal_1.default(data).save(), newAddress.save(), newProfileDetail.save()]);
                    res.send(user[0]);
                }
                //SEND VERIFICATION EMAIL
                let templateParams = { name: data.username, verificationToken: data.verification_token, to: data.email };
                let templateId = new TemplateEmailjs_1.EmailTemplate().emailTemplate.emailVerification.templateId;
                Emailjs_1.Emailjs.sendEmail({ template_id: templateId, template_params: templateParams });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static verifySignup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let email = req.query.email;
            let verification_token = req.query.verificationToken;
            try {
                let user = yield user_modal_1.default.findOneAndUpdate({
                    email: email,
                    verification_token: parseInt(verification_token),
                    verification_token_time: { $gt: Date.now() }
                }, { verified: true }, { new: true });
                if (user) {
                    res.send(user);
                }
                else {
                    throw new Error('Verification Token Is Expired. PLease Request For a new One.');
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    static resendSignupVerificationToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = req.query.email;
            const verificationToken = Utils_1.Utils.generateVerificationToken();
            try {
                const user = yield user_modal_1.default.findOneAndUpdate({ email: email }, {
                    verification_token: verificationToken,
                    verification_token_time: Date.now() + new Utils_1.Utils().MAX_TOKEN_TIME
                });
                if (user) {
                    //SEND VERIFICATION EMAIL  
                    let templateParams = { name: user.username, verificationToken: verificationToken, to: email };
                    let templateId = new TemplateEmailjs_1.EmailTemplate().emailTemplate.emailVerification.templateId;
                    Emailjs_1.Emailjs.sendEmail({ template_id: templateId, template_params: templateParams });
                    res.json({ message: "Verification token is sent to you email.Please Check it." });
                }
                else {
                    throw Error('User Does not Exist');
                }
            }
            catch (e) {
                next(e);
            }
        });
    }
    static triggerForgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = req.query.email;
            const verificationToken = Utils_1.Utils.generateVerificationToken();
            try {
                const user = yield user_modal_1.default.findOneAndUpdate({ email: email }, {
                    reset_password_token: verificationToken,
                    reset_password_token_time: Date.now() + new Utils_1.Utils().MAX_TOKEN_TIME
                });
                if (user) {
                    //SEND VERIFICATION EMAIL  
                    let templateParams = { name: user.username, verificationToken: verificationToken, to: email };
                    let templateId = new TemplateEmailjs_1.EmailTemplate().emailTemplate.emailVerification.templateId;
                    Emailjs_1.Emailjs.sendEmail({ template_id: templateId, template_params: templateParams });
                    res.json({ message: "Verification token is sent to you email.Please Check it." });
                }
                else {
                    throw Error('User Does not Exist');
                }
            }
            catch (e) {
                next(e);
            }
        });
    }
    static login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let d = req.body;
            const email = d.email;
            const password = d.password;
            const user = req.user;
            try {
                // await Utils.comparePassword({ plainPassword: password, encryptPassword: user.password });
                if (password.trim() != user.password.trim()) {
                    throw new Error('Email & Password Does Not Match');
                }
                const data = { _id: user._id, email: user.email };
                const token = Jwt.sign(data, env_1.getEnvironmentVariable().jwt_secret, { expiresIn: '120d' });
                const response = { user: user, token: token };
                res.json(response);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let email = req.body.email;
            let verification_token = req.body.token;
            let password = req.body.password;
            try {
                let user = yield user_modal_1.default.findOneAndUpdate({
                    email: email,
                    reset_password_token: parseInt(verification_token),
                    reset_password_token_time: { $gt: Date.now() }
                }, { verified: true, password: password }, { new: true });
                if (user) {
                    res.send(user);
                }
                else {
                    throw new Error('Verification Token Is Expired. PLease Request For a new One.');
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    static passwordUpdate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let email = req.body.email;
            let oldPassword = req.body.oldPassword;
            let newPassword = req.body.newPassword;
            try {
                let user = yield user_modal_1.default.findOneAndUpdate({ email: email, password: oldPassword }, { password: newPassword }, { new: true });
                if (user) {
                    res.send(user);
                }
                else {
                    throw new Error('Please enter correct email and old password. Password is not updated.');
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    static updateProfilePic(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user._id;
                const fileUrl = `${env_1.getEnvironmentVariable().image_path}${req.file.path}`;
                const user = yield user_modal_1.default.findOneAndUpdate({ _id: userId }, { updated_at: new Date(), profile_pic_url: fileUrl }, { new: true });
                res.send(user);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static deleteProfilePic(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let deletedFile = yield Utils_1.Utils.deleteFile(req, res, next);
                res.send(deletedFile);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static profile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let _id = req.user._id;
            try {
                let user = yield user_modal_1.default.find({ _id: _id }).populate(['userDetails', 'address']);
                res.send(user);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static profileEdit(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let d;
            let authData = req.user;
            let userData = Picker_1.Picker.objPicker(req.body, Helper_1.userObj);
            let user = yield user_modal_1.default.findByIdAndUpdate({ _id: authData._id }, userData, { new: true });
            if (user.role == 'superAdmin') {
                let userDetailId = user.userDetails;
                let profileDetailData = Picker_1.Picker.objPicker(req.body, Helper_1.adminUserDetails);
                let profileData = yield profile_modal_1.default.findByIdAndUpdate({ _id: userDetailId }, profileDetailData, { new: true });
                d = { user, profileData };
            }
            // // FOR OTP
            // let otp: any = {
            //     to: 'rahulgbu13@gmail.com',
            //     subject: 'Hello',
            //     text: emailOtpHtmp("1234"),
            //     html: emailOtpHtmp("1234")
            // }
            // EmailOauth.sendEmail(otp);
            //FOR INVITE LINK
            //    let html =  emailInviteHtml('Admin', 'Parangat Technology', 'rahul.k@parangat.com', '12345', 'http://localhost:42000')
            //     let invite: any = {
            //         to: 'rahulgbu13@gmail.com',
            //         subject: 'Hello',
            //         text: html,
            //         html: html
            //     }
            //     EmailOauth.sendEmail(invite);
            res.send(d);
            try {
            }
            catch (error) {
                next(error);
            }
        });
    }
    static addEmployee(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let userData = yield user_modal_1.default.findById({ _id: req.user._id });
            let newUserInfo = {
                password: Utils_1.Utils.randomStringGenerator(5),
                companyName: userData.companyName,
                verified: true,
                dob: ""
            };
            let newUser = Object.assign(Object.assign({}, newUserInfo), req.body);
            const newProfileDetail = new profile_modal_1.default({
                doj: new Date(),
                panCard: "",
                adharCard: "",
                designation: "",
                income: ""
            });
            newUser['userDetails'] = newProfileDetail;
            let user = new user_modal_1.default(newUser);
            userData.employeeIds.push(user);
            let userNew = yield Promise.all([user.save(), userData.save()]);
            res.send(userNew[0]);
            //FOR INVITE LINK START
            let html = invite_employee_1.emailInviteHtml(newUser.role, newUser.companyName, newUser.email, newUser.password, 'http://localhost:4200');
            let invite = {
                to: newUser.email,
                subject: "Invite Mail",
                text: html,
                html: html
            };
            EmailOauth_1.EmailOauth.sendEmail(invite);
            //FOR INVITE LINK END
            try {
            }
            catch (error) {
                next(error);
            }
        });
    }
    static deleteEmployee(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log("parmaId", req.params.id) // emaployee id
                // console.log("req.user", req.user._id) // admin id
                //TO REMOVE THE ELEMENT FROM ARRAY IN 'employeeIds' ARRAY
                let adminUser = yield user_modal_1.default.findOneAndUpdate({ _id: req.user._id }, { $pull: { employeeIds: req.params.id } });
                let user = yield user_modal_1.default.findByIdAndDelete({ _id: req.params.id });
                res.send({ adminUser, user });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.UserController = UserController;
