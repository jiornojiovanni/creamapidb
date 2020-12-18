import Router from 'express';
import searchSteamCMD from '../helpers/steam-cmd';
import { ERRORS } from '../config/constants';
import { getGameInfo, cacheGameInfo } from '../helpers/db';
import BadRequest from '../errors/bad-request';
import GeneralError from '../errors/general-error';

const router = Router();

router.post('/build', (req, res, next) => {
    const appid = req.body.appid || null;
    if (appid === null) return next(new BadRequest());
    getGameInfo(appid)
        .then((doc) => {
            if (doc) throw new GeneralError(ERRORS.ALREADY_BUILT);
            else return searchSteamCMD(appid);
        })
        .then((appInfo) => cacheGameInfo(appInfo))
        .then(() => res.status(200).json({ appid, success: true }))
        .catch((err) => {
            next(err);
        });
    return null;
});

router.get('/build', (req, res) => {
    res.redirect('/');
});

export default router;
