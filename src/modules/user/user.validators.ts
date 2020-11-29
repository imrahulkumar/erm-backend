
import { body, query } from 'express-validator'
import User from './user.modal';

export class UserValidators {


    static signup() {
        return [
            body('email', 'Email is Required').isEmail()
                .custom((emails, { req }) => {
                    return User.findOne({ email: emails }).then((user) => {
                        if (user) {
                            throw new Error('User Already Exist')
                        } else {
                            return false;
                        }
                    });
                }),
            body('name', 'Name is required').isString(),
            body('role', 'Role is required').isString(),
            body('dob', 'DOB is required').isDate(),
            body('address')
                .custom((address, { req }) => {
                    if (!address) {
                        if (!req.body.newAddress) {
                            throw new Error('Please add New Address')
                        } else {
                            return true;
                        }
                    } else {
                        return true;
                    }

                }),
            body('password', 'Password is required').isAlphanumeric()
                .isLength({ min: 0, max: 20 }).withMessage('Password can be from 8-20 characters only'),
            body('companyName', 'Company Name is required').isString()
        ]
    }


    static verifySignup() {
        return [
            query('email', 'Email is required').isEmail().custom((email, { req }) => {
                return User.findOne({ email: email }).then((user: any) => {
                    if (user) {
                        if (user.verified) {
                            return new Error('User Already verified');
                        } else {
                            return true;
                        }
                    } else {
                        throw new Error('User Not Exist')
                    }
                });
            })
        ]
    }


    static resendSignupVerificationToken() {
        return [
            query('email', 'Email is Required').isEmail()
                .custom((email, { req }) => {
                    return User.findOne({ email: email }).then((user) => {
                        if (user) {
                            return true;
                        } else {
                            throw new Error('User Not Exist')
                        }
                    });
                })
        ]
    }

    static login() {
        return [
            body('email', 'Email is required').isEmail().custom((email, { req }) => {
                return User.findOne({ email: email }).then((user: any) => {
                    if (user) {
                        if (user.verified) {
                            req.user = user;
                            return true;
                        } else {
                            throw new Error('Please Verify the email.')
                        }
                    } else {
                        throw new Error('User Not Exist')
                    }
                });
            })
        ]
    }

    // static signup() {
    //     return [
    //         body('email', 'Email is Required').isEmail()
    //             .custom((email, { req }) => {
    //                 return User.findOne({ email: email }).then((user) => {
    //                     if (user) {
    //                         throw new Error('User Already Exist')
    //                     } else {
    //                         return true;
    //                     }
    //                 });
    //             }),
    //         body('password', 'Password is Required').isAlphanumeric()
    //             .isLength({ min: 0, max: 20 }).withMessage('Password can be from 8-20 characters only'),
    //         body('username', 'User Name is Required').isString()
    //     ];
    // }

    // static verifyUser() {
    //     return [
    //         body('verification_token', 'Verifiction Token is Required').isNumeric(),
    //     ]
    // }

    // static resendVerificationEmail() {
    //     return [query('email', 'Email is required').isEmail()]
    // }

    // static login() {
    //     return [body('email', 'Email is required').isEmail().custom((email, { req }) => {
    //         return User.findOne({ email: email }).then(user => {
    //             if (user) {
    //                 req.user = user;
    //                 return true;
    //             } else {
    //                 throw new Error('User Does Not Exist');
    //             }
    //         })
    //     }),
    //     body('password', 'Password is Required').isAlphanumeric()]
    // }
    // static updatePassword() {
    //     return [
    //         body('email', 'Email is Required').custom((email, { req }) => {
    //             return User.findOne({ email: email }).then(user => {
    //                 if (user) {
    //                     req.user = user;
    //                     return true;
    //                 } else {
    //                     throw new Error('User Does Not Exist')
    //                 }
    //             })
    //         }),
    //         body('password', 'Password is Required').isAlphanumeric(),
    //         body('new_password', 'New Password is Required').isAlphanumeric(),
    //         body('reset_password_token', 'Reset Password Token is Required').isNumeric()
    //             .custom((token, { req }) => {
    //                 if (new Date(req.user.reset_password_token_time).getTime() < Date.now()) {
    //                     throw new Error('Token is Expired.')
    //                 }
    //                 else if (Number(req.user.reset_password_token) === Number(token)) {
    //                     return true;
    //                 }
    //                 else {
    //                     req.errorStatus = 422;
    //                     throw new Error('Reset Password Token is Invalid. Please Try Again.')
    //                 }
    //             })
    //     ]
    // }

    // static sendResetPassword() {
    //     return [
    //         query('email', 'Email is Required').isEmail().custom(async (email, { req }) => {
    //             return await User.findOne({ email: email }).then((user) => {
    //                 if (user) {
    //                     return true;
    //                 }
    //                 else {
    //                     throw new Error("Email Does not Exist")
    //                 }
    //             })
    //         })
    //     ]
    // }

    // static updateProfilePic() {
    //     return [
    //         body('profile_pic').custom((profilePic, { req }) => {
    //             if (req.file) {
    //                 return true;
    //             } else {
    //                 throw new Error('File not uploaded');
    //             }

    //         })
    //     ]
    // }
}