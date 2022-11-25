import * as path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import cors from 'cors';

import { corsOptions } from '~/server/app/cors';
import { router } from '~/server/router';

export function createApp() {
    // create Express application
    const app = express();


    app.set('port', process.env.PORT);
    app.set('case sensitive routing', true);

    app.use(express.json());
    app.use(cors(corsOptions));
    app.use(cookieParser());
    app.use(multer().array('~~/data/upload/'));


    // client authorized paths
    app.use('/public', express.static(path.join(process.env.ROOTPATH?? '.', 'dist/client')));


    // define port to listen to
    app.set('port', process.env.SERVER_PORT);

    app.set('case sensitive routing', true);

    // view engine setup
    app.set('view engine', 'ejs');
    app.set('views', path.join(process.env.ROOTPATH?? '.', '/dist/client/views'));

    // router
    app.use(router);

    return app;
}