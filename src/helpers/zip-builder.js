import { createWriteStream } from 'fs';
import archiver from 'archiver';
import { file as _file } from 'tmp';
import getCreamINI from './config-generator';

const buildZip = ({ id, gamePath, dlc }) => {
    return new Promise((resolve, reject) => {
        _file((err, path) => {
            if (err) reject(err);
            const file = createWriteStream(path);
            const archive = archiver('zip');

            file.on('close', function () { resolve(path); });
            archive.on('warning', (err) => { reject(err); });
            archive.on('error', (err) => { reject(err); });

            archive.pipe(file);
            getCreamINI(id, dlc)
                .then((res) => {
                    archive.append(res, { name: gamePath + 'cream_api.ini' });
                    archive.directory('bin/', gamePath);
                    archive.finalize();
                })
        });
    });
}

export default buildZip;