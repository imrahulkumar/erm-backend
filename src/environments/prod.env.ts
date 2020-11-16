import { Environment } from './env'

export const ProdEnvironment: Environment = {
    db_url: "mongodb+srv://demo:demo@cluster0.cjcjs.mongodb.net/postWeb?retryWrites=true&w=majority",
    jwt_secret: "prodSecret",
    emailjs_com: {
        service_id: 'service_k65149f',
        user_id: "user_WdbGMLp6Y44TlgxsfVZH7"
    }
}