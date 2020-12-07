import Router from 'express';
import { getGameInfo, cacheGameInfo } from '../helpers/db';
import buildZip from '../helpers/zip-builder';
import searchSteamCMD from '../helpers/steam-cmd';
import { ERRORS } from '../config/constants';

const router = Router();

router.get('/download/:id', (req, res) => {
    const id = parseFloat(req.params.id);
    //Catch all malformed id (e.g. if the user try to directly input the id in the link).
    if (id == null && !Number.isInteger(id) && isNaN(id)) return res.status(400).json({});
    getData(id)
        .then((result) => {
            return Promise.all([buildZip({ id: result.id, gamePath: result.path, dlc: req.query.dlc }), result.name]);
        })
        .then(([path, name]) => {
            res.download(path, `${name.toLowerCase()}.zip`);
        })
        .catch((err) => {
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
                if (result) return resolve(result)
                return Promise.all([searchSteamCMD(id), result == null]);
            })
            .then(([result, toCache]) => {
                if (toCache) {
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