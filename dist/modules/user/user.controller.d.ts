export declare class UserController {
    static signup(req: any, res: any, next: any): Promise<void>;
    static verifySignup(req: any, res: any, next: any): Promise<void>;
    static resendSignupVerificationToken(req: any, res: any, next: any): Promise<void>;
    static triggerForgotPassword(req: any, res: any, next: any): Promise<void>;
    static login(req: any, res: any, next: any): Promise<void>;
    static resetPassword(req: any, res: any, next: any): Promise<void>;
    static passwordUpdate(req: any, res: any, next: any): Promise<void>;
    static updateProfilePic(req: any, res: any, next: any): Promise<void>;
    static deleteProfilePic(req: any, res: any, next: any): Promise<void>;
    static profile(req: any, res: any, next: any): Promise<void>;
    static profileEdit(req: any, res: any, next: any): Promise<void>;
    static addEmployee(req: any, res: any, next: any): Promise<void>;
    static deleteEmployee(req: any, res: any, next: any): Promise<void>;
}
