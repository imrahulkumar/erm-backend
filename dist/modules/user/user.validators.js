"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidators = void 0;
const express_validator_1 = require("express-validator");
const user_modal_1 = require("./user.modal");
class UserValidators {
    static signup() {
        return [
            express_validator_1.body('email', 'Email is Required').isEmail()
                .custom((emails, { req }) => {
                return user_modal_1.default.findOne({ email: emails }).then((user) => {
                    if (user) {
                        throw new Error('User Already Exist');
                    }
                    else {
                        return true;
                    }
                });
            }),
            express_validator_1.body('name', 'Name is required').isString(),
            express_validator_1.body('role', 'Role is required').isString(),
            express_validator_1.body('dob', 'DOB is required').isString(),
            express_validator_1.body('address')
                .custom((address, { req }) => {
                if (!address) {
                    if (!req.body.newAddress) {
                        throw new Error('Please add New Address');
                    }
                    else {
                        return true;
                    }
                }
                else {
                    return true;
                }
            }),
            express_validator_1.body('password', 'Password is required').isAlphanumeric()
                .isLength({ min: 0, max: 20 }).withMessage('Password can be from 8-20 characters only'),
            express_validator_1.body('companyName', 'Company Name is required').isString()
        ];
    }
    static verifySignup() {
        return [
            express_validator_1.query('email', 'Email is required').isEmail().custom((email, { req }) => {
                return user_modal_1.default.findOne({ email: email }).then((user) => {
                    if (user) {
                        if (user.verified) {
                            return new Error('User Already verified');
                        }
                        else {
                            return true;
                        }
                    }
                    else {
                        throw new Error('User Not Exist');
                    }
                });
            })
        ];
    }
    static resendSignupVerificationToken() {
        return [
            express_validator_1.query('email', 'Email is Required').isEmail()
                .custom((email, { req }) => {
                return user_modal_1.default.findOne({ email: email }).then((user) => {
                    if (user) {
                        return true;
                    }
                    else {
                        throw new Error('User Not Exist');
                    }
                });
            })
        ];
    }
    static login() {
        return [
            express_validator_1.body('email', 'Email is required').isEmail().custom((email, { req }) => {
                return user_modal_1.default.findOne({ email: email }).then((user) => {
                    if (user) {
                        if (user.verified) {
                            req.user = user;
                            return true;
                        }
                        else {
                            throw new Error('Please Verify the email.');
                        }
                    }
                    else {
                        throw new Error('User Not Exist');
                    }
                });
            })
        ];
    }
    static resetPassword() {
        return [
            express_validator_1.body('email', 'Email is required').isEmail().custom((email, { req }) => {
                return user_modal_1.default.findOne({ email: email }).then((user) => {
                    if (user) {
                        return true;
                    }
                    else {
                        throw new Error('User Not Exist');
                    }
                });
            }),
            express_validator_1.body('token', 'Token is required').isString(),
            express_validator_1.body('password', 'Password is required').isString()
        ];
    }
    static passwordUpdate() {
        return [
            express_validator_1.body('email', 'Email is required').isEmail().custom((email, { req }) => {
                return user_modal_1.default.findOne({ email: email }).then((user) => {
                    if (user) {
                        return true;
                    }
                    else {
                        throw new Error('User Not Exist');
                    }
                });
            }),
            express_validator_1.body('oldPassword', 'Old Password is Required').isString(),
            express_validator_1.body('newPassword', 'New Password is required').isString()
        ];
    }
    static updateProfilePic() {
        return [
            express_validator_1.body('profile_pic').custom((profilePic, { req }) => {
                if (req.file) {
                    return true;
                }
                else {
                    throw new Error('File not uploaded');
                }
            })
        ];
    }
    static deleteProfilePic() {
        return [
            express_validator_1.body('profile_pic', 'Profile Pic Name is Required').isString()
        ];
    }
    static profileEdit() {
        return [
            express_validator_1.body('email', 'Email is Required').isString(),
            express_validator_1.body('name', 'Name is Required').isString(),
            express_validator_1.body('dob', 'DOB is Required').isString(),
            express_validator_1.body('doj', 'DOJ is Required').isString(),
            express_validator_1.body('panCard', 'PAN card is Required').isString(),
            express_validator_1.body('adharCard', 'Adhar Card is Required').isString(),
            express_validator_1.body('designation', 'Designation is Required').isString(),
            express_validator_1.body('income', 'Income is Required').isString()
        ];
    }
    static addEmployee() {
        return [
            express_validator_1.body('email', 'Email is Required').isString(),
            express_validator_1.body('name', 'Name is Required').isString(),
            express_validator_1.body('role', 'Role is Required').isString()
        ];
    }
}
exports.UserValidators = UserValidators;
