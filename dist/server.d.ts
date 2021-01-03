import * as express from 'express';
import * as cors from 'cors';
export declare class Server {
    app: express.Application;
    options: cors.CorsOptions;
    constructor();
    setConfiguration(): void;
    configureBodyParser(): void;
    connectMongodb(): void;
    setRoutes(): void;
    error404Handler(): void;
    hanleErrors(): void;
}
