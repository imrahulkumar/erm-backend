"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const CheckError_1 = require("../../middleware/CheckError");
const Utils_1 = require("../../utils/Utils");
const user_validators_1 = require("./user.validators");
const cors = require("cors");
const bodyParser = require("body-parser");
class UserRouter {
    constructor() {
        this.router = express_1.Router();
        // this.router.use();
        this.router.use(cors());
        this.router.use(bodyParser.json());
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }
    getRoutes() {
        // VERIFY SIGNUP USER
        this.router.get('/verify/signup', user_validators_1.UserValidators.verifySignup(), CheckError_1.GlobalCheckErrorMiddleWare.checkError, user_controller_1.UserController.verifySignup);
        // RESEND VERIFICATION TOKEN FOR SIGNUP
        this.router.get('/resend/signup/verificationToken', user_validators_1.UserValidators.resendSignupVerificationToken(), CheckError_1.GlobalCheckErrorMiddleWare.checkError, user_controller_1.UserController.resendSignupVerificationToken);
        // FORGOT PASSWORD
        this.router.get('/forgot/password', user_validators_1.UserValidators.resendSignupVerificationToken(), CheckError_1.GlobalCheckErrorMiddleWare.checkError, user_controller_1.UserController.triggerForgotPassword);
        // GET PROFILE DETAILS
        this.router.get('/profile', CheckError_1.GlobalCheckErrorMiddleWare.authentication, user_controller_1.UserController.profile);
    }
    postRoutes() {
        // SIGN UP FOR THE SUPER ADMIN
        this.router.post('/signup', user_validators_1.UserValidators.signup(), CheckError_1.GlobalCheckErrorMiddleWare.checkError, user_controller_1.UserController.signup);
        // LOGIN USER
        this.router.post('/login', user_validators_1.UserValidators.login(), CheckError_1.GlobalCheckErrorMiddleWare.checkError, user_controller_1.UserController.login);
        //FORGOT PASSWORD ADD NEW PASSWORD
        this.router.post('/reset/password', user_validators_1.UserValidators.resetPassword(), CheckError_1.GlobalCheckErrorMiddleWare.checkError, user_controller_1.UserController.resetPassword);
        //PASSWORD UPDATE
        this.router.post('/password/update', CheckError_1.GlobalCheckErrorMiddleWare.authentication, user_validators_1.UserValidators.passwordUpdate(), CheckError_1.GlobalCheckErrorMiddleWare.checkError, user_controller_1.UserController.passwordUpdate);
        //UPDATE PROFILE DETAILS
        this.router.post('/profile/edit', CheckError_1.GlobalCheckErrorMiddleWare.authentication, user_validators_1.UserValidators.profileEdit(), CheckError_1.GlobalCheckErrorMiddleWare.checkError, user_controller_1.UserController.profileEdit);
        //ADD EMPLOYEE
        this.router.post('/add/employee', CheckError_1.GlobalCheckErrorMiddleWare.authentication, user_validators_1.UserValidators.profileEdit(), CheckError_1.GlobalCheckErrorMiddleWare.checkError, user_controller_1.UserController.profileEdit);
    }
    patchRoutes() {
        // COMMON IMAGE UPLOADER    
        this.router.patch('/upload/profilePic/upload', CheckError_1.GlobalCheckErrorMiddleWare.authentication, new Utils_1.Utils().multer.single('profile_pic'), user_validators_1.UserValidators.updateProfilePic(), CheckError_1.GlobalCheckErrorMiddleWare.checkError, user_controller_1.UserController.updateProfilePic);
    }
    deleteRoutes() {
        //DELETE IMAGE 
        this.router.post('/delete/profilePic/upload', CheckError_1.GlobalCheckErrorMiddleWare.authentication, user_validators_1.UserValidators.deleteProfilePic(), CheckError_1.GlobalCheckErrorMiddleWare.checkError, user_controller_1.UserController.deleteProfilePic);
    }
}
exports.default = new UserRouter().router;
