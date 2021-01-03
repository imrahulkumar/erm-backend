export declare class EmailOauth {
    accessToken: any;
    constructor();
    static accessToken(): any;
    static sendEmail(data: {
        to: string;
        subject: string;
        text: string;
        html: string;
    }): Promise<any>;
}
