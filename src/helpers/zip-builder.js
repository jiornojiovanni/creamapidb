import { createWriteStream } from 'fs';
import archiver from 'archiver';
import { file as _file } from 'tmp';

const buildZip = ({ id, gamePath }) => {
    return new Promise((resolve, reject) => {
        _file((err, path) => {
            if (err) reject(err);
            const file = createWriteStream(path);
            const archive = archiver('zip');

            file.on('close', function () { resolve(path); });
            archive.on('warning', (err) => { reject(err); });
            archive.on('error', (err) => { reject(err); });

            archive.pipe(file);
            archive.append(getCreamINI(id), { name: gamePath + 'cream_api.ini' });
            archive.directory('bin/', gamePath);
            archive.finalize();
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