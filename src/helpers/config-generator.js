import getDLCs from './dlc';
import { compileFile } from 'pug';

const compiledTemplate = compileFile('templates/creamapi.pug');

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