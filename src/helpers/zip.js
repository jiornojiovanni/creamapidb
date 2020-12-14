import { createWriteStream } from 'fs';
import archiver from 'archiver';
import { file as _file } from 'tmp';
import getCreamINI from './config-generator';

const buildZip = ({ id, gamePath, opts }) => new Promise((resolve, reject) => {
    _file((err, path) => {
        if (err) reject(err);
        const file = createWriteStream(path);
        const archive = archiver('zip');

        file.on('close', () => { resolve(path); });
        archive.on('warning', (error) => { reject(error); });
        archive.on('error', (error) => { reject(error); });
        archive.pipe(file);

        getCreamINI(id, opts)
            .then((res) => {
                archive.append(res, { name: `${gamePath}cream_api.ini` });
                if (opts.wrapper) {
                    archive.directory('bin/legacy', gamePath);
                } else {
                    archive.directory('bin/modern', gamePath);
                }
                archive.directory('bin/steam', gamePath);
                archive.finalize();
            })
            .catch((error) => {
                reject(error);
            });
    });
});

const getZip = ({ id, name, path }, opts) => new Promise((resolve, reject) => {
    buildZip({ id, gamePath: path, opts })
        .then((zipPath) => {
            resolve({ path: zipPath, name });
        })
        .catch((err) => {
            reject(err);
        });
});

export default getZip;