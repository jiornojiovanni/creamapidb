import { getAppInfo } from 'steamcmd';
import escapePath from '../utils/escapePath';
import getName from '../utils/getName';
import getPath from '../utils/getPath';
import { cacheData } from './db';

const searchSteamCMD = function searchSteamCMD(id) {
    return getAppInfo(id)
        .then((result) => {
            //Some game are missing fundamental information in their json (e.g. CSGO).
            if (JSON.stringify(result) == '{}' || !result.hasOwnProperty('config')) return null;
            const path = escapePath(getPath(result));
            const name = getName(result);
            //Cache the data in the db, so we can use it in subsequent search, no need to await it.
            cacheData(id, name, path);
            return { id, name, path };
        });
}

export default searchSteamCMD;
