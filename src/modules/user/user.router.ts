import { Router } from 'express';
import { UserController } from './user.controller';
import { GlobalCheckErrorMiddleWare } from '../../middleware/CheckError';
import { Utils } from '../../utils/Utils';
import { UserValidators } from './user.validators';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

class UserRouter {

    public router: Router;


    constructor() {
        this.router = Router();
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
        this.router.get('/verify/signup',
            UserValidators.verifySignup(),
            GlobalCheckErrorMiddleWare.checkError,
            UserController.verifySignup)

        // RESEND VERIFICATION TOKEN FOR SIGNUP
        this.router.get('/resend/signup/verificationToken',
            UserValidators.resendSignupVerificationToken(),
            GlobalCheckErrorMiddleWare.checkError,
            UserController.resendSignupVerificationToken)

        // FORGOT PASSWORD
        this.router.get('/forgot/password',
            UserValidators.resendSignupVerificationToken(),
            GlobalCheckErrorMiddleWare.checkError,
            UserController.triggerForgotPassword)



    }
    postRoutes() {

        // SIGN UP FOR THE SUPER ADMIN
        this.router.post('/signup',
            UserValidators.signup(),
            GlobalCheckErrorMiddleWare.checkError,
            UserController.signup)

        // LOGIN USER
        this.router.post('/login',
            UserValidators.login(),
            GlobalCheckErrorMiddleWare.checkError,
            UserController.login)

        //FORGOT PASSWORD ADD NEW PASSWORD
        this.router.post('/reset/password',
            UserValidators.resetPassword(),
            GlobalCheckErrorMiddleWare.checkError,
            UserController.resetPassword)


    }
    patchRoutes() { }
    deleteRoutes() { }

}

export default new UserRouter().router;