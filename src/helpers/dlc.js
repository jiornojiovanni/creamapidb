import axios from 'axios';

const getDLClist = (id) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://store.steampowered.com/api/appdetails/?appids=${id}`)
            .then((response) => {
                const json = response.data;
                if (json[id].data.hasOwnProperty("dlc")) {
                    resolve(json[id].data.dlc);
                } else {
                    resolve([]);
                }
            })
            .catch((err) => {
                reject(err);
            })
    });
}

export default getDLClist;