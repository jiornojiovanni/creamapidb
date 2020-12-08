import { getGameInfo, cacheGameInfo } from '../helpers/db';
import searchSteamCMD from '../helpers/steam-cmd';

const getAppData = (id) => {
    return new Promise((resolve, reject) => {
        getGameInfo(id)
            .then((result) => {
                if (result) {
                    return resolve(result);
                } else {
                    return searchSteamCMD(id);
                }
            })
            .then((result = null) => {
                if (result) {
                    resolve(result);
                    return cacheGameInfo(result);
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export default getAppData;