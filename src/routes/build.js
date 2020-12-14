import Router from 'express';
import searchSteamCMD from '../helpers/steam-cmd';
import { ERRORS } from '../config/constants';
import { getGameInfo, cacheGameInfo } from '../helpers/db';

const router = Router();

router.post('/build', (req, res) => {
    const appid = req.body.appid || null;
    if (appid === null) return res.status(400).json({ code: 400, message: 'Bad request.' });
    getGameInfo(appid)
        .then((doc) => {
            if (doc) throw Error(ERRORS.ALREADY_BUILT);
            else return searchSteamCMD(appid);
        })
        .then((appInfo) => {
            return cacheGameInfo(appInfo);
        })
        .then(() => {
            return res.status(200).json({ appid, success: true });
        }) 
        .catch((err) => {
            res.status(500).json({ code: 500, message: err.message });
        });
});

router.get('/build', (req, res) => {
    res.redirect('/');
});

export default router;