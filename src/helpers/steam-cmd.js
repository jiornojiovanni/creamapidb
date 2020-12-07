import steamcmd from 'steamcmd';
import escapePath from '../utils/escapePath';
import getName from '../utils/getName';
import getPath from '../utils/getPath';

const searchSteamCMD = (id) => {
    return new Promise((resolve, reject) => {
        steamcmd.getAppInfo(id)
            .then((result) => {
                if (JSON.stringify(result) == '{}' || !result.hasOwnProperty('config')) throw Error('Missing config in game infos.');
                resolve({
                    id,
                    name: getName(result),
                    path: escapePath(getPath(result))
                });
            })
            .catch((e) => { reject(e); });
    });
};

export default searchSteamCMD;
