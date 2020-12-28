
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
                            return true;
                        }
                    });
                }),
            body('name', 'Name is required').isString(),
            body('role', 'Role is required').isString(),
            body('dob', 'DOB is required').isString(),
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


    static resetPassword() {
        return [
            body('email', 'Email is required').isEmail().custom((email, { req }) => {
                return User.findOne({ email: email }).then((user: any) => {
                    if (user) {
                        return true
                    } else {
                        throw new Error('User Not Exist')
                    }
                });
            }),
            body('token', 'Token is required').isString(),
            body('password', 'Password is required').isString()
        ]
    }

    static passwordUpdate() {
        return [
            body('email', 'Email is required').isEmail().custom((email, { req }) => {
                return User.findOne({ email: email }).then((user: any) => {
                    if (user) {
                        return true
                    } else {
                        throw new Error('User Not Exist')
                    }
                });
            }),
            body('oldPassword', 'Old Password is Required').isString(),
            body('newPassword', 'New Password is required').isString()
        ]
    }

}