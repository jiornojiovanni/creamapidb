import steamcmd from 'steamcmd';
import escapePath from '../utils/escapePath';
import getName from '../utils/getName';
import getPath from '../utils/getPath';

const searchSteamCMD = async (id) => {
    const result = await steamcmd.getAppInfo(id);
    //Some game are missing fundamental information in their json (e.g. CSGO).
    if (JSON.stringify(result) == '{}' || !result.hasOwnProperty('config')) return null;
    const path = escapePath(getPath(result));
    const name = getName(result);
    return { id, name, path };
}

export default searchSteamCMD;
