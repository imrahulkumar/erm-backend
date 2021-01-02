import { DevEnvironment } from "./dev.env";
import { ProdEnvironment } from "./prod.env";


export interface Environment {
    db_url: string;
    jwt_secret: string;
    image_path: string;
    emailjs_com: { service_id: string, user_id: string };
    email_oauth: {
        CLIENT_ID: string;
        CLEINT_SECRET: string;
        REDIRECT_URI: string;
        REFRESH_TOKEN: string;

    }
}


export function getEnvironmentVariable() {
    if (process.env.NODE_ENV === 'production') {
        return ProdEnvironment;
    }
    return DevEnvironment;
}