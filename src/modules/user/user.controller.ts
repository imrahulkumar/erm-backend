import User from './user.modal';
import { Utils } from '../../utils/Utils';
import * as Jwt from 'jsonwebtoken';
import { getEnvironmentVariable } from '../../environments/env';
import { Emailjs } from '../../utils/Emailjs';
import { EmailTemplate } from '../../utils/TemplateEmailjs';
import { adminUserDetails, signupObj, userObj } from '../../utils/Helper';
import { Picker } from '../../utils/Picker';
import address from '../address/address.modal';
import profileDetail from '../profile/profile.modal';

export class UserController {


    static async signup(req, res, next) {
        let d = req.body;
        let data = Picker.objPicker(d, signupObj);
        const verificationToken = Utils.generateVerificationToken();
        data['verification_token'] = verificationToken;
        data['verification_token_time'] = Date.now() + new Utils().MAX_TOKEN_TIME;
        data['verified'] = false;
        try {
            if (data['address']) {
                data['address'] = [data.address];
                let user = await new User(data).save();
                res.send(user);
            } else {

                // TO ASSIGN THE ADDRESS IN ADDRESS MODEL SCHEMA
                const newAddress = new address({
                    location: data['newAddress'],
                    created_at: new Date(),
                    updated_at: new Date()
                });
                data['address'] = []
                data['address'].push(newAddress);

                // TO ASSIGN THE PROFILE DETAILS INFORMATION IN PROFILE DETAILS SCHEMA
                const newProfileDetail = new profileDetail({
                    doj: new Date(),
                    panCard: "",
                    adharCard: "",
                    designation: "",
                    income: ""
                });
                data['userDetails'] = newProfileDetail;
                let user = await Promise.all([new User(data).save(), newAddress.save(), newProfileDetail.save()]);
                res.send(user[0]);
            }
            //SEND VERIFICATION EMAIL
            let templateParams = { name: data.username, verificationToken: data.verification_token, to: data.email };
            let templateId = new EmailTemplate().emailTemplate.emailVerification.templateId;
            Emailjs.sendEmail({ template_id: templateId, template_params: templateParams });

        } catch (error) {
            next(error);
        }

    }

    static async verifySignup(req, res, next) {
        let email = req.query.email;
        let verification_token = req.query.verificationToken;

        try {
            let user = await User.findOneAndUpdate(
                {
                    email: email,
                    verification_token: parseInt(verification_token),
                    verification_token_time: { $gt: Date.now() }
                },
                { verified: true }, { new: true }
            );

            if (user) {
                res.send(user);
            } else {
                throw new Error('Verification Token Is Expired. PLease Request For a new One.')
            }
        } catch (error) {
            next(error)
        }
    }

    static async resendSignupVerificationToken(req, res, next) {
        const email = req.query.email;
        const verificationToken = Utils.generateVerificationToken();
        try {
            const user: any = await User.findOneAndUpdate({ email: email }, {
                verification_token: verificationToken,
                verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME
            })

            if (user) {
                //SEND VERIFICATION EMAIL  
                let templateParams = { name: user.username, verificationToken: verificationToken, to: email };
                let templateId = new EmailTemplate().emailTemplate.emailVerification.templateId;
                Emailjs.sendEmail({ template_id: templateId, template_params: templateParams });

                res.json({ message: "Verification token is sent to you email.Please Check it." })

            } else {
                throw Error('User Does not Exist')
            }

        }
        catch (e) {
            next(e)
        }
    }

    static async triggerForgotPassword(req, res, next) {
        const email = req.query.email;
        const verificationToken = Utils.generateVerificationToken();
        try {
            const user: any = await User.findOneAndUpdate({ email: email }, {
                reset_password_token: verificationToken,
                reset_password_token_time: Date.now() + new Utils().MAX_TOKEN_TIME
            })

            if (user) {
                //SEND VERIFICATION EMAIL  
                let templateParams = { name: user.username, verificationToken: verificationToken, to: email };
                let templateId = new EmailTemplate().emailTemplate.emailVerification.templateId;
                Emailjs.sendEmail({ template_id: templateId, template_params: templateParams });

                res.json({ message: "Verification token is sent to you email.Please Check it." })

            } else {
                throw Error('User Does not Exist')
            }

        }
        catch (e) {
            next(e)
        }
    }

    static async login(req, res, next) {
        let d = req.body;
        const email = d.email;
        const password = d.password;
        const user = req.user;

        try {
            // await Utils.comparePassword({ plainPassword: password, encryptPassword: user.password });
            if (password.trim() != user.password.trim()) {
                throw new Error('Email & Password Does Not Match')
            }
            const data = { _id: user._id, email: user.email }
            const token = Jwt.sign(data, getEnvironmentVariable().jwt_secret, { expiresIn: '120d' });
            const response = { user: user, token: token };
            res.json(response)
        } catch (e) {
            next(e);
        }

    }

    static async resetPassword(req, res, next) {
        let email = req.body.email;
        let verification_token = req.body.token;
        let password = req.body.password;

        try {
            let user = await User.findOneAndUpdate(
                {
                    email: email,
                    reset_password_token: parseInt(verification_token),
                    reset_password_token_time: { $gt: Date.now() }
                },
                { verified: true, password: password }, { new: true }
            );

            if (user) {
                res.send(user);
            } else {
                throw new Error('Verification Token Is Expired. PLease Request For a new One.')
            }
        } catch (error) {
            next(error)
        }
    }

    static async passwordUpdate(req, res, next) {
        let email = req.body.email;
        let oldPassword = req.body.oldPassword;
        let newPassword = req.body.newPassword;

        try {
            let user = await User.findOneAndUpdate({ email: email, password: oldPassword },
                { password: newPassword }, { new: true })

            if (user) {
                res.send(user);
            } else {
                throw new Error('Please enter correct email and old password. Password is not updated.')
            }

        } catch (error) {
            next(error)
        }
    }

    static async updateProfilePic(req, res, next) {
        try {

            const userId = req.user._id;
            const fileUrl = `${getEnvironmentVariable().image_path}${req.file.path}`;
            const user = await User.findOneAndUpdate({ _id: userId },
                { updated_at: new Date(), profile_pic_url: fileUrl }, { new: true })
            res.send(user)

        } catch (e) {
            next(e)
        }
    }

    static async deleteProfilePic(req, res, next) {
        try {
            let deletedFile = await Utils.deleteFile(req, res, next);
            res.send(deletedFile)
        } catch (error) {
            next(error)
        }
    }

    static async profile(req, res, next) {
        console.log(req.user)
        let _id = req.user._id;
        try {
            let user = await User.find({ _id: _id }).populate(['userDetails', 'address'])
            res.send(user);
        } catch (error) {
            next(error)
        }
    }

    static async profileEdit(req, res, next) {
        
        let d: any;
        let authData = req.user;
        let userData = Picker.objPicker(req.body, userObj);
        let user: any = await User.findByIdAndUpdate({ _id: authData._id }, userData, { new: true });

        if (user.role == 'superAdmin') {
            let userDetailId = user.userDetails;
            let profileDetailData = Picker.objPicker(req.body, adminUserDetails);
            let profileData = await profileDetail.findByIdAndUpdate({ _id: userDetailId }, profileDetailData, { new: true })
            d = { user, profileData };
        }

        res.send(d);

        try {

        } catch (error) {
            next(error)
        }
    }




}