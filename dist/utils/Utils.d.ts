import * as Multer from 'multer';
export declare class Utils {
    MAX_TOKEN_TIME: number;
    multer: Multer.Multer;
    static generateVerificationToken(size?: number): number;
    static encryptPassword(password: any): Promise<any>;
    static comparePassword(password: {
        plainPassword: string;
        encryptPassword: string;
    }): Promise<any>;
    static randomStringGenerator(length?: number): string;
    static deleteFile(req: any, res: any, next: any): Promise<unknown>;
}
