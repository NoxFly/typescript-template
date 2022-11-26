// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import gulp from 'gulp';
import ts from 'gulp-typescript';
import * as path from 'path';
import * as scss from 'sass';
import gsass from 'gulp-sass';
import clip from 'gulp-clip-empty-files';
import uglify from 'gulp-uglify';

import { colors } from '~/server/utils';
import minifyejs from './minify-ejs';


const sass = gsass(scss);

const tsProject = ts.createProject("front.tsconfig.json");

const uglifyJsOptions: uglify.Options = {
    compress: {
        module: true,
        drop_console: false
    },
    output: {
        comments: false
    }
};

const paths: {
    dist: { [key: string]: string },
    dev: { [key: string]: string }
} = {
    dist: {},
    dev: {}
};

let ts_task_done: boolean = false;
let css_task_done: boolean = false;
let views_task_done: boolean = false;



function compileJS(done: any): NodeJS.ReadWriteStream {
    return gulp.src(`${paths.dev.js}/**/*.ts`, { since: gulp.lastRun(compileJS) })
        .pipe(tsProject())
        .on('error', (e: Error) => {
            console.error(
            colors.fgRed + 'Error while compiling JS :' + colors.reset, e);
            ts_task_done = false;
            done();
        })
        .pipe(uglify(uglifyJsOptions))
        .pipe(gulp.dest(`${paths.dist.js}/`))
        .on('end', (): void => {
            if(!ts_task_done) {
                ts_task_done = true;
                console.info(colors.fgGreen + '[CLIENT] Javascript compilation OK.' + colors.reset);
            }

            done();
        });
}

function compileCSS(done: any): NodeJS.ReadWriteStream {
    return gulp.src(`${paths.dev.css}/**/*.scss`, { since: gulp.lastRun(compileCSS) })
        .pipe(sass.sync({
            errLogToConsole: true,
            outputStyle: 'compressed'
        }))
        .on('error', (e: Error) => {
            console.error(colors.fgRed + `Error while compiling CSS : ` + colors.reset , e);
            sass.logError;
            css_task_done = false;
            done();
        })
        .pipe(clip())
        .pipe(gulp.dest(`${paths.dist.css}/`))
        .on('end', () => {
            if(!css_task_done) {
                css_task_done = true;
                console.info(colors.fgGreen + '[CLIENT] CSS compilation OK.' + colors.reset);
            }

            done();
        });
}

function compileViews(done: any): NodeJS.ReadWriteStream {
    return gulp.src(`${paths.dev.views}/**/*.ejs`, { since: gulp.lastRun(compileViews) })
        .pipe(minifyejs())
        .on('error', (e: Error) => {
            console.error(colors.fgRed + 'Error while compiling EJS :' + colors.reset, e);
            views_task_done = false;
            done();
        })
        .pipe(gulp.dest(`${paths.dist.views}/`))
        .on('end', () => {
            if(!views_task_done) {
                views_task_done = true;
                console.info(colors.fgGreen + '[CLIENT] Views compilation OK.' + colors.reset);
            }

            done();
        });
}


function watch(done: any): void {
    gulp.watch(`${paths.dev.js}/**/*.ts`, gulp.parallel(compileJS));
    gulp.watch(`${paths.dev.css}/**/*.scss`, gulp.parallel(compileCSS));
    gulp.watch(`${paths.dev.views}/**/*.ejs`, gulp.parallel(compileViews));

    if(process.env.ENV === 'dev') {
        console.info('Watching file modifications...');
    }

    done();
}

function build(done: any): void {
    if(process.env.ENV === 'dev') {
        console.info('Building client sources...');
    }

    gulp.parallel(clean, compileViews, compileCSS, compileJS, copyAssets)(done);

    done();
}

function copyAssets(done: any): NodeJS.ReadWriteStream {
    return gulp.src(`${paths.dev.assets}/**/*`)
        .pipe(gulp.dest(`${paths.dist.assets}/`))
        .on('end', () => {
            console.info(colors.fgGreen + '[CLIENT] Assets copied.' + colors.reset);
            done();
        });
}

function clean(done: any): void {
    done();
}

export default function _(): void {
    const clientPath: string = process.env.CLIENTPATH??'.';
    const clientDistPath: string = path.join(process.env.ROOTPATH??'.', 'dist/client');

    // dist path
    paths.dist.views = path.join(clientDistPath, 'views');
    paths.dist.css = path.join(clientDistPath, 'css');
    paths.dist.js = path.join(clientDistPath, 'js');
    paths.dist.assets = path.join(clientDistPath, 'assets');
    // dev path
    paths.dev.views = path.join(clientPath, 'views');
    paths.dev.css = path.join(clientPath, 'scss');
    paths.dev.js = path.join(clientPath, 'ts');
    paths.dev.assets = path.join(clientPath, 'assets');

    if(process.env.ENV === 'dev') {
        gulp.series(build, watch)();
    }
    else {
        gulp.series(build)();
    }
}