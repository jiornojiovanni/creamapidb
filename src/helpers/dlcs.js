import axios from 'axios';
import { STEAM } from '../config/constants';

const getDLCs = (appid) => new Promise((resolve, reject) => {
    axios.get(STEAM.DLCS.URL, { params: STEAM.DLCS.OPTIONS(appid) })
        .then((response) => {
            const json = response.data;
            if (json[appid].data.hasOwnProperty('dlc')) {
                resolve(json[appid].data.dlc);
            } else {
                resolve(null);
            }
        })
        .catch((err) => {
            reject(err);
        });
});

export default getDLCs;
