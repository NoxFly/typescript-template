import { CorsOptions } from 'cors';
import { Request, Response } from 'express';

export const whitedListDomain: string[] = [];

if(process.env.CLIENT_ORIGIN) {
	whitedListDomain.push(process.env.CLIENT_ORIGIN);

	if(process.env.HOST) {
		whitedListDomain.push(process.env.CLIENT_ORIGIN.replace(process.env.HOST, 'localhost'));
	}
}

export const corsOptions: CorsOptions = {
	origin: whitedListDomain,
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE'],
	allowedHeaders: [
		'Origin',
		'Content-Type',
		'Accept',
		'X-Nox-Token',
		'Access-Control-Allow-Origin',
		'Access-Control-Allow-Headers',
		'Access-Control-Allow-Methods'
	]
};

export const setCorsToRequest = (req: Request, res: Response): void => {
	res.header('Access-Control-Allow-Origin', req.headers.origin);
	res.header('Access-Control-Allow-Credentials', 'true');
	res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT');
};