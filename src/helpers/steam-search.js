import axios from 'axios';
import { JSDOM } from 'jsdom';
import { STEAM } from '../config/constants'

export function getSteamSearch(text) {
    return new Promise((resolve, reject) => {
        axios.get(STEAM.SEARCH.URL, { params: STEAM.SEARCH.OPTIONS(text) })
            .then((response) => {
                let resultArray = [];
                const dom = new JSDOM(response.data);
                const doc = dom.window.document.querySelector('#search_resultsRows')
                if (!doc) return resolve([]);
                const results = doc.querySelectorAll('a');
<<<<<<< HEAD
                const length = Math.min(results.length,STEAM.MAX_RESULTS);
=======
                let resultArray = [];
                const length = Math.min(results.length, STEAM.MAX_RESULTS);

>>>>>>> e5011409a01e2bc065c8df891882409fe27790e3
                for (let i = 0; i < length; i++) {
                    const e = results[i];
                    resultArray.push({
                        name: e.querySelector('.title').textContent,
                        id: e.getAttribute('data-ds-appid'),
                        img: e.querySelector('img').getAttribute('src')
                    });
                }
                resolve(resultArray);
            })
            .catch((err) => { reject(err); });
    });
}