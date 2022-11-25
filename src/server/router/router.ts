import express from 'express';
import { createRouter, loadTemplate } from '~/server/router/functions.routing';


const router: express.Router = createRouter();

router.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => loadTemplate(req, res, 'home'));
/*
router.post()
router.update()
router.delete()
...
*/

export { router as default };