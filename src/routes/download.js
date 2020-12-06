import Router from 'express';
import { getGameData } from '../helpers/db';
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
            res.download(path, name + '.zip');
        })
        .catch((err) => {
            res.json({ err: err.message });
        });
});

router.get('/download', (req, res) => {
    res.redirect('/');
});

const getData = function getData(id) {
    return new Promise((resolve, reject) => {
        getGameData(id)
            .then((result) => {
                if (result)
                    return (result);
                else
                    return (searchSteamCMD(id))
            })
            .then((result) => {
                resolve(result);
            });
    });
}

export default router;