import { DevEnvironment } from "./dev.env";
import { ProdEnvironment } from "./prod.env";


export interface Environment {
    db_url: string;
    jwt_secret: string;
    emailjs_com: { service_id: string, user_id: string };
}


export function getEnvironmentVariable() {
    if (process.env.NODE_ENV === 'production') {
        return ProdEnvironment;
    }
    return DevEnvironment;
}