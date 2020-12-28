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

        //PASSWORD UPDATE
        this.router.post('/password/update',
            GlobalCheckErrorMiddleWare.authentication,
            UserValidators.passwordUpdate(),
            GlobalCheckErrorMiddleWare.checkError,
            UserController.passwordUpdate)


    }
    patchRoutes() {
        // COMMON IMAGE UPLOADER    
        this.router.patch('/upload/profilePic/upload',
            GlobalCheckErrorMiddleWare.authentication,
            new Utils().multer.single('profile_pic'),
            UserValidators.updateProfilePic(),
            GlobalCheckErrorMiddleWare.checkError,
            UserController.updateProfilePic)
    }
    deleteRoutes() {
        //DELETE IMAGE 
        this.router.post('/delete/profilePic/upload',
            GlobalCheckErrorMiddleWare.authentication,
            UserValidators.deleteProfilePic(),
            GlobalCheckErrorMiddleWare.checkError,
            UserController.deleteProfilePic)
    }

}

export default new UserRouter().router;