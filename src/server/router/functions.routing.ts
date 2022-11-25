import express, { Router } from 'express';


export function createRouter(): Router {
    return Router({ caseSensitive: true });
}

export function loadTemplate(req: express.Request, res: express.Response, page: string, data: any = {}): void {
    if(page.startsWith('/'))
		page = page.slice(1);

    data.page = page;
	data.query = req.query;
    data.url = req.url;
    data.route = req.route?.path.split('/')[1] || 'error';
    data.applicationName = process.env.APPLICATION_NAME;

    if(!data.pageTitle) {
        if(req.url !== '/')
            data.pageTitle = req.url.slice(1).replace(/[\-_]/g, ' ');
    }

    data = Object.assign(data, req.params);
    
    const status = data.status || 200;

	res.status(status).render('template', data);
}