import steamcmd from 'steamcmd';
import escapePath from '../utils/escapePath';
import getName from '../utils/getName';
import getPath from '../utils/getPath';
import { ERRORS } from '../config/constants';

const searchSteamCMD = (appid) => new Promise((resolve, reject) => {
    steamcmd.getAppInfo(appid)
        .then((result) => {
            if (JSON.stringify(result) === '{}' || !result.hasOwnProperty('config')) throw Error(ERRORS.MISSING_DATA);
            resolve({
                appid,
                name: getName(result),
                path: escapePath(getPath(result)),
            });
        })
        .catch((e) => { reject(e); });
});

export default searchSteamCMD;
