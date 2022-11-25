// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// https://www.npmjs.com/package/gulp-ejs-minify
// I've get out this dep of node_modules to fix gulp-utils unresolvable issue

const through = require('through2'),
    PluginError = require('plugin-error');

function _(file: any): NodeJS.ReadWriteStream {
    return through.obj(function(file, enc, cb) {
        if (!file)
            throw new PluginError('gulp-minify-ejs', 'Missing file option for gulp-minify-ejs');

        if (typeof file !== 'string' && typeof file.path !== 'string')
            throw new PluginError('gulp-minify-ejs', 'Missing path in file options for gulp-minify-ejs');

        function trim(str) {
            if (!str || !str.length)
                return '';

            let start, end, i;

            for (i = str.length - 1; i >= 0; i--) {
                if (str[i] !== ' ')
                    break;
            }

            //all of chars is empty such as ' '
            if (i === -1)
                return '';

            end = i + 1;

            if(end < str.length && str[i] !== '>')
                end++;

            for (i = 0; i < str.length; i++) {
                if (str[i] !== ' ')
                    break;
            }

            start = i;

            if(start > 0 && str[start-1] !== '<')
                start--;

            return str.substring(start, end);
        }

        function minify(contents) {
            const htmlBuilder = [];
            let inner = false,
                intag = false, //<div> or </div>
                intagin = false, //<% expr %> ... <% for(var a=1; a "<" 5
                inscript = false,
                incss = false;

            let innerTextBuilder = [];

            for (let i = 0; i < contents.length; i++) {
                let charstr = contents[i];

                // possibly comment area
                if(charstr === '/') {
                    // remove inline comment
                    if(contents[i+1] === '/') {
                        i += 2;
                        while(i < contents.length && contents[i] !== '\n')
                            i++;
                        i++; // skip line break
                        continue;
                    }
                    // remove multiline comment
                    else if(contents[i+1] === '*') {
                        i += 3;
                        while(i < contents.length && contents[i] !== '/' && contents[i-1] !== '*')
                            i++;
                        i++;
                        continue;
                    }
                }

                if (charstr === '<') {
                    if (contents.substr(i, 7).toLowerCase() === '<script') {
                        inscript = true;
                    }

                    if (contents.substr(i, 6).toLowerCase() === '<style') {
                        incss = true;
                    }

                    //maybe [<]div> or [<]/div> or a [<] 5
                    if (contents[i + 1] !== '%') {
                        //case a <= 5
                        if (!intagin) {
                            intag = true;
                        }
                        inner = true;
                    } else {
                        //> ... [<]% ...
                        if (!inner) {
                            intag = false;
                            inner = true;
                            intagin = true;
                        }
                    }

                    if (inner && innerTextBuilder.length) {
                        //debugger;
                        const innerTextStr = innerTextBuilder.join('');

                        const textToAdd = (intagin && (contents[i+2] === '=' || contents[i+2] === '-'))?
                            innerTextStr :
                            trim(innerTextStr);

                        if(textToAdd.length > 0) {
                            htmlBuilder.push(textToAdd);
                        }
                        
                        innerTextBuilder = [];
                    }
                }

                if (charstr === '>') {
                    if (i >= 4 && contents.substr(i - 6, 6).toLowerCase() === '/style') {
                        incss = false;
                        htmlBuilder.push(charstr);
                        inner = intag = intagin = false;
                        continue;
                    }
                    if (i >= 7 && contents.substr(i - 7, 7).toLowerCase() === '/script') {
                        inscript = false;
                        htmlBuilder.push(charstr);
                        inner = intag = intagin = false;
                        continue;
                    }
                }

                if (inscript || incss) {
                    htmlBuilder.push(charstr);
                    continue;
                } else {
                    if (inner) {
                        htmlBuilder.push(charstr);
                    } else {
                        if (charstr === '\r' || charstr === '\n' || charstr === '\t')
                            continue;
                        innerTextBuilder.push(charstr);
                    }
                }
                //maybe <...div[>] or </div[>] or <% a [>] 5 %> or <div ...  <% a [>] 5 %>[>]
                if (charstr === '>') {
                    if (contents[i - 1] !== '%') {
                        intag = false;
                        inner = false;
                    } else {
                        if (!intag) {
                            inner = false;
                            intagin = false;
                        }
                    }
                }
            }

            return htmlBuilder.join('');
        }

        if (file.isBuffer()) {
            const contents = file.contents.toString('utf-8');
            file.contents = new Buffer.from(minify(contents));
        }

        this.push(file);

        cb();
    });
};

export { _ as default };