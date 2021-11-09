import { getGameInfo, cacheGameInfo } from '../helpers/db';
import searchSteamCMD from '../helpers/steam-cmd';

async function getAppData(id) {
    const infoFromDb = await getGameInfo(id);
    if (infoFromDb) {
        return infoFromDb;
    }
    const infoFromSteamCMD = await searchSteamCMD(id);
    await cacheGameInfo(infoFromSteamCMD);
    return infoFromSteamCMD;
}

export default getAppData;
