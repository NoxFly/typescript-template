import '~/server/app/environment';
import * as http from 'http';
import { createApp } from '~/server/app/expressApp';
import gulp from '~/server/app/gulp';

// start gulp
gulp();


// create http server
const app = createApp();
const server = http.createServer(app);

// start the server
server.listen({
    host: process.env.SERVER_HOST,
    port: process.env.SERVER_PORT
});

server.on('listening', () => {
    console.info(`server listening to http://127.0.0.1:${process.env.SERVER_PORT}`);
});