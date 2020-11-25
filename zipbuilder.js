const fs = require('fs');
const uuid = require('uuid');
const archiver = require('archiver');
const path = require('path');
const { arch } = require('os');

exports.buildZip = async (id, gamepath) => {
    const filename = 'cream_cache/zips/' + uuid.v4() + '.zip';
    const output = fs.createWriteStream(filename);

    const archive = archiver('zip');

    archive.on('warning', function (err) {
        if (err.code === 'ENOENT') {
            console.log(err);
        } else {
            throw err;
        }
    });

    archive.on('error', function (err) {
        throw err;
    });

    archive.pipe(output);

    archive.append(getCreamINI(id), { name: gamepath + 'cream_api.ini' });
    archive.file('cream_cache/steam_api.dll', { name: gamepath + 'steam_api.dll' });
    archive.file('cream_cache/steam_api64.dll', { name: gamepath + 'steam_api64.dll' });
    archive.file('cream_cache/steam_api_o.dll', { name: gamepath + 'steam_api_o.dll' });
    archive.file('cream_cache/steam_api64_o.dll', { name: gamepath + 'steam_api64_o.dll' });
    await archive.finalize();
    return filename;
};

function getCreamINI(appid) {
    const text =
        '[steam]\n' +
        `appid = ${appid}\n` +
        'unlockall = true\n' +
        'orgapi = steam_api_o.dll\n' +
        'orgapi64 = steam_api64_o.dll\n' +
        'extraprotection = false\n' +
        'forceoffline = false\n' +
        '[steam_misc]\n' +
        'disableuserinterface = false\n' +
        '[dlc]';

    return text;
}