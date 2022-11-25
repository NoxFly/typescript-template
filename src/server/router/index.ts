import express, { NextFunction } from 'express';
import { createRouter, loadTemplate } from './functions.routing';
import mainRouter from './router';


export const router = createRouter();



router.use('/', mainRouter);


// last url : not found = 404 | 500

// catch 404 and forwards to error handler
router.use((req: express.Request, res: express.Response, next: NextFunction) => {
    next({
        statusCode: 404,
        message: 'Page Not Found'
    });
});

// error handler
router.use((err: any, req: express.Request, res: express.Response, next: NextFunction) => {
    // apply error status
    if(process.env.ENV === 'dev') {
        console.error('[ERROR] Router : ', err.statusCode, err.message, req.originalUrl);
    }

    // render the error page
    loadTemplate(req, res, 'error', {
        status: err.statusCode,
        error: err.details || '',
        message: req.app.get('env') === 'development' ? err.message : 'An error occured'
    });
});