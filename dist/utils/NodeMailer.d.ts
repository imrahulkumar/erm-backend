export declare class NodeMailer {
    private static initializeTransport;
    static sendEmail(data: {
        to: [string];
        subject: string;
        html: string;
    }): void;
}
