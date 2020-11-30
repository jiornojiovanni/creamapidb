const https = require('https');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

exports.getSteamSearch = (text) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: "store.steampowered.com",
            path: encodeURI("/search/suggest?f=games&cc=EN&l=english&term=" + text),
            method: 'GET'
        };
        const req = https.request(options, (res) => {
            if (res.headers['content-length'] == 0) {
                req.abort();
                reject(new Error("Search Error"));
            }
            res.on('data', (data) => {
                let resultArray = [];
                const dom = new JSDOM(data.toString());
                dom.window.document.querySelectorAll('a').forEach((elm) => {
                    resultArray.push( 
                    {
                        name: elm.querySelector('.match_name').textContent, 
                        id: elm.getAttribute('data-ds-appid'), 
                        img: elm.querySelector('img').getAttribute('src')
                    });
                });
                resolve(resultArray);
            });
        });
        req.on('error', (err) => {
            console.log(err);
            reject(err);
        });
        req.end();
    });
}