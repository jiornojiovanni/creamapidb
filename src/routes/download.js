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
            if (!result) throw new Error(ERRORS.MISSING_DATA);
            return Promise.all([buildZip({ id: result.id, gamepath: result.path }), result.name]);
        })
        .then(([path, name]) => {
            res.download(path, `${name.toLowerCase()}.zip`);
        })
        .catch((err) => {
            res.json({ err: err.message });
        });
});

router.get('/download', (req, res) => {
    res.redirect('/');
});

const getData = (id) => {
    return new Promise(async (resolve, reject) => {
        const result = await getGameInfo(id);
        if (result) return resolve(result);
        const steam_result = await searchSteamCMD(id);
        cacheGameInfo(steam_result);
        resolve(steam_result);
    });
}

export default router;