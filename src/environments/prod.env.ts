import { Environment } from './env'

export const ProdEnvironment: Environment = {
    db_url: "mongodb+srv://demo:demo@cluster0.cjcjs.mongodb.net/erm?retryWrites=true&w=majority",
    jwt_secret: "test1",
    image_path:"https://erm-node.herokuapp.com/",
    emailjs_com: {
        service_id: 'service_2h9yazf',
        user_id: "user_WdbGMLp6Y44TlgxsfVZH7"
    }
}