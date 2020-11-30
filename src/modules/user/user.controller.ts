import User from './user.modal';
import { Utils } from '../../utils/Utils';
import * as Jwt from 'jsonwebtoken';
import { getEnvironmentVariable } from '../../environments/env';
import { Emailjs } from '../../utils/Emailjs';
import { EmailTemplate } from '../../utils/TemplateEmailjs';


import * as Cheerio from 'cheerio';
import * as Request from 'request';
import { signupObj } from '../../utils/Helper';
import { Picker } from '../../utils/Picker';
import address from '../address/address.modal';

export class UserController {


    static async signup(req, res, next) {
        console.log(req.body)
        let d = req.body;
        let data = Picker.objPicker(d, signupObj);

        const verificationToken = Utils.generateVerificationToken();
        let MAX_TOKEN_TIME = new Utils().MAX_TOKEN_TIME;


        data['verification_token'] = MAX_TOKEN_TIME;
        data['verification_token_time'] = new Utils().MAX_TOKEN_TIME;
        data['verified'] = false;


        try {

            if (data['address']) {
                data['address'] = [data.address];
                let user = await new User(data).save();
                res.send(user);
            } else {
                const newAddress = new address({
                    location: data['newAddress'],
                    created_at: new Date(),
                    updated_at: new Date()
                });
                data['address'] = []
                data['address'].push(newAddress);
                let user = await Promise.all([new User(data).save(), newAddress.save()]);
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

    static async login(req, res, next) {
        let d = req.body;
        const email = d.email;
        const password = d.password;
        const user = req.user;

        try {
            // await Utils.comparePassword({ plainPassword: password, encryptPassword: user.password });
            if(password.trim()  != user.password.trim()){
                throw new Error('Email & Password Does Not Match')
            }
            const data = { _id: user._id, email: user.email }
            const token = Jwt.sign(data, getEnvironmentVariable().jwt_secret, { expiresIn: '120d' });
            const response = { user: user, toke: token };
            res.json(response)
        } catch (e) {
            next(e);
        }

    }


    // static async signup(req, res, next) {
    //     let d = req.body;
    //     const email = d.email;
    //     const password = d.password;
    //     const username = d.username;
    //     const verificationToken = Utils.generateVerificationToken();

    //     let MAX_TOKEN_TIME = new Utils().MAX_TOKEN_TIME;
    //     try {
    //         const hash = await Utils.encryptPassword(password);
    //         const data = {
    //             email: email,
    //             password: hash,
    //             username: username,
    //             verified: false,
    //             verification_token: verificationToken,
    //             verification_token_time: Date.now() + MAX_TOKEN_TIME
    //         }

    //         let user = await new User(data).save();

    //         res.send(user);

    //         //SEND VERIFICATION EMAIL
    //         let templateParams = { name: data.username, verificationToken: data.verification_token, to: email };
    //         let templateId = new EmailTemplate().emailTemplate.emailVerification.templateId;
    //         Emailjs.sendEmail({ template_id: templateId, template_params: templateParams });

    //     }
    //     catch (e) {
    //         next(e);
    //     }
    // }

    // static async verify(req, res, next) {

    //     const verificationToken = req.body.verification_token;
    //     const email = req.body.email;

    //     try {
    //         const user = await User.findOneAndUpdate({
    //             email: email,
    //             verification_token: parseInt(verificationToken),
    //             verification_token_time: { $gt: Date.now() }

    //         }, { verified: true }, { new: true });

    //         if (user) {
    //             res.send(user);
    //         } else {
    //             throw new Error('Verification Token Is Expired. PLease Request For a new One.')
    //         }
    //     } catch (e) {

    //         next(e)
    //     }
    // }



    // static async resendVerificationEmail(req, res, next) {
    //     const email = req.query.email;
    //     const verificationToken = Utils.generateVerificationToken();
    //     try {
    //         const user: any = await User.findOneAndUpdate({ email: email }, {
    //             verification_token: verificationToken,
    //             verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME
    //         })

    //         if (user) {
    //             //SEND VERIFICATION EMAIL  
    //             let templateParams = { name: user.username, verificationToken: verificationToken, to: email };
    //             let templateId = new EmailTemplate().emailTemplate.emailVerification.templateId;
    //             Emailjs.sendEmail({ template_id: templateId, template_params: templateParams });

    //             res.json({ success: true })

    //         } else {
    //             throw Error('User Does not Exist')
    //         }

    //     }
    //     catch (e) {
    //         next(e)
    //     }
    // }

    // static async login(req, res, next) {
    //     let d = req.body;
    //     const email = d.email;
    //     const password = d.password;
    //     const user = req.user;

    //     try {
    //         await Utils.comparePassword({ plainPassword: password, encryptPassword: user.password });
    //         const data = { user_id: req.user._id, email: req.user.email }
    //         const token = Jwt.sign(data, getEnvironmentVariable().jwt_secret, { expiresIn: '120d' });
    //         const response = { user: user, toke: token };
    //         res.json(response)
    //     } catch (e) {
    //         next(e);
    //     }

    // }

    // static async updatePassword(req, res, next) {
    //     const user = req.user;
    //     const password = req.body.password;
    //     const newPassword = req.body.new_password;
    //     try {
    //         await User.findOne({ _id: user._id }).then(async (user: any) => {
    //             await Utils.comparePassword({ plainPassword: password, encryptPassword: user.password })
    //         });
    //         const encryptPassword = await Utils.encryptPassword(newPassword);

    //         const newUser = await User.findOneAndUpdate({ _id: user._id }, { password: encryptPassword }, { new: true });
    //         res.send(newUser);
    //     }
    //     catch (e) {
    //         next(e);
    //     }

    // }

    // static async sendResetPassword(req, res, next) {
    //     const email = req.query.email;
    //     const resetPasswordToken = Utils.generateVerificationToken();
    //     try {
    //         let updateUser: any = await User.findOneAndUpdate({ email: email },
    //             {
    //                 updated_at: new Date(), reset_password_token: resetPasswordToken,
    //                 reset_password_token_time: Date.now() + new Utils().MAX_TOKEN_TIME
    //             }, { new: true });

    //         res.send(updateUser);

    //         //SEND RESET VERIFICATION EMAIL
    //         let templateParams = { name: updateUser.username, verificationToken: resetPasswordToken, to: email };
    //         let templateId = new EmailTemplate().emailTemplate.resetPaswordEmail.templateId;
    //         Emailjs.sendEmail({ template_id: templateId, template_params: templateParams });

    //     } catch (e) {
    //         next(e)
    //     }
    // }
    // static async updateProfilePic(req, res, next) {

    //     try {

    //         const userId = req.user.user_id;
    //         const fileUrl = 'https://localhost:5000/' + req.file.path
    //         const user = await User.findOneAndUpdate({ _id: userId },
    //             { updated_at: new Date(), profile_pic_url: fileUrl }, { new: true })
    //         res.send(user)

    //     } catch (e) {
    //         next(e)
    //     }

    // }


    // //Single Field Indexing 
    // // static async test(req, res, next) {
    // //     const user = await User.find({ email: 'ashish.k@mailinator.com' })
    // //                       .setOptions({explain:'executionStats'});
    // //                       res.send(user)
    // // }

    // // Multi Field Indexing
    // static async test(req, res, next) {
    //     const user = await User.find({
    //         email: 'rahul.k@mailinator.com',
    //         password: '$2b$10$5mRQr1IU5SjQfDR6WeKNJOoLcZB9IiFg0i81tdgSWReXRKV7Cm5VG"'
    //     })
    //         .setOptions({ explain: 'executionStats' });
    //     res.send(user)
    // }


    // static async webScraping(req, res, next) {
    //     Request('https://webscraper.io/test-sites/e-commerce/allinone', ((error, response, html) => {
    //         if (!error && response.statusCode == 200) {
    //             const $ = Cheerio.load(html);
    //             const data = [];
    //             $('.thumbnail').each((index, element) => {
    //                 const image = $(element).find('.img-responsive').attr('src');
    //                 const title = $(element).find('.title').text();
    //                 const description = $(element).find('.description').text();
    //                 const price = $(element).find('.price').text();
    //                 data.push({title: title, image: image, description: description, price: price});
    //             });
    //             res.send(data);
    //         }
    //     }))
    // }





}