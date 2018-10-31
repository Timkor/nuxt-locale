import express from 'express';
import serveStatic from 'serve-static';

export function createMiddleware(localeDir) {

    // Create express app:
    const middleware = express();
    
    middleware.use('/_locale', serveStatic(localeDir, {
        index: false
    }));

    middleware.use('/_locale', (req, res, next) => {
        res.status(404).end();
    })


    return middleware;
};