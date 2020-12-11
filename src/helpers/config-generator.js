import dot from 'dot';
import { readFileSync } from 'fs';
import path from 'path';
import getDLCs from './dlc';

dot.templateSettings.strip = false;

const compiledTemplate = dot.template(readFileSync(path.resolve('./templates/cream_api.ini')));

const getCreamINI = (appid, opts) => new Promise((resolve, reject) => {
    if (opts.dlcs) {
        getDLCs(appid)
            .then((res) => {
                const list = res || [];
                resolve(compiledTemplate({ id: appid, dlcs: list }));
            })
            .catch((err) => {
                reject(err);
            });
    } else resolve(compiledTemplate({ id: appid, dlcs: [] }));
});

export default getCreamINI;
