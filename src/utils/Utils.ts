import * as Bcrypt from 'bcrypt';
import * as Multer from 'multer'

const storageOption: any = Multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, `${Utils.randomStringGenerator()}.${file.originalname.split(".")[file.originalname.split(".").length - 1]}`)
    }
});


// To validate the file type i.e only jpeg and png file is uploaded
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}


export class Utils {

    public MAX_TOKEN_TIME = 60000;

    public multer = Multer({ storage: storageOption, fileFilter: fileFilter })

    static generateVerificationToken(size: number = 5) {
        let digits = '0123456789';
        let otp = "";
        for (let i = 0; i < size; i++) {
            otp += digits[Math.floor(Math.random() * 10)]
        }
        return parseInt(otp)
    }

    static encryptPassword(password): Promise<any> {
        return new Promise((resolve, reject) => {
            Bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(hash)
                }
            })
        })
    }

    static async comparePassword(password: { plainPassword: string, encryptPassword: string }): Promise<any> {
        return new Promise((resolve, reject) => {
            Bcrypt.compare(password.plainPassword, password.encryptPassword, (err, isValid) => {
                if (err) {
                    reject(new Error(err))
                }
                else if (!isValid) {
                    reject(new Error('Email & Password Does Not Match'))
                }
                else {
                    resolve({ value: true })
                }
            })
        })
    }
    static randomStringGenerator(length = 8) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}


