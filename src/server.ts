import bodyParser = require('body-parser');
import * as  express from 'express';
import * as mongoose from 'mongoose';
import { getEnvironmentVariable } from './environments/env';
import { Jobs } from './jobs/Jobs';
import CommentRouter from './modules/comment/comment.router';
import PostRouter from './modules/post/post.router';
import UserRouter from './modules/user/user.router';
import * as cors from 'cors';

export class Server {

    public app: express.Application = express();
    public options: cors.CorsOptions = {
        allowedHeaders: [
          'Origin',
          'X-Requested-With',
          'Content-Type',
          'Accept',
          'X-Access-Token',
        ],
        credentials: true,
        methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
        // origin: 'http://localhost:4200',
        preflightContinue: false,
      };
    

    constructor() {
        this.setConfiguration();

        this.setRoutes();

        // To handle the req url which does not exist. 
        this.error404Handler();

        // To handle the error of each api.
        this.hanleErrors()
    }

    setConfiguration() {
        this.connectMongodb();
        this.configureBodyParser();
        Jobs.runRequiredJobs();        
       
    }

    configureBodyParser() {
        this.app.use(cors(this.options));
        this.app.use(bodyParser.json({ limit: '50mb' }));
        this.app.use(bodyParser.urlencoded({ extended: true }))
    }

    connectMongodb() {
        let dataBaseUrl = getEnvironmentVariable().db_url;
        mongoose.connect(dataBaseUrl, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            console.log("mongodb is connect")
        }).catch((err) => {
            console.log(err);
        })
    }

    setRoutes() {
        this.app.use('/src/uploads', express.static('src/uploads'))
        this.app.use('/api/erm/user', UserRouter);
        // this.app.use('/api/post', PostRouter);
        // this.app.use('/api/comment',CommentRouter);
    }

    error404Handler() {
        this.app.use((req, res) => {
            res.status(404).json({
                message: 'Not Found',
                status_code: '404'
            })
        })
    }

    //Its a special type of middleware which has error as first argument.
    hanleErrors() {
        this.app.use((error, req, res, next) => {

            const errorStatus = req.errorStatus || 500;

            res.status(errorStatus).json({
                message: error.message || 'Something went wrong. Please try again',
                status_code: errorStatus
            })
        })
    }

}