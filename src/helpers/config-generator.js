import getDLCs from './dlc';
import dot from 'dot';
import { readFileSync } from 'fs';
import { resolve } from 'path';

dot.templateSettings.strip = false;

const compiledTemplate = dot.template(readFileSync(resolve("./templates/cream_api.ini")));

const getCreamINI = (appid, opts) => {
    return new Promise((resolve, reject) => {
        if (opts.dlcs)
            getDLCs(appid)
                .then((res) => {
                    const list = res || [];
                    resolve(compiledTemplate({ id: appid, dlcs: list }));
                })
                .catch((err) => {
                    reject(err);
                })
        else
            resolve(compiledTemplate({ id: appid, dlcs: [] }));
    });

}

export default getCreamINI;