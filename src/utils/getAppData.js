import { getGameInfo, cacheGameInfo } from '../helpers/db';
import searchSteamCMD from '../helpers/steam-cmd';

const getAppData = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const infoFromDb = await getGameInfo(id);
            if (infoFromDb) return resolve(infoFromDb);
            const infoFromSteamCMD = await searchSteamCMD(id);
            await cacheGameInfo(infoFromSteamCMD);
            resolve(infoFromSteamCMD);
        } catch(e) {
            reject(e);
        }
    });
}

export default getAppData;