import Router from 'express';
import { getAppInfo } from 'steamcmd';
import { cacheData, getGameData } from '../helpers/db';
import buildZip from '../helpers/zip-builder';
import escapePath from '../utils/escapePath';
import getName from '../utils/getName';
import getPath from '../utils/getPath';
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

const searchSteamCMD = function searchSteamCMD(id) {
    return getAppInfo(id)
        .then((result) => {
            //Some game are missing fundamental information in their json (e.g. CSGO).
            if (JSON.stringify(result) == '{}' || !result.hasOwnProperty('config')) return null;
            const path = escapePath(getPath(result));
            const name = getName(result);
            //Cache the data in the db, so we can use it in subsequent search, no need to await it.
            cacheData(id, name, path);
            return { id, name, path };
        });
}

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