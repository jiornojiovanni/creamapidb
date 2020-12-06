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
                const count = Math.min(results.length, STEAM.MAX_RESULTS);
                for (let i = 0; i < count; i++) {
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