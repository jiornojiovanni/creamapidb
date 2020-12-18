import { readFileSync } from 'fs';
import dot from 'dot';
import path from 'path';
import getDLCs from './dlcs';

dot.templateSettings.strip = false;

const file = readFileSync(path.resolve('./templates/cream_api.ini'));
const template = dot.template(file.toString());

const getCreamINI = (appid, opts) => new Promise((resolve, reject) => {
    if (opts.dlcs) {
        getDLCs(appid)
            .then((res) => {
                const list = res || [];
                resolve(template({ id: appid, dlcs: list, wrapper: opts.wrapper }));
            })
            .catch((err) => {
                reject(err);
            });
    } else resolve(template({ id: appid, dlcs: [], wrapper: opts.wrapper }));
});

export default getCreamINI;
