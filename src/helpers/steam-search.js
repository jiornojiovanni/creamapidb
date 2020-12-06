import axios from 'axios';
import { JSDOM } from 'jsdom';
import { STEAM } from '../config/constants'

export function getSteamSearch(text) {
    return new Promise((resolve, reject) => {
        axios.get(STEAM.SEARCH.URL, { params: STEAM.SEARCH.OPTIONS(text) })
            .then((response) => {
                const dom = new JSDOM(response.data);
                const doc = dom.window.document.querySelector('#search_resultsRows')

                if (!doc) return resolve([]);

                const results = doc.querySelectorAll('a');
                let resultArray = [];
                const length = Math.min(results.length, STEAM.MAX_RESULTS);

                for (let i = 0; i < length; i++) {
                    const e = results[i];
                    resultArray.push({
                        name: e.querySelector('.title').textContent,
                        id: e.getAttribute('data-ds-appid'),
                        img: e.querySelector('img').getAttribute('src')
                    });
                }
                resolve(resultArray);
            });
    });
}