import axios from 'axios';
import { JSDOM } from 'jsdom';
import { STEAM } from '../config/constants'

export function getSteamSearch(text) {
    return new Promise((resolve, reject) => {
        axios.get(`https://store.steampowered.com/search/results?&category1=998&term=${text}`)
            .then((response) => {
                const dom = new JSDOM(response.data);
                const results = dom.window.document.querySelectorAll('a');
                let resultArray = [];

                const length = results.length > STEAM.MAX_RESULTS ? STEAM.MAX_RESULTS : results.length;

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