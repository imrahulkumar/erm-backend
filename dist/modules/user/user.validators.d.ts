export declare class UserValidators {
    static signup(): import("express-validator").ValidationChain[];
    static verifySignup(): import("express-validator").ValidationChain[];
    static resendSignupVerificationToken(): import("express-validator").ValidationChain[];
    static login(): import("express-validator").ValidationChain[];
    static resetPassword(): import("express-validator").ValidationChain[];
    static passwordUpdate(): import("express-validator").ValidationChain[];
    static updateProfilePic(): import("express-validator").ValidationChain[];
    static deleteProfilePic(): import("express-validator").ValidationChain[];
    static profileEdit(): import("express-validator").ValidationChain[];
}
