import getDLCs from './dlc';
import { compileFile } from 'pug';

const compiledTemplate = compileFile('templates/creamapi.pug');

const getCreamINI = (appid, dlc) => {
    return new Promise((resolve, reject) => {
        if (dlc)
            getDLCs(appid)
                .then((res) => {
                    const list = res != null ? res : [];
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