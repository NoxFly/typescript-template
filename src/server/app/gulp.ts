import gulp from 'gulp';
import ts from 'gulp-typescript';
import * as path from 'path';
import { colors } from '~/server/utils';


const tsProject = ts.createProject("tsconfig.json");

let paths: { [key: string]: string } = {};

function _(): void {

    paths.distFolder = 'dist';
    paths.distPath = path.join(process.env.ROOTPATH??'.', 'dist');
    // dist path
    paths.distViewsPath = path.join(paths.distPath, 'views');
    paths.distAssetPath = path.join(paths.distPath, 'public/assets')
    // dev path
    paths.viewPath = path.join(process.env.CLIENTPATH??'.', 'views');
    paths.assetPath = path.join(process.env.CLIENTPATH??'.', 'assets');

    console.log('SETUP GULP');
    console.log(paths);

    watch();

    // Task which would transpile typescript to javascript
    // gulp.task("typescript", () => tsProject.src().pipe(tsProject()).js.pipe(gulp.dest(distFolder)));

    // // Task which would delete the old dist directory if present
    // gulp.task("build-clean", () => fs.rmdir(distPath, () => {}));

    // // Task which would just create a copy of the current views directory in dist directory
    // gulp.task("views", () => gulp.src(`${viewPath}/**/*.ejs`).pipe(gulp.dest(distViewsPath)));

    // // Task which would just create a copy of the current static assets directory in dist directory
    // gulp.task("assets", () => gulp.src(`${assetPath}/**/*`).pipe(gulp.dest(distAssetPath)));

    // // The default task which runs at start of the gulpfile.js
    // gulp.task("default", gulp.series("build-clean", "typescript", "views", "assets"));
}

let ts_task_done: boolean = false;

function tsToJs(done: any): NodeJS.ReadWriteStream {
    return gulp.src(`${process.env.CLIENTPATH??'.'}/ts/**/*.ts`, { since: gulp.lastRun(tsToJs) })
        .pipe(tsProject())
        .on('error', (e: Error) => {
            console.error(
            colors.fgRed + 'Error while transpiling client .ts files :' + colors.reset, e);
            ts_task_done = false;
            done();
        })
        .pipe(gulp.dest(`${process.env.CLIENTPATH??'.'}/js/`))
        .on('end', (): void => {
            if(!ts_task_done) {
                ts_task_done = true;
                console.info(colors.fgGreen + '[CLIENT] Typescript -> Javascript OK.' + colors.reset);
            }

            done();
        });
    // return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest(process.env.CLIENTPATH + '/js'));
}


function watch(): void {
    gulp.watch(`${process.env.CLIENTPATH??'.'}/**/*.ts`, gulp.parallel(tsToJs));

    if(process.env.ENV === 'dev') {
        console.info('Watching file modifications...');
    }
}


export { _ as default }