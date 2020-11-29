const https = require('https');
const NameRegex = /div class="match_name">([^<>]*)<\/div>/g;
const IDregex = /https:\/\/store.steampowered.com\/app\/(\d*)\//g;

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
                const ids = data2array(data, IDregex);
                const names = data2array(data, NameRegex);
                resolve({ id: ids, name: names });
            });
        });
        req.on('error', (err) => {
            console.log(err);
            reject(err);
        });
        req.end();
    });
}

function data2array(data, regex) {
    let array = [];
    while ((result = regex.exec(data)) != null) {
        array.push(result[1]);
    }
    return array;
}