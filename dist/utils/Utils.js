"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const Bcrypt = require("bcrypt");
const Multer = require("multer");
const fs = require("fs");
const env_1 = require("../environments/env");
const storageOption = Multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, `${Utils.randomStringGenerator()}.${file.originalname.split(".")[file.originalname.split(".").length - 1]}`);
    }
});
// To validate the file type i.e only jpeg and png file is uploaded
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
class Utils {
    constructor() {
        this.MAX_TOKEN_TIME = 60000;
        this.multer = Multer({ storage: storageOption, fileFilter: fileFilter });
    }
    static generateVerificationToken(size = 5) {
        let digits = '0123456789';
        let otp = "";
        for (let i = 0; i < size; i++) {
            otp += digits[Math.floor(Math.random() * 10)];
        }
        return parseInt(otp);
    }
    static encryptPassword(password) {
        return new Promise((resolve, reject) => {
            Bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(hash);
                }
            });
        });
    }
    static comparePassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                Bcrypt.compare(password.plainPassword, password.encryptPassword, (err, isValid) => {
                    if (err) {
                        reject(new Error(err));
                    }
                    else if (!isValid) {
                        reject(new Error('Email & Password Does Not Match'));
                    }
                    else {
                        resolve({ value: true });
                    }
                });
            });
        });
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
    static deleteFile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                    let url = env_1.getEnvironmentVariable().image_path;
                    let fileName = req.body.profile_pic;
                    let fileDestination = fileName.replace(url, '');
                    let isExist = fs.statSync(fileDestination);
                    if (isExist.isFile()) {
                        fs.unlinkSync(fileDestination);
                        resolve({ status: 200, message: 'deleted succesfully' });
                    }
                    else {
                        throw new Error('Not Exist');
                    }
                }
                catch (error) {
                    next(error);
                }
            });
        });
    }
}
exports.Utils = Utils;
