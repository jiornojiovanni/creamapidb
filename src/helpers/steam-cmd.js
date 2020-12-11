import steamcmd from 'steamcmd';
import escapePath from '../utils/escapePath';
import getName from '../utils/getName';
import getPath from '../utils/getPath';
import { ERRORS } from '../config/constants';

const searchSteamCMD = (id) => new Promise((resolve, reject) => {
    steamcmd.getAppInfo(id)
        .then((result) => {
            if (JSON.stringify(result) === '{}' || !result.hasOwnProperty('config')) throw Error(ERRORS.MISSING_DATA);
            resolve({
                id,
                name: getName(result),
                path: escapePath(getPath(result)),
            });
        })
        .catch((e) => { reject(e); });
});

export default searchSteamCMD;
