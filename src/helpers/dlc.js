import axios from 'axios';
import { STEAM } from '../config/constants';

const getDLCs = (id) => {
    return new Promise((resolve, reject) => {
        axios.get(STEAM.DLCS.URL, { params: STEAM.DLCS.OPTIONS(id) })
            .then((response) => {
                const json = response.data;
                if (json[id].data.hasOwnProperty("dlc")) {
                    resolve(json[id].data.dlc);
                } else {
                    resolve(null);
                }
            })
            .catch((err) => {
                reject(err);
            })
    });
}

export default getDLCs;