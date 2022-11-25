import * as dotenv from 'dotenv';
import * as path from 'path';


dotenv.config();


switch(process.env.ENV) {
	case 'production':
	case 'prod':
		process.env.ENV = 'prod';
		break;
	default:
		process.env.ENV = 'dev';
}


process.env.TZ = 'Europe/Paris';
process.env.PROTOCOL = (process.env.ENV === 'prod') ? 'https://' : 'http://';
process.env.CLIENT_ORIGIN = process.env.PROTOCOL + process.env.SERVER_HOST + ':4200';

process.env.BASEPATH = path.resolve(__dirname, '..');
process.env.SRCPATH = path.resolve(__dirname, '../..');
process.env.ROOTPATH = path.resolve(__dirname, '../../..');
process.env.CLIENTPATH = path.join(process.env.SRCPATH, 'client');