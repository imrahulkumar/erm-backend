export interface Environment {
    db_url: string;
    jwt_secret: string;
    image_path: string;
    emailjs_com: {
        service_id: string;
        user_id: string;
    };
    email_oauth: {
        CLIENT_ID: string;
        CLEINT_SECRET: string;
        REDIRECT_URI: string;
        REFRESH_TOKEN: string;
    };
}
export declare function getEnvironmentVariable(): Environment;
