import Router from 'express';
import { getGameInfo, cacheGameInfo } from '../helpers/db';
import buildZip from '../helpers/zip-builder';
import searchSteamCMD from '../helpers/steam-cmd';

const router = Router();

router.get('/download/:id', (req, res) => {
    const id      = parseInt(req.params.id) || null;
    const dlcs    = req.query.dlcs == 1 || false;
    const wrapper = req.query.wrapper == 1 || false;
    if (id == null || !Number.isInteger(id) || !(wrapper || dlcs)) res.end();
    getData(id)
        .then((result) => {
            return Promise.all([
                buildZip({ 
                    id, 
                    gamePath: result.path, 
                    opts : { dlcs, wrapper } 
                }), 
                result.name
            ]);
        })
        .then(([path, name]) => {
            res.download(path, `${name.toLowerCase()}.zip`);
        })
        .catch((err) => {
            console.log(err)
            res.json({ err: err.message });
            console.error(err);
        });
});

router.get('/download', (req, res) => {
    res.redirect('/');
});

const getData = (id) => {
    return new Promise((resolve, reject) => {
        getGameInfo(id)
            .then((result) => {
                if (result) {
                    return resolve(result);
                } else {
                    return searchSteamCMD(id);
                }
            })
            .then((result = null) => {
                if (result) {
                    resolve(result);
                    return cacheGameInfo(result);
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export default router;