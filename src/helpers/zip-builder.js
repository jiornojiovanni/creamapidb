import { createWriteStream } from 'fs';
import archiver from 'archiver';
import { file as _file } from 'tmp';
import { promises as fsPromises } from 'fs';

const buildZip = function buildZip({ id, gamepath }) {
    return new Promise((resolve, reject) => {
        _file((err, path, fd) => {
            if (err) reject(err);

            const file = createWriteStream(path);
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

            archive.pipe(file);

            archive.append(getCreamINI(id), { name: gamepath + 'cream_api.ini' });
            archive.file('bin/steam_api.dll', { name: gamepath + 'steam_api.dll' });
            archive.file('bin/steam_api64.dll', { name: gamepath + 'steam_api64.dll' });
            archive.file('bin/steam_api_o.dll', { name: gamepath + 'steam_api_o.dll' });
            archive.file('bin/steam_api64_o.dll', { name: gamepath + 'steam_api64_o.dll' });
            archive.finalize()
                .then(() => {
                    //We check if file exists before returning it as Archiver lib is a bit bugged.
                    return fsPromises.stat(path);
                })
                .then(() => { resolve(path); });
        });
    });
}

const getCreamINI = (appid) => {
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

export default buildZip;